import { Request, Response, NextFunction } from "express";
import AppError from "../utils/app-error.js";

/**
 * Error handling middleware
 * @param {Error | AppError} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void}
 * @description
 * If the error is an instance of AppError, it will
 * return a JSON response with the error message and
 * status code. If the error is not an instance of
 * AppError, it will return a JSON response with a
 * generic "Internal Server Error" message and a status
 * code of 500.
 */
const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorHandler;
