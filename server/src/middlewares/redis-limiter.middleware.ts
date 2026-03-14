import { NextFunction, Request, Response } from "express";
import { rateLimiters } from "../lib/rate-limit/presets.js";

const limiter =
  (limiterKey: keyof typeof rateLimiters) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identifier = req.user?.sub ?? req.ip;

      if (!identifier) {
        return res
          .status(400)
          .json({ success: false, message: "Unable to identify request." });
      }

      const { success, limit, remaining, reset } =
        await rateLimiters[limiterKey].limit(identifier);

      if (!success) {
        return res.status(429).json({
          success: false,
          message: "Too many requests. Try again later.",
          limit,
          remaining,
          reset,
        });
      }

      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", reset);

      next();
    } catch (error) {
      next(error);
    }
  };

export default limiter;
