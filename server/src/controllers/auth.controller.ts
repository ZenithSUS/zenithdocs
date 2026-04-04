import { NextFunction, Request, Response } from "express";
import {
  loginService,
  logoutService,
  oauthLoginService,
  refreshAccessTokenService,
  registerService,
} from "../services/auth.service.js";
import { getUserByIdService } from "../services/user.service.js";
import AppError from "../utils/app-error.js";
import { IUser } from "../models/user.model.js";
import config from "../config/env.js";

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

    const result = await loginService(email, password, req);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user using OAuth credentials
 * @route POST /api/auth/google/callback
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function (for error handling)
 * @returns {Promise<Response>} - Response object with logged in user data
 */

export const oauthLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as unknown as Omit<IUser, "password">;

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const result = await oauthLoginService(user, req);

    const { accessToken, refreshToken } = result;

    return res.redirect(
      `${config.client.baseUrl}/success?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
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
    const { refreshToken } = req.body;
    const userId = req.user.sub;

    await logoutService(userId, refreshToken);

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
    const { refreshToken }: { refreshToken: string } = req.body;

    if (!refreshToken) {
      throw new AppError("No refresh token provided", 401);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await refreshAccessTokenService(refreshToken, req);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    next(error);
  }
};
