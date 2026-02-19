import { NextFunction, Request, Response } from "express";
import {
  loginService,
  refreshAccessTokenService,
  registerService,
} from "../services/auth.service.js";
import {
  getUserByEmailService,
  getUserByIdService,
} from "../services/user.service.js";

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

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Register a new user
 * @route POST /api/auth/users
 */
export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, role, tokensUsed } = req.body;

    const user = await registerService({
      email,
      password,
      role: role || "user",
      tokensUsed: tokensUsed || 0,
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
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
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
