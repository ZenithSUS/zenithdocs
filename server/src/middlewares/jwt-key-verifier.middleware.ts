import { NextFunction, Request, Response } from "express";
import config from "../config/env.js";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/express.js";

const jwtKeyVerifier = (req: Request, res: Response, next: NextFunction) => {
  const secret = config.jwt.accessSecret;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access No Token Provided",
    });
  }

  // Decode the JWT token
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ error: "Invalid token, Unauthorized Access to the server" });
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default jwtKeyVerifier;
