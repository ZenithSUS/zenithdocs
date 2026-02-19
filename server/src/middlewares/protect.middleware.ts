import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env.js";
import AppError from "../utils/app-error.js";
import { JwtPayload } from "../types/express.js";

const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized access", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 403));
  }
};

export default protect;
