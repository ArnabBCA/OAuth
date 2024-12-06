"use client";

import { oauthclientConfig } from "@/OAuthClientConfig";
import { useOAuthClient } from "@/utils/oAuthClient";
import { TokenResponse } from "@/utils/types/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const { handleCallback, logout, refreshToken } = useOAuthClient();
  const [token, setToken] = useState<TokenResponse>();
  const isCallbackHandled = useRef(false);

  const handleAuthCallback = async () => {
    if (!isCallbackHandled.current) {
      isCallbackHandled.current = true;
      try {
        const res = await handleCallback(oauthclientConfig, searchParams);
        if (res) {
          console.log("Token response:", res);
          setToken(res);
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
    console.log("Refreshing token...", token);
    try {
      if (token && token.refresh_token) {
        const res = await refreshToken(oauthclientConfig, token.refresh_token);
        console.log("Refresh token response:", res);
        setToken(res);
      } else {
        console.error("Refresh token is undefined", token);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  useEffect(() => {
    handleAuthCallback();
  }, []);

  return (
    <div className="w-full h-full">
      <h1>Home</h1>
      <button onClick={handleLogout}>Logout</button>
      <button type="button" onClick={handleRefreshToken}>
        Refresh token
      </button>
      <button onClick={() => console.log("Current Token:", token)}>
        Show State
      </button>
    </div>
  );
}
