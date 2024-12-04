import axios from "axios";
import qs from "qs";
import { NextResponse } from "next/server";

interface GoogleTokensResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
}

export async function getGoogleOAuthTokens({
  code,
}: {
  code: string;
}): Promise<GoogleTokensResult> {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL!,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post<GoogleTokensResult>(
      url,
      qs.stringify(values),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return res.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch Google OAuth Tokens:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch Google OAuth Tokens");
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Missing OAuth code" },
        { status: 400 }
      );
    }
    
    const tokens = await getGoogleOAuthTokens({ code });
    const { id_token, access_token } = tokens;

    console.log("Tokens received", { id_token, access_token });

    return NextResponse.json({ id_token, access_token });
  } catch (error) {
    console.error("Error in Google OAuth Handler:", error);
    return NextResponse.json({ error: "OAuth failed" }, { status: 500 });
  }
}
