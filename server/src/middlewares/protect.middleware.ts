import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env.js";
import AppError from "../utils/app-error.js";
import { JwtPayload } from "../types/express.js";
import { getUserById } from "../repositories/user.repository.js";

const protect = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.setHeader("x-auth-error", "missing_token");
    return next(new AppError("Unauthorized access", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
    const user = await getUserById(decoded.sub);
    if (!user) {
      res.setHeader("x-auth-error", "user_not_found");
      return next(new AppError("Unauthorized access", 401));
    }

    // Attach user to request
    req.user = {
      sub: user._id.toString(),
      role: user.role,
      plan: user.plan,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.setHeader("x-auth-error", "token_expired");
      return next(new AppError("Token expired", 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.setHeader("x-auth-error", "invalid_token");
      return next(new AppError("Invalid token", 401));
    }
    return next(error);
  }
};

export default protect;
