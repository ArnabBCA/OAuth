# Library Ususge

# The library Exports the following methods

```js
import { useOAuthClient } from "@/lib/oAuthClient";

const {startAuthFlow, handleCallback, refreshToken, userInfo, logout, } = useOAuthClient();

// Returns the authorization URL
const authUrl = startAuthFlow(oauthclientConfig);

// Returns the (Access and Refresh tokens)
const tokens = handleCallback(oauthclientConfig, callbackParams);

// Returns new access and refresh token
const newTokens = refreshToken(oauthclientConfig, refreshToken);

// Returns the loggedin user info e.g. Name, Email etc
const userInfo = getUserInfo(oauthclientConfig, accesshToken);

logout(oauthclientConfig); // logout the current user
```

# The library also exports a authContextProvider which you have to wrap it in the root layout.tsx file

```js
import { AuthProvider } from "@/lib/context/authContextProvider";
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

# The `authContextProvider` exports the following methods

```js
import useAuth from "@/lib/context/authContextProvider";

const {
    accessToken, // returns the stored access token
    setAccessToken: (token: string) => void, // Function to update the access token
    refreshToken:  // returns the stored refresh token
    setRefreshToken: (token: string) => void, // Function to update the refresh token
    authUserInfo, // returns the loggedin user info
    loading, // returns a boolean value which indicated the loading state of the auth 
} = useAuth();
```
