"use client";
import { useRouter } from "next/navigation";

import { oauthclientConfig } from "@/OAuthClientConfig";
import { useOAuthClient } from "@/lib/oAuthClient";

const LoginPage = () => {
  const router = useRouter();
  const { startAuthFlow, logout } = useOAuthClient();
  const handleLogin = () => {
    const authUrl = startAuthFlow(oauthclientConfig);
    router.push(authUrl);
  };

  return (
    <div className="flex flex-col items-center w-full h-screen justify-center gap-4">
      <h1 className="text-md font-semibold">Login Page</h1>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={handleLogin}
        >
          Login with OAuth
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
