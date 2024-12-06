import { OAuthClient } from "./utils/types/types";

export const oauthclientConfig: OAuthClient = {
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
  redirectUri: process.env.NEXT_PUBLIC_CALLBACK_URL!,
  logoutUri: process.env.NEXT_PUBLIC_LOGOUT_URL!,
  domain: process.env.NEXT_PUBLIC_DOMAIN!,

  scopes: ["openid", "profile", "email", "offline"],
};
