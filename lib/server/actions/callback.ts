"use server";

import { NextRequest, NextResponse } from "next/server";
import { authClientConfig } from "@/lib/authClientConfig";
import { useOAuthClient } from "@/lib/oAuthClient";
import { cookies } from "next/headers";

export async function CallbackWithRedirect(
  req: NextRequest
): Promise<NextResponse> {
  const { handleCallback } = useOAuthClient();
  try {
    const { searchParams } = req.nextUrl;
    const code = searchParams.get("code");

    const storedState = cookies().get("oauth_state");
    const storedCodeVerifier = cookies().get("code_verifier");

    if (!code) {
      return NextResponse.json(
        { error: "Code parameter is missing" },
        { status: 400 }
      );
    }
    const tokens = await handleCallback(
      authClientConfig,
      searchParams,
      storedState?.value,
      storedCodeVerifier?.value
    );

    if (!tokens) {
      return NextResponse.json(
        { error: "Failed to get tokens" },
        { status: 500 }
      );
    }

    cookies().set("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    cookies().set("access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + tokens.expires_in * 1000),
    });

    return NextResponse.redirect(req.nextUrl.origin);
  } catch (error) {
    console.error("Error in handling callback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
