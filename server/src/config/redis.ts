import { Redis } from "ioredis";
import config from "./env.js";

export const bullMQConnection = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  tls: config.nodeEnv === "production" ? {} : undefined,
  maxRetriesPerRequest: null,
};

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  tls: config.nodeEnv === "production" ? {} : undefined,
  maxRetriesPerRequest: null,
});

export default redis;
