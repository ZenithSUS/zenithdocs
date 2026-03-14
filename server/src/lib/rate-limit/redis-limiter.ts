import { Ratelimit } from "@upstash/ratelimit";
import redis from "../../config/redis.js";
import config from "../../config/env.js";

export const createLimiter = (
  requests: number,
  duration: "10 s" | "1 m" | "5 m" | "10 m" | "1 h",
  identifier: string,
) => {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, duration),
    analytics: true,
    prefix: `${config.nodeEnv}:ratelimit:${identifier}`,
  });
};
