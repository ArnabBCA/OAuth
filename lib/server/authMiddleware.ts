"use server";

import { NextRequest, NextResponse } from "next/server";
import { verifyJWTToken } from "../utils/utils";
import { authClientConfig } from "../authClientConfig";
import { useOAuthClient } from "../oAuthClient";

export async function authMiddleware(req: NextRequest) {
  const { refreshToken } = useOAuthClient();
  const access_token = req.cookies.get("access_token")?.value;
  const refresh_token = req.cookies.get("refresh_token")?.value;
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";

  if (!access_token) {
    return NextResponse.redirect(loginUrl);
  }

  const getDecodedToken = async (token: string) => {
    try {
      return await verifyJWTToken(token);
    } catch (error) {
      console.error("Error verifying token:", error);
      return null;
    }
  };

  const decodedToken = await getDecodedToken(access_token);

  if (!decodedToken) {
    if (refresh_token) {
      try {
        const newTokens = await refreshToken(authClientConfig, refresh_token);
        const response = NextResponse.next();

        response.cookies.set("access_token", newTokens.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          expires: new Date(Date.now() + newTokens.expires_in * 1000),
        });
        response.cookies.set("refresh_token", newTokens.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        return response;
      } catch (error) {
        return NextResponse.redirect(loginUrl);
      }
    } else {
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}
