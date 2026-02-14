import { NextFunction, Request, Response } from "express";
import config from "../config/env";

const apiKeyVerifier = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];

  // Compare the API key with the one in the environment variable
  if (apiKey !== config.server.apikey) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Access" });
  }

  // If the API key is valid, continue to the next middleware
  next();
};

export default apiKeyVerifier;
