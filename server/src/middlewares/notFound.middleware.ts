import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error.js";
import colors from "../utils/log-colors.js";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);

  console.log("=".repeat(50));
  const error = new AppError(
    `${colors.red}Route not found${colors.reset} - ${req.method} ${req.originalUrl}`,
    404,
  );
  console.log("=".repeat(50) + "\n");

  error.statusCode = 404;

  next(error);
};

export default notFound;
