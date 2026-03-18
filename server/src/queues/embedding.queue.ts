import { Queue } from "bullmq";
import { bullMQConnection } from "../config/redis.js";

export const embeddingQueue = new Queue("embedding", {
  connection: bullMQConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

const shutdown = async (signal: string) => {
  console.log("=".repeat(50));
  console.log(`[Embedding] Received ${signal}, shutting down gracefully...`);
  console.log("=".repeat(50) + "\n");

  try {
    // Stop accepting new jobs, wait for active job to finish
    await embeddingQueue.close();

    console.log("=".repeat(50));
    console.log("[Embedding] Queue closed.");
    console.log("=".repeat(50) + "\n");
  } catch (err) {
    console.log("=".repeat(50));
    console.error("[Embedding] Error during shutdown:", err);
    console.log("=".repeat(50) + "\n");
    process.exit(1);
  }

  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM")); // Docker/K8s stop
process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl-C
