# A Next.js OAuth 2.0 library

## This library uses the AuthO by Okta Authentication API. The Libary can be used in both Client and Server side Authentication. This library Uses PKCE, or Proof Key for Code Exchange protocol by OAuth 2.0.


### To Setup the demo Project follow this [SETUP GUIDE](./SETUP.md)


### The library Exports the following methods
```js
import { useOAuthClient } from "@/lib/oAuthClient";

const {startAuthFlow, handleCallback, refreshToken, userInfo, logout} = useOAuthClient();

// Returns the authorization URl, state and codeVerifier (The state and codeVerifier is used in the server side to set cookies)
const { authUrl, state, codeVerifier } = startAuthFlow(authClientConfig);

// Returns the Access and Refresh tokens (The storedState, toredVerifier are optional parameters these are passed during server side auth
const tokens = handleCallback(authClientConfig, callbackParams , storedState?, toredVerifier?);

// Returns new access and refresh token
const newTokens = refreshToken(authClientConfig, refreshToken);

// Returns the loggedin user info e.g. Name, Email etc
const userInfo = getUserInfo(oauthclientConfig, accesshToken);

// Returns the Logout URL which is used to logout the current user.
const logoutUrl = logout(authClientConfig);
```

### Next.js Usuage

#### Before Proceding make sure you have the following `.env.local` variables and placed in the root folder

```bash
NEXT_PUBLIC_DOMAIN=(yourkey)
NEXT_PUBLIC_CLIENT_ID=(yourkey)
NEXT_PUBLIC_AUDIENCE_TARGET_API=(yourkey)

NEXT_PUBLIC_CALLBACK_URL=http://localhost:3000 (For client side auth) or http://localhost:3000/api/auth/callback (For server side auth)
NEXT_PUBLIC_LOGOUT_URL=http://localhost:3000/login
```

### To use the library in the Client side

#### Step 1 : Make sure your `.env.local` matches and rest of the .env.local variables

```
NEXT_PUBLIC_CALLBACK_URL=http://localhost:3000
```

#### Step 2 The library exports a AuthProvider which you have to wrap it in the root layout.tsx file

```js
import { AuthProvider } from "@/lib/context/authContext";
/**
 * Other imports
 * Root layout component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

#### Step 3: The `authContextProvider` exports the following methods
```js
import { useAuth } from "@/lib/context/authContext";

const {
    login, // Funtion to start the startAuthFlow()
    logout, // Funtion to logout the user()
    user, // returns the loggedin user info
    loading, // returns a boolean value which indicated the loading state of the user 
} = useAuth();
```

### To use the library in the server side follow the previous steps.

#### Step 1 : Make sure your `.env.local` matches and rest of the .env.local variables
```
NEXT_PUBLIC_CALLBACK_URL=http://localhost:3000/api/auth/callback
```

#### Step 2: Create a route.ts file in this directory `app\api\auth\[authO]\route.ts` and import the `handleAuth()` like bellow

```js
import { handleAuth } from "@/lib/server/handleAuth";

export const GET = handleAuth();
```
##### This will automatically create these routes
```
/api/auth/callback
/api/auth/login
/api/auth/logout
/api/auth/me
```

#### Step 3 : Add the `useServerSide` flag in the AuthProvider
```js
<AuthProvider useServerSide>{children}</AuthProvider>
```
##### This will disable client side functionality and switch to server side, for example the login() function which we were previously using in the client side will now be used to initiate the login process in the server side `/api/auth/login`


#### Step 4 : Create a `middleware.ts` file in the root folder and import the `authMiddleware()` and add the routes you want to protect in the config.


```js
"use server";

import { authMiddleware } from "./lib/server/authMiddleware";
import { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  return authMiddleware(req);
}

export const config = {
  matcher: ["/"],
};

```


