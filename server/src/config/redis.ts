import { Redis } from "ioredis";
import config from "./env.js";

const redisOptions = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: null,
};

const redis = new Redis(redisOptions);

export const bullMQConnection = redisOptions;

export default redis;
