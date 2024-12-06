import axios from "axios";
import crypto from "crypto";
import { OAuthClient, TokenResponse } from "./types/types";
import {
  authFlowInit,
  clearUrlParams,
  generateRandomString,
  removeAuthFlowInit,
  resetUrlandLocalStorage,
} from "./utils/utils";

export const useOAuthClient = () => {
  const startAuthFlow = (client: OAuthClient): string => {
    try {
      authFlowInit();
      const state = generateRandomString(16);
      const codeVerifier = generateRandomString(128);
      sessionStorage.setItem("code_verifier", codeVerifier);

      const codeChallenge = crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const url = client.domain + "/authorize";

      const authUrl = `${url}?response_type=code&client_id=${
        client.clientId
      }&redirect_uri=${encodeURIComponent(
        client.redirectUri
      )}&scope=${client.scopes.join(
        " "
      )}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256&audience${
        client.audience
      }`;

      return authUrl;
    } catch (error) {
      console.error("Error starting the authentication flow:", error);
      throw new Error("Unable to start the OAuth authorization flow.");
    }
  };

  const handleCallback = async (
    client: OAuthClient,
    callbackParams: URLSearchParams
  ): Promise<TokenResponse | null> => {
    try {
      const code = callbackParams.get("code");
      if (!code) return null;
      const codeVerifier = sessionStorage.getItem("code_verifier");
      if (!codeVerifier) {
        console.error("Code verifier is missing in session storage.");
        throw new Error("Code verifier is missing.");
      }
      return await exchangeCodeForTokens(client, code, codeVerifier);
    } catch (error) {
      console.error("Error during the callback handling:", error);
      throw new Error("Error processing the callback.");
    } finally {
      clearUrlParams();
      removeAuthFlowInit();
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
        console.log(
          "Token expired. Redirecting to login page...",
          client.logoutUri
        );
        resetUrlandLocalStorage(client.logoutUri);
      }
      throw new Error("Error refreshing token.");
    }
  };

  const logout = async (client: OAuthClient) => {
    try {
      const url = client.domain + `/logout?redirect=${client.logoutUri}`;
      localStorage.clear();
      window.location.href = url.toString();
      console.log("Logingout...");
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
    } catch (error) {
      console.error("Error getting user info:", error);
      throw new Error("Error getting user info.");
    }
  };
  return { startAuthFlow, handleCallback, refreshToken, logout, getUserInfo };
};
