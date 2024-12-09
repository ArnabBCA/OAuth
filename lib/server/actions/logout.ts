"use server";

import { NextResponse } from "next/server";
import { authClientConfig } from "@/lib/authClientConfig";
import { cookies } from "next/headers";
import { useOAuthClient } from "@/lib/oAuthClient";

export async function LogoutWithRedirect() {
  const { logout } = useOAuthClient();
  const logoutUrl = logout(authClientConfig);
  try {
    cookies().delete("access_token");
    cookies().delete("refresh_token");
    cookies().delete("oauth_state");
    cookies().delete("code_verifier");
    return NextResponse.redirect(logoutUrl);
  } catch (error) {
    console.error("Error in OAuth handler:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
