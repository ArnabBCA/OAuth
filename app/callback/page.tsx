"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OAuthClient } from "@/utils/oauth/oauthclient";

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  let used=false;

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      return;
    }

    if (code && !used) {
      const client = new OAuthClient({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
        clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
        redirectUri: process.env.NEXT_PUBLIC_CALLBACK_URL!,
        authorizationUrl: process.env.NEXT_PUBLIC_AUTHORIZATION_URL!,
        tokenUrl: process.env.NEXT_PUBLIC_TOKEN_URL!,
        scopes: ["openid", "profile", "email"],
      });
      used = true;
      const params = new URLSearchParams(window.location.search);
      client
        .handleCallback(params)
        .then((tokens) => {
          console.log("Tokens received:", tokens);
          localStorage.setItem("accessToken", tokens.access_token);
          router.push("/");
        })
        .catch((error) => {
          console.error("Error during OAuth callback:", error);
        });
    }
  }, []);

  return (
    <div>
      <h1>Processing Login...</h1>
    </div>
  );
};

export default CallbackPage;
