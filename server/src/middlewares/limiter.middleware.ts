import { rateLimiters } from "../lib/rate-limit/presets.js";

const limiter = (limiterKey: keyof typeof rateLimiters) =>
  rateLimiters[limiterKey];

export default limiter;
