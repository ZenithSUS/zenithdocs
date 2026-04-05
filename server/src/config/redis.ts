import { Redis } from "ioredis";
import config from "./env.js";
import colors from "../utils/log-colors.js";

const redis = new Redis({
  host: config.redis.bullmqHost,
  port: config.redis.port,
  ...(config.redis.username && { username: config.redis.username }),
  ...(config.redis.password && { password: config.redis.password }),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError: (err) => {
    return (
      err.message.includes("ECONNREFUSED") || err.message.includes("ECONNRESET")
    );
  },
});

export const bullMQConnection = {
  host: config.redis.bullmqHost,
  port: config.redis.port,
  username: config.redis.username,
  password: config.redis.password,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

redis.on("reconnecting", () => {
  console.log("=".repeat(50));
  console.log(`${colors.yellow}Reconnecting to Redis...${colors.reset}`);
  console.log("=".repeat(50) + "\n");
});

redis.on("ready", () => {
  console.log("=".repeat(50));
  console.log(
    `${colors.green}Redis connected on port ${colors.reset}${config.redis.port}`,
  );
  console.log("=".repeat(50) + "\n");
});

redis.on("error", (err) => {
  console.log("=".repeat(50));
  console.error(
    `${colors.red}Redis connection error: ${colors.reset}`,
    err.message,
  );
  console.log("=".repeat(50) + "\n");
});

export default redis;
