import axios from "axios";
import crypto from "crypto";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
}

export interface OAuthClientConfig {
  clientId: string;
  redirectUri: string;
  authorizationUrl: string;
  tokenUrl: string;
  scopes: string[];
}

const DEFAUlt_LAKE =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const generateRandomString = (len = 128, take = DEFAUlt_LAKE) => {
  let result = "";
  for (let i = 0; i < len; i++) {
    result += take.charAt(Math.floor(Math.random() * take.length));
  }
  return result;
};

export class OAuthClient {
  private config: OAuthClientConfig;
  private state: string = generateRandomString(16);

  constructor(config: OAuthClientConfig) {
    this.config = config;
  }

  private generateCodeVerifier(): string {
    const verifier = generateRandomString(128);
    sessionStorage.setItem("code_verifier", verifier);
    return verifier;
  }

  private getCodeVerifier(): string | null {
    return sessionStorage.getItem("code_verifier");
  }

  private generateCodeChallenge(verifier: string): string {
    const hash = crypto.createHash("sha256").update(verifier).digest("base64");
    return hash.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  public startAuthFlow(): void {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);

    const authUrl = `${
      this.config.authorizationUrl
    }?response_type=code&client_id=${
      this.config.clientId
    }&redirect_uri=${encodeURIComponent(
      this.config.redirectUri
    )}&scope=${this.config.scopes.join(" ")}&state=${
      this.state
    }&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    window.location.href = authUrl;
  }

  public async handleCallback(
    callbackParams: URLSearchParams
  ): Promise<TokenResponse> {
    const code = callbackParams.get("code");
    if (!code) {
      throw new Error("No authorization code received.");
    }

    const codeVerifier = this.getCodeVerifier();
    if (!codeVerifier) {
      throw new Error("Code verifier is missing.");
    }

    const tokenResponse = await this.exchangeCodeForTokens(code, codeVerifier);
    return tokenResponse;
  }

  private async exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<TokenResponse> {
    try {
      const params = new URLSearchParams({
        client_id: this.config.clientId,
        code,
        redirect_uri: this.config.redirectUri,
        grant_type: "authorization_code",
        code_verifier: codeVerifier,
      });
      const response = await axios.post(this.config.tokenUrl, params);
      return response.data;
    } catch (error: any) {
      console.error("Error exchanging code for tokens:", error);
      throw new Error("Error exchanging code for tokens.");
    }
  }
}
