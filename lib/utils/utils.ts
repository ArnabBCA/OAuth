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
