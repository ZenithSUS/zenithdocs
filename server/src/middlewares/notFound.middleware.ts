import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error.js";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(
    `Route not found - ${req.method} ${req.originalUrl}`,
    404,
  );

  error.statusCode = 404;

  next(error);
};

export default notFound;
