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
    <div>
      <div>
        <p>Click the button below to login using OAuth:</p>
        <button onClick={handleLogin}>Login with OAuth</button>
      </div>
      {/*!token ? (
        <div>
          <p>Click the button below to login using OAuth:</p>
          <button onClick={handleLogin}>Login with OAuth</button>
        </div>
      ) : (
        <div>
          <h2>Logged in!</h2>
          <p>Access Token: {token.access_token}</p>
        </div>
      )*/}
    </div>
  );
};

export default LoginPage;
