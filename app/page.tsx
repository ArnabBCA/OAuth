"use client";

import { oauthclientConfig } from "@/OAuthClientConfig";
import { useOAuthClient } from "@/utils/oAuthClient";
import { TokenResponse } from "@/utils/types/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const { handleCallback, logout, refreshToken } = useOAuthClient();
  const [token, setToken] = useState<TokenResponse | null>(null);
  const handleAuthCallback = async () => {
    try {
      const res = await handleCallback(oauthclientConfig, searchParams);
      if (res) {
        console.log("Token response:", res);
        setToken(res);
        sessionStorage.setItem("access_token", res.access_token);
      }
    } catch (error) {
      console.error("Error handling callback:", error);
    }
  };

  const handleLogout = () => {
    logout(oauthclientConfig);
  };

  const handleRefreshToken = async () => {
    if (token?.refresh_token) {
      const res = await refreshToken(oauthclientConfig, token.refresh_token);
      console.log("Refresh token response:", res);
      setToken(res);
    } else {
      console.error("Refresh token is undefined");
    }
  };

  useEffect(() => {
    handleAuthCallback();
  }, []);

  return (
    <div className="w-full h-full">
      <h1>Home</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleRefreshToken}>Refresh token</button>
    </div>
  );
}
