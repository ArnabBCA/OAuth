"use client";

import { oauthclientConfig } from "@/OAuthClientConfig";
import useAuth from "@/lib/context/authContextProvider";
import { useOAuthClient } from "@/lib/oAuthClient";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleCallback, logout, refreshToken } = useOAuthClient();
  const {
    accessToken,
    setAccessToken,
    refreshToken: authRefreshToken,
    setRefreshToken,
    authUserInfo,
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
          router.push("/");
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
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <h1 className="text-md font-semibold">Home</h1>
      <div className="flex gap-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={handleRefreshToken}
        >
          Refresh token
        </button>
        <button
          onClick={showTokens}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Show Current State
        </button>
      </div>
      {authUserInfo && (
        <div className="rounded-lg border bg-card shadow-sm p-4">
          <h1>User Info</h1>
          <Image
            src={authUserInfo.picture}
            alt="User Image"
            width={100}
            height={100}
            className="rounded-full"
          />
          <div className="w-full">
            {Object.keys(authUserInfo).map((key) => (
              <div key={key}>
                <span>{key + ": " + authUserInfo[key]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
