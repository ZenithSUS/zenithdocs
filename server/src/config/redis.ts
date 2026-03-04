import { Redis } from "@upstash/redis";
import config from "./env.js";

const redis = new Redis({
  url: config.redis.restUrl,
  token: config.redis.restToken,
});

export const bullMQConnection = {
  host: config.redis.connection.host,
  port: config.redis.connection.port,
  password: config.redis.connection.password,
  tls: {},
  maxRetriesPerRequest: null,
};

export default redis;
