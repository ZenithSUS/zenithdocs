import { Redis } from "@upstash/redis";
import config from "./env.js";

const redis = new Redis({
  url: config.redis.restUrl,
  token: config.redis.restToken,
});

export default redis;
