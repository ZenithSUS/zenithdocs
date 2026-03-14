import { Queue, Worker } from "bullmq";
import { bullMQConnection } from "../config/redis.js";
import { updateDocument } from "../repositories/document.repository.js";
import { prepareDocumentforRAG } from "../lib/mistral/services/rag-index.service.js";
import { getIO } from "../config/socket.js";
import colors from "../utils/log-colors.js";

interface EmbeddingJobData {
  documentId: string;
  userId: string;
}

const shutdown = async () => {
  await embeddingWorker.close();
  await embeddingQueue.close();
  process.exit(0);
};

export const embeddingQueue = new Queue("embedding", {
  connection: bullMQConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

export const embeddingWorker = new Worker(
  "embedding",
  async (job) => {
    const { documentId, userId }: EmbeddingJobData = job.data;

    await updateDocument(documentId, { status: "processing" });
    getIO()
      .to(userId)
      .emit("document:processing", { documentId, status: "processing" });

    try {
      await prepareDocumentforRAG(documentId, userId);
      await updateDocument(documentId, { status: "completed" });
      getIO()
        .to(userId)
        .emit("document:completed", { documentId, status: "completed" });
    } catch (error) {
      await updateDocument(documentId, { status: "failed" });
      getIO()
        .to(userId)
        .emit("document:failed", { documentId, status: "failed" });
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
  console.log(`${colors.green}Job ${job.id} completed!${colors.green}`);
  console.log("=".repeat(50));
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
