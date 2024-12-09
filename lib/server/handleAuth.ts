import { NextRequest, NextResponse } from "next/server";
import { LoginWithRedirect } from "./actions/login";
import { LogoutWithRedirect } from "./actions/logout";
import { CallbackWithRedirect } from "./actions/callback";
import { UserInfo } from "./actions/userInfo";

export const handleAuth = () => {
  return async (req: NextRequest) => {
    const path = req.nextUrl.pathname.split("/").pop();
    switch (path) {
      case "login":
        return LoginWithRedirect();
      case "logout":
        return LogoutWithRedirect();
      case "callback":
        return CallbackWithRedirect(req);
      case "me":
        return UserInfo(req);
      default:
        return new NextResponse("Route Not Found", { status: 404 });
    }
  };
};
