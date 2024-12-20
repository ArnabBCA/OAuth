"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReactNode } from "react";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { loading, refreshToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!refreshToken) {
      router.push("/login");
    }
  }, [loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default ProtectedRoute;
