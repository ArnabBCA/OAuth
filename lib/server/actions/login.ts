"use server";

import { NextResponse } from "next/server";
import { useOAuthClient } from "@/lib/oAuthClient";
import { authClientConfig } from "@/lib/authClientConfig";
import { cookies } from "next/headers";

export async function LoginWithRedirect() {
  try {
    const { authUrl, state, codeVerifier } =
      useOAuthClient().startAuthFlow(authClientConfig);
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000);
    cookies().set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresIn,
    });
    cookies().set("code_verifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresIn,
    });
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error in OAuth handler:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
