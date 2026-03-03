import { NextFunction, Request, Response } from "express";
import { rateLimiters } from "../lib/rate-limit/presets.js";

/**
 * A middleware that enforces rate limiting based on the given limiter key.
 * If the request exceeds the rate limit, a 429 response is returned.
 * The middleware sets the following headers on the response:
 * - X-RateLimit-Limit: The maximum number of requests allowed within the time window.
 * - X-RateLimit-Remaining: The number of remaining requests allowed within the time window.
 * - X-RateLimit-Reset: The time at which the rate limit will be reset.
 * @param {keyof typeof rateLimiters} limiterKey - The key to the rate limiter.
 * @returns {Promise<NextFunction>} - A promise that resolves to the next function in the middleware chain.
 */
const rateLimit =
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

export default rateLimit;
