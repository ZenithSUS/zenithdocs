import { Request, Response, NextFunction } from "express";
import AppError from "../utils/app-error.js";
import { ZodError } from "zod";

/**
 * Error handling middleware function.
 * Handles errors by returning a JSON response with a success flag set to false.
 * If the error is an instance of AppError, it returns the error message and status code.
 * If the error is an instance of ZodError, it returns a validation error response with the error messages for each field.
 * If the error is neither an AppError nor a ZodError, it returns a generic internal server error response with a 500 status code.
 * @param {Error | AppError | ZodError} err - The error to be handled.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 */
const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
};

export default errorHandler;
