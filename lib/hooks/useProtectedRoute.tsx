"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "../context/authContextProvider";

import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { authUserInfo, loading, refreshToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!refreshToken) {
      router.push("/login"); // Redirect to login page
    }
  }, [loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authUserInfo ? children : null;
};

export default ProtectedRoute;