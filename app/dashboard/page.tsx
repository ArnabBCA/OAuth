"use client";

import { useAuth } from "@/lib/context/authContext";
import Link from "next/link";
import React, { useEffect } from "react";

const page = () => {
  const { login, loading, user } = useAuth();

  console.log(user);
  return (
    <div>
      <h1>Dashboard Page</h1>
      <Link href="/">Home</Link>
      <button>ShowTokens</button>
      <button onClick={login}>Login</button>
    </div>
  );
};

export default page;
