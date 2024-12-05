"use client";
import React from "react";
import { OAuthClient } from "@/utils/oauth/oauthclient";

const LoginPage = () => {
  const client = new OAuthClient({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
    redirectUri: process.env.NEXT_PUBLIC_CALLBACK_URL!,
    authorizationUrl: process.env.NEXT_PUBLIC_AUTHORIZATION_URL!,
    tokenUrl: process.env.NEXT_PUBLIC_TOKEN_URL!,
    scopes: ["openid", "profile", "email"],
  });

  const handleLogin = () => {
    client.startAuthFlow();
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login with OAuth</button>
    </div>
  );
};

export default LoginPage;
