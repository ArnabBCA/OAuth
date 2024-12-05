import axios from "axios";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
}

export interface OAuthClientConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationUrl: string;
  tokenUrl: string;
  scopes: string[];
}

const DEFAUlt_LAKE =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateRandomString = (len = 10, take = DEFAUlt_LAKE) => {
  let result = "";
  for (let i = 0; i < len; i++) {
    result += take.charAt(Math.floor(Math.random() * take.length));
  }
  return result;
};

export class OAuthClient {
  private config: OAuthClientConfig;

  constructor(config: OAuthClientConfig) {
    this.config = config;
  }

  private state: string = generateRandomString(16);

  public startAuthFlow(): void {
    const authUrl = `${
      this.config.authorizationUrl
    }?response_type=code&client_id=${
      this.config.clientId
    }&redirect_uri=${encodeURIComponent(
      this.config.redirectUri
    )}&scope=${this.config.scopes.join(" ")}&state=${this.state}`;
    window.location.href = authUrl;
  }

  public async handleCallback(
    callbackParams: URLSearchParams
  ): Promise<TokenResponse> {
    const code = callbackParams.get("code");
    if (!code) {
      throw new Error("No authorization code received.");
    }
    const tokenResponse = await this.exchangeCodeForTokens(code);
    return tokenResponse;
  }

  private async exchangeCodeForTokens(code: string): Promise<TokenResponse> {
    try {
      const response = await axios.post(
        this.config.tokenUrl,
        new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          code,
          redirect_uri: this.config.redirectUri,
          grant_type: "authorization_code",
        })
      );
      const userInfo = await getUserInfo(response.data.access_token);
      console.log("User Info:", userInfo);
      return response.data;
    } catch (error: any) {
      console.error("Error exchanging code for tokens:", error);
      throw new Error("Error exchanging code for tokens.");
    }
  }
}

const getUserInfo = async (accessToken: string) => {
  const response = await axios.get(
    "https://dev-ym10sclbxl8s1qf4.us.auth0.com/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

/*

export class OAuthClient {
  private config: OAuthClientConfig;

  constructor(config: OAuthClientConfig) {
    this.config = config;
  }

  startAuthFlow(): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(" "),
    });

    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  async handleCallback(
    callbackParams: Record<string, string>
  ): Promise<TokenResponse> {
    if (!callbackParams.code) {
      throw new Error("Authorization code is missing");
    }

    const data = qs.stringify({
      grant_type: "authorization_code",
      code: callbackParams.code,
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
      ...(this.config.clientSecret && {
        client_secret: this.config.clientSecret,
      }),
    });

    const response = await axios.post(this.config.tokenUrl, data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    console.log("Response:", response.data);

    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const data = qs.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.config.clientId,
      ...(this.config.clientSecret && {
        client_secret: this.config.clientSecret,
      }),
    });

    const response = await axios.post(this.config.tokenUrl, data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  }
}
*/
