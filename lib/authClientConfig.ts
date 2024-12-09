import { OAuthClient } from "./types/types";

export const authClientConfig: OAuthClient = {
  domain: process.env.NEXT_PUBLIC_DOMAIN!,
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
  audience: process.env.NEXT_PUBLIC_AUDIENCE_TARGET_API!,
  redirectUri: process.env.NEXT_PUBLIC_CALLBACK_URL!,
  logoutUri: process.env.NEXT_PUBLIC_LOGOUT_URL!,

  scopes: ["openid", "profile", "email", "offline_access"],
};
