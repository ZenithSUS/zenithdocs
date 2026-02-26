import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error.js";
import jwt from "jsonwebtoken";
import config from "../config/env.js";
import { getUserById } from "../repositories/user.repository.js";
import { RefreshTokenPayload } from "../types/express.js";

const refreshProtect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

    if (!refreshToken) {
      return next(new AppError("No refresh token provided", 401));
    }

    const decoded = jwt.verify(
      refreshToken,
      config.jwt.refreshSecret,
    ) as RefreshTokenPayload;

    const user = await getUserById(decoded.userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.refreshTokenPayload = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Refresh token expired", 403));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid refresh token", 403));
    }

    return next(error);
  }
};

export default refreshProtect;
