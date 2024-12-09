import axios from "axios";
import crypto from "crypto";
import { OAuthClient, TokenResponse } from "./types/types";
import { generateRandomString, isClientSide } from "./utils/utils";

export const useOAuthClient = () => {
  const startAuthFlow = (client: OAuthClient) => {
    try {
      const state = generateRandomString(16);
      const codeVerifier = generateRandomString(128);
      const codeChallenge = crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const url = `${client.domain}/authorize`;
      const params = new URLSearchParams({
        response_type: "code",
        client_id: client.clientId,
        redirect_uri: client.redirectUri,
        scope: client.scopes.join(" "),
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        audience: client.audience,
      });
      const authUrl = `${url}?${params.toString()}`;
      if (isClientSide()) {
        sessionStorage.setItem("oauth_state", state);
        sessionStorage.setItem("code_verifier", codeVerifier);
      }
      return { authUrl, state, codeVerifier };
    } catch (error) {
      console.error("Error starting the authentication flow:", error);
      throw new Error("Unable to start the OAuth authorization flow.");
    }
  };

  const handleCallback = async (
    client: OAuthClient,
    callbackParams: URLSearchParams,
    storedState?: string,
    storedVerifier?: string
  ): Promise<TokenResponse | null> => {
    try {
      const code = callbackParams.get("code");
      const returnedState = callbackParams.get("state");

      if (!code) {
        return null;
      }

      let codeVerifier: string | null;
      let state: string | null;

      if (isClientSide()) {
        codeVerifier = sessionStorage.getItem("code_verifier") || null;
        state = sessionStorage.getItem("oauth_state") || null;
      } else {
        codeVerifier = storedVerifier || null;
        state = storedState || null;
      }

      if (!codeVerifier || !state) {
        throw new Error("Missing code verifier or state.");
      }
      if (state !== returnedState) {
        throw new Error("State mismatch! Potential CSRF attack.");
      }

      const tokens = await exchangeCodeForTokens(client, code, codeVerifier);
      return tokens;
    } catch (error) {
      console.error("Error during the callback handling:", error);
      throw new Error("Error processing the callback.");
    }
  };

  const exchangeCodeForTokens = async (
    client: OAuthClient,
    code: string,
    codeVerifier: string
  ): Promise<TokenResponse> => {
    try {
      const params = new URLSearchParams({
        client_id: client.clientId,
        code,
        redirect_uri: client.redirectUri,
        grant_type: "authorization_code",
        code_verifier: codeVerifier,
      });

      const url = client.domain + "/oauth/token";
      const response = await axios.post(url, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      });

      if (response.data && response.data.access_token) {
        return response.data;
      } else {
        throw new Error("Token response is invalid or missing access_token.");
      }
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
      throw new Error("Error exchanging code for tokens.");
    }
  };

  const refreshToken = async (
    client: OAuthClient,
    refreshToken: string
  ): Promise<TokenResponse> => {
    try {
      const params = new URLSearchParams({
        client_id: client.clientId,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });
      const url = client.domain + "/oauth/token";
      const response = await axios.post(url, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      });

      if (response.data && response.data.access_token) {
        return response.data;
      } else {
        throw new Error("Token response is invalid or missing access_token.");
      }
    } catch (error: any) {
      if (error.status === 401 || error.status === 403) {
        console.log("Token expired. Redirecting to login page...");
      }
      throw new Error("Error refreshing token.");
    }
  };

  const logout = (client: OAuthClient) => {
    try {
      const params = new URLSearchParams({
        client_id: client.clientId,
        returnTo: client.logoutUri,
      });
      const logoutUrl = `${client.domain}/v2/logout?${params.toString()}`;
      return logoutUrl;
    } catch (error) {
      console.error("Error logging out:", error);
      throw new Error("Error logging out.");
    }
  };

  const getUserInfo = async (client: OAuthClient, access_token: string) => {
    try {
      const url = client.domain + "/userinfo";
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error getting user info:", error);
      throw new Error("Error getting user info.");
    }
  };
  return { startAuthFlow, handleCallback, refreshToken, logout, getUserInfo };
};
