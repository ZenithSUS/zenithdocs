import { NextFunction, Request, Response } from "express";

interface AppError extends Error {
  statusCode?: number;
}

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error: AppError = new Error(
    `${req.method} Route not found - ${req.originalUrl}`,
  );

  error.statusCode = 404;

  next(error);
};

export default notFound;
