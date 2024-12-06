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

export const resetUrlandLocalStorage = (logoutUri: string) => {
  localStorage.removeItem("refreshToken");
  if (window.location.href === logoutUri) return;
  window.location.href = logoutUri;
};

export const authFlowInit = () => {
  localStorage.setItem("isAuthFlowInit", "true");
};

export const removeAuthFlowInit = () => {
  localStorage.removeItem("isAuthFlowInit");
};

export const isAuthFlowInit = () => {
  return localStorage.getItem("isAuthFlowInit") === "true";
};
