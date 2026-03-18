import { Redis } from "ioredis";
import config from "./env.js";

const redis = new Redis({
  host: config.redis.bullmqHost,
  port: config.redis.port,
  username: config.redis.username,
  password: config.redis.password,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const bullMQConnection = {
  host: config.redis.bullmqHost,
  port: config.redis.port,
  username: config.redis.username,
  password: config.redis.password,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

export default redis;
