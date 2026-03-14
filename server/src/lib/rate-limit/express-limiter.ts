import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { RedisReply, RedisStore } from "rate-limit-redis";
import redis from "../../config/redis.js";

const durationToMs: Record<string, number> = {
  "10 s": 10_000,
  "1 m": 60_000,
  "5 m": 300_000,
  "10 m": 600_000,
  "1 h": 3_600_000,
};

export const createLimiter = (
  requests: number,
  duration: "10 s" | "1 m" | "5 m" | "10 m" | "1 h",
  identifier: string,
): RateLimitRequestHandler => {
  return rateLimit({
    windowMs: durationToMs[duration],
    max: requests,
    store: new RedisStore({
      sendCommand: (command: string, ...args: string[]) => {
        return redis.call(command, ...args) as Promise<RedisReply>;
      },
      prefix: `ratelimit:${identifier}:`,
    }),
    keyGenerator: (req, res) => {
      const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
      const key = `${req.user?.sub ?? ip}`;

      if (process.env.NODE_ENV === "development") {
        res.on("finish", () => {
          const limit = Number(res.getHeader("RateLimit-Limit"));
          const remaining = Number(res.getHeader("RateLimit-Remaining"));
          const reset = res.getHeader("RateLimit-Reset");
          const used = limit - remaining;
          console.log(
            `[RateLimit:${identifier}] ${key} → ${used}/${limit} used | ${remaining} remaining | resets in ${reset}s`,
          );
        });
      }

      return key;
    },
    handler: (req, res) => {
      const limit = Number(res.getHeader("RateLimit-Limit"));
      const remaining = Number(res.getHeader("RateLimit-Remaining"));
      const reset = Number(res.getHeader("RateLimit-Reset"));
      return res.status(429).json({
        success: false,
        message: "Too many requests. Try again later.",
        limit,
        remaining,
        reset,
      });
    },
    validate: { keyGeneratorIpFallback: false },
    standardHeaders: true,
    legacyHeaders: false,
  });
};
