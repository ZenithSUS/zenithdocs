import { NextFunction, Request, Response } from "express";
import AppError from "../utils/app-error.js";

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== "admin") {
    return next(
      new AppError("Only Admin is allowed to access this resource", 401),
    );
  }

  next();
};

export default requireAdmin;
