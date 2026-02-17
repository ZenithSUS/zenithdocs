import { Request, Response, NextFunction } from "express";
import colors from "../utils/log-colors.js";

interface AppError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;

  console.log("=".repeat(50));
  console.log(`${colors.red}Error: ${colors.reset}${err.message}`);
  console.log("=".repeat(50));

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
