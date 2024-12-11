"use server";

import { authMiddleware } from "./lib/server/authMiddleware";
import { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  return authMiddleware(req);
}

export const config = {
  matcher: ["/"],
};
