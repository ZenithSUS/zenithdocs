import { Queue, Worker } from "bullmq";
import { bullMQConnection } from "../config/redis.js";
import { updateDocument } from "../repositories/document.repository.js";
import { prepareDocumentforRAG } from "../lib/mistral/services/rag-index.service.js";
import { getIO } from "../config/socket.js";

interface EmbeddingJobData {
  documentId: string;
  userId: string;
}

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
    limiter: {
      max: 1,
      duration: 1000,
    },
  },
);
