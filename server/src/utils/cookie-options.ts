import { CookieOptions } from "express";

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});

export const clearRefreshTokenCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 0,
  path: "/",
});
