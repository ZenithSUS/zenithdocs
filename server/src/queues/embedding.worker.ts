import { Worker } from "bullmq";
import redis, { bullMQConnection } from "../config/redis.js";
import { updateDocument } from "../repositories/document.repository.js";
import { prepareDocumentforRAG } from "../lib/mistral/services/rag-index.service.js";
import colors from "../utils/log-colors.js";

interface EmbeddingJobData {
  documentId: string;
  userId: string;
}

export const embeddingWorker = new Worker(
  "embedding",
  async (job) => {
    console.log("=".repeat(50));
    console.log(`${colors.green}Job added to queue${colors.reset}: ${job.id}`);
    console.log("=".repeat(50) + "\n");

    const { documentId, userId }: EmbeddingJobData = job.data;

    await updateDocument(documentId, { status: "processing" });
    await redis.publish(
      "document-events",
      JSON.stringify({
        type: "document:processing",
        documentId,
        userId,
        status: "processing",
      }),
    );

    try {
      await prepareDocumentforRAG(documentId, userId);
      await updateDocument(documentId, { status: "completed" });
      await redis.publish(
        "document-events",
        JSON.stringify({
          type: "document:completed",
          documentId,
          userId,
          status: "completed",
        }),
      );
    } catch (error) {
      await updateDocument(documentId, { status: "failed" });
      await redis.publish(
        "document-events",
        JSON.stringify({
          type: "document:failed",
          documentId,
          userId,
          status: "failed",
        }),
      );
      throw error;
    }
  },
  {
    connection: bullMQConnection,
    concurrency: 1,
    lockDuration: 60000,
    lockRenewTime: 30000,
    stalledInterval: 30000, // check for stalled jobs every 30s
    skipVersionCheck: true,
  },
);

embeddingWorker.on("failed", (job, err) => {
  console.error(
    `[Embedding] Job ${job?.id} failed after ${job?.attemptsMade} attempts:`,
    err.message,
  );
});

embeddingWorker.on("error", (err) => {
  console.error("[Embedding Worker Error]", err);
});

embeddingWorker.on("completed", (job) => {
  console.log("=".repeat(50));
  console.log(
    `${colors.green}Job ${job.id} completed!${colors.green}${colors.reset}`,
  );
  console.log("=".repeat(50) + "\n");
});

const shutdown = async (signal: string) => {
  console.log("=".repeat(50));
  console.log(`[Embedding] Received ${signal}, shutting down gracefully...`);
  console.log("=".repeat(50) + "\n");

  try {
    // Stop accepting new jobs, wait for active job to finish
    await embeddingWorker.close();

    console.log("=".repeat(50));
    console.log("[Embedding] Worker  closed.");
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
