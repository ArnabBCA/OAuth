"use client";

import { oauthclientConfig } from "@/OAuthClientConfig";
import useAuth from "@/lib/context/authContextProvider";
import { useOAuthClient } from "@/lib/oAuthClient";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const { handleCallback, logout, refreshToken } = useOAuthClient();
  const {
    accessToken,
    setAccessToken,
    refreshToken: authRefreshToken,
    setRefreshToken,
    authUserInfo,
    initializeAuth,
  } = useAuth();

  const isCallbackHandled = useRef(false);

  const handleAuthCallback = async () => {
    if (!isCallbackHandled.current) {
      isCallbackHandled.current = true;
      try {
        const res = await handleCallback(oauthclientConfig, searchParams);
        if (res) {
          console.log("Token response:", res);
          setAccessToken(res.access_token);
          setRefreshToken(res.refresh_token);
        }
      } catch (error) {
        console.error("Error handling callback:", error);
      }
    }
  };

  const handleLogout = () => {
    logout(oauthclientConfig);
  };

  const handleRefreshToken = async () => {
    try {
      const res = await refreshToken(oauthclientConfig, authRefreshToken);
      console.log("Refresh token response:", res);
      setAccessToken(res.access_token);
      setRefreshToken(res.refresh_token);
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  const showTokens = () => {
    console.log("Access token:", accessToken);
    console.log("Refresh token:", authRefreshToken);
    console.log("User info:", authUserInfo);
  };

  useEffect(() => {
    handleAuthCallback();
  }, []);

  useEffect(() => {
    showTokens();
  }, [authUserInfo]);

  return (
    <div className="w-full h-full flex flex-col">
      <h1>Home</h1>
      <button onClick={handleLogout}>Logout</button>
      <button type="button" onClick={handleRefreshToken}>
        Refresh token
      </button>
      <button onClick={showTokens}>Show Tokens and User details</button>
    </div>
  );
}
