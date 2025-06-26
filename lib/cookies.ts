import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";

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
 * Get access token from cookie
 */
export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

/**
 * Remove access token from cookie
 */
export const removeAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
};
