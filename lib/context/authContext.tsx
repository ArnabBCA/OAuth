"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useOAuthClient } from "@/lib/oAuthClient";
import { authClientConfig } from "../authClientConfig";
import { useRouter, useSearchParams } from "next/navigation";
import {
  clearRefreshToken,
  clearUrlParams,
  getRefreshToken,
  setRefreshToken,
} from "../utils/utils";
import axios from "axios";

type AuthContextType = {
  refreshToken: () => void;
  login: () => void;
  logout: () => void;
  loading: boolean;
  user: any | null;
  useServerSide: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  useServerSide?: boolean;
}> = ({ children, useServerSide = false }) => {
  const {
    handleCallback,
    refreshToken,
    startAuthFlow,
    logout: logoutOAuth,
    getUserInfo,
  } = useOAuthClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);
  const [access_token, setAccessToken] = useState<string | null>(null);

  const isCallbackHandled = useRef(false);
  const isRefreshTokenCalled = useRef(false);

  const handleAuthCallback = async () => {
    try {
      const tokens = await handleCallback(authClientConfig, searchParams);
      if (!tokens) return;
      setAccessToken(tokens.access_token);
      setRefreshToken(tokens.refresh_token);
    } catch (err) {
      console.error("Error handling auth callback:", err);
    } finally {
      clearUrlParams();
    }
  };

  const refreshAuthToken = async () => {
    const refresh_token = getRefreshToken();
    if (!refresh_token) {
      setLoading(false);
      clearRefreshToken();
      return;
    }
    try {
      const newTokens = await refreshToken(authClientConfig, refresh_token);
      setAccessToken(newTokens.access_token);
      setRefreshToken(newTokens.refresh_token);
    } catch (err) {
      console.error("Error refreshing token:", err);
      setLoading(false);
      clearRefreshToken();
      router.push("/login");
    }
  };

  const getUser = async () => {
    if (access_token) {
      try {
        const userInfo = await getUserInfo(authClientConfig, access_token);
        setUser(userInfo);
      } catch (err) {
        console.error("Error getting user info:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchUserFromApi = async () => {
    try {
      const res = await axios.get("/api/auth/me", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error getting user info:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [access_token]);

  useEffect(() => {
    if (useServerSide) {
      fetchUserFromApi();
    } else {
      if (!isCallbackHandled.current) {
        isCallbackHandled.current = true;
        handleAuthCallback();
      }
      if (!isRefreshTokenCalled.current) {
        isRefreshTokenCalled.current = true;
        refreshAuthToken();
      }
    }
  }, []);

  const login = () => {
    if (useServerSide) {
      window.location.href = "/api/auth/login";
    } else {
      const { authUrl } = startAuthFlow(authClientConfig);
      window.location.href = authUrl;
    }
  };

  const logout = () => {
    if (useServerSide) {
      window.location.href = "/api/auth/logout";
    } else {
      clearRefreshToken();
      const logoutUrl = logoutOAuth(authClientConfig);
      window.location.href = logoutUrl;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        refreshToken: refreshAuthToken,
        loading,
        user,
        useServerSide,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
