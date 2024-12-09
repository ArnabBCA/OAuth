"use server";

import { authClientConfig } from "@/lib/authClientConfig";
import { useOAuthClient } from "@/lib/oAuthClient";
import { NextRequest, NextResponse } from "next/server";

export async function UserInfo(req: NextRequest) {
  const { getUserInfo } = useOAuthClient();
  const access_token = req.cookies.get("access_token")?.value;
  if (!access_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const user = await getUserInfo(authClientConfig, access_token);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to get user info", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
