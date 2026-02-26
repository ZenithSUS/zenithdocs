import { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProduction, // false on localhost, true in prod
  sameSite: isProduction ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});

export const clearRefreshTokenCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  expires: new Date(0), // more explicit than maxAge: 0
  path: "/",
});
