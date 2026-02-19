import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env.js";
import AppError from "../utils/app-error.js";
import { JwtPayload } from "../types/express.js";
import { getUserById } from "../repositories/user.repository.js";

const protect = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized access", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;

    // Check if user exists
    const user = await getUserById(decoded.sub);
    if (!user) throw new AppError("Unauthorized access", 401);

    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid token", 401));
    }

    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Token expired", 401));
    }

    return next(error);
  }
};

export default protect;
