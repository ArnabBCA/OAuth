export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope: string;
}

export interface OAuthClient {
  domain: string;
  clientId: string;
  redirectUri: string;
  logoutUri: string;
  scopes: string[];
}
