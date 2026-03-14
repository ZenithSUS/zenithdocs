import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

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
    keyGenerator: (req, res) => {
      const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
      const key = `${identifier}:${req.user?.sub ?? ip}`;
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
    validate: {
      keyGeneratorIpFallback: false,
    },
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests. Try again later." },
  });
};
