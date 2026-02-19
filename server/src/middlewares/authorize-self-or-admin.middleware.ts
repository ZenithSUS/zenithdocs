import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error.js";
import { ParamsDictionary } from "express-serve-static-core";

interface UserParams extends ParamsDictionary {
  id: string;
}

/**
 * Middleware to authorize access to a resource based on the user's ID and role.
 * If the user is not an admin, they can only access resources with the same ID as them.
 * If the user is an admin, they can access any resource.
 * @param {Request<UserParams>} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @throws {AppError} - If the user is not authorized to access the resource
 */
const authorizeSelfOrAdmin = (
  req: Request<UserParams>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    return next(new AppError("Unauthorized Access", 401));
  }

  // Check if the user is authorized to access this resource (Admin bypass this check)
  if (user.sub !== id && user.role !== "admin") {
    return next(
      new AppError("You are not authorized to access this resource", 403),
    );
  }

  next();
};

export default authorizeSelfOrAdmin;
