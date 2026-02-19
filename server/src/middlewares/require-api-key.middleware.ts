import { NextFunction, Request, Response } from "express";
import config from "../config/env.js";
import AppError from "../utils/app-error.js";

const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header("x-api-key");

  if (!apiKey || apiKey !== config.server.apikey) {
    return next(new AppError("Unauthorized access", 401));
  }

  next();
};

export default requireApiKey;
