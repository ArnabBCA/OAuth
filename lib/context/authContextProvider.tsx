"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useOAuthClient } from "../oAuthClient";
import { oauthclientConfig } from "@/OAuthClientConfig";
import { isAuthFlowInit, resetUrlandLocalStorage } from "../utils/utils";

interface AuthContextType {
  authLoaded: boolean;
  setAuthLoaded: (loaded: boolean) => void;
  accessToken: string;
  refreshToken: string;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  authUserInfo: any;
  initializeAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { getUserInfo, refreshToken } = useOAuthClient();
  const [accessToken, setAccessToken] = useState<string>("");
  const [authUserInfo, setAuthUserInfo] = useState<any>({});
  const [authLoaded, setAuthLoaded] = useState<boolean>(false);

  const updateRefreshToken = async (token: string) => {
    localStorage.setItem("refreshToken", token);
  };
  const updateAccessToken = async (token: string) => {
    setAccessToken(token);
  };
  const getRefreshTokenFromLocalStorage = () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("refreshToken") || "";
  };

  const initializeAuth = async () => {
    if (isAuthFlowInit()) return;
    const storedRefreshToken = getRefreshTokenFromLocalStorage();
    if (!storedRefreshToken) {
      resetUrlandLocalStorage(oauthclientConfig.logoutUri);
      return;
    }
    try {
      const res = await refreshToken(oauthclientConfig, storedRefreshToken);
      await updateAccessToken(res.access_token);
      await updateRefreshToken(res.refresh_token);
    } catch (error: any) {
      console.error("Failed to refresh access token:", error);
    }
  };

  const updateUserInfo = async () => {
    if (!accessToken) return;
    try {
      await getUserInfo(oauthclientConfig, accessToken).then((res) => {
        setAuthUserInfo(res);
      });
    } catch (error) {
      console.error("Error getting user info:", error);
    }
  };

  let flag = 0;

  useEffect(() => {
    if (flag === 1) return;
    initializeAuth();
    flag = 1;
  }, []);

  useEffect(() => {
    updateUserInfo();
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        authLoaded,
        setAuthLoaded,
        initializeAuth,
        accessToken,
        setAccessToken: updateAccessToken,
        refreshToken: getRefreshTokenFromLocalStorage(),
        setRefreshToken: updateRefreshToken,
        authUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
