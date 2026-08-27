import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";

/**
 * Check if a JWT token is expired
 * @param token JWT token string
 */
export const isTokenExpired = (token?: string): boolean => {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payloadBase64 = parts[1];
    if (!payloadBase64) return false;
    const decodedJson = atob(
      payloadBase64.replace(/-/g, "+").replace(/_/g, "/")
    );
    const payload = JSON.parse(decodedJson);
    if (!payload.exp) return false;
    // Expired or will expire within 5 seconds
    return Date.now() >= payload.exp * 1000 - 5000;
  } catch {
    return false;
  }
};

/**
 * Save access token to cookie
 * @param token Access token string
 * @param days Number of days until the cookie expires (default: 7)
 */
export const saveAccessToken = (token: string, days = 7) => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: days,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

/**
 * Get access token from cookie. If expired, removes the cookie and returns undefined.
 */
export const getAccessToken = (): string | undefined => {
  const token = Cookies.get(ACCESS_TOKEN_KEY);
  if (!token) return undefined;
  if (isTokenExpired(token)) {
    removeAccessToken();
    return undefined;
  }
  return token;
};

/**
 * Remove access token from cookie
 */
export const removeAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
};
