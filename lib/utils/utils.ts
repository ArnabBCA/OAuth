import { authClientConfig } from "@/lib/authClientConfig";
import { jwtVerify } from "jose";

const domain = authClientConfig.domain;

const getKey = async (kid: string) => {
  const jwksUri = `${domain}/.well-known/jwks.json`;
  const response = await fetch(jwksUri);
  const jwks = await response.json();

  const key = jwks.keys.find((key: any) => key.kid === kid);
  if (!key) {
    throw new Error("Key not found for the provided kid");
  }
  return key;
};

export const verifyJWTToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, async (header) => {
      if (!header.kid) {
        throw new Error("Token does not contain a 'kid' in the header.");
      }
      return await getKey(header.kid);
    });
    return payload;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
};

export const isClientSide = (): boolean => typeof window !== "undefined";

export const generateRandomString = (
  len = 128,
  chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
): string => {
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const clearUrlParams = () => {
  const url = new URL(window.location.toString());
  url.search = "";
  window.history.pushState({}, "", url);
};

export const setRefreshToken = (tokens: string) => {
  localStorage.setItem("refresh_token", tokens);
};

export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

export const clearRefreshToken = () => {
  localStorage.removeItem("refresh_token");
};
