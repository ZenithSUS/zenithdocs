import { NextFunction, Request, Response } from "express";
import {
  loginService,
  logoutService,
  refreshAccessTokenService,
  registerService,
} from "../services/auth.service.js";
import { getUserByIdService } from "../services/user.service.js";
import AppError from "../utils/app-error.js";
import {
  clearRefreshTokenCookieOptions,
  getRefreshTokenCookieOptions,
} from "../utils/cookie-options.js";

/**
 * Login user
 * @route POST /api/auth/login
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const result = await loginService(email, password);

    res.cookie(
      "refreshToken",
      result.refreshToken,
      getRefreshTokenCookieOptions(),
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await registerService({
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * @route POST /api/auth/logout
 */
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.cookies;
    const { id }: { id: string } = req.body;

    // If refresh token exists, invalidate it
    if (refreshToken && id) {
      await logoutService(id);
    }

    // Always clear cookie
    res.clearCookie("refreshToken", clearRefreshTokenCookieOptions());

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by access token
 * @route GET /api/auth/users/me
 *
 */
export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.sub;
    const user = await getUserByIdService(userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 * @route POST /api/auth/auth/refresh
 */
export const refreshAccessTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Read token from httpOnly cookie
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new AppError("No refresh token provided", 401);
    }

    const { accessToken } = await refreshAccessTokenService(refreshToken);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};
