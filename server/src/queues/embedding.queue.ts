import fs from "fs";
import { Queue, Worker } from "bullmq";
import { bullMQConnection } from "../config/redis.js";
import { updateDocument } from "../repositories/document.repository.js";
import { prepareDocumentforRAG } from "../lib/mistral/rag-index.service.js";
import { getIO } from "../config/socket.js";

interface EmbeddingJobData {
  documentId: string;
  userId: string;
  filePath: string;
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
    const { documentId, userId, filePath }: EmbeddingJobData = job.data;

    await updateDocument(documentId, { status: "processing" });
    getIO()
      .to(userId)
      .emit("document:processing", { documentId, status: "processing" });

    try {
      await prepareDocumentforRAG(documentId);
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
    } finally {
      if (filePath && fs.existsSync(filePath)) {
        try {
          await fs.promises.unlink(filePath);
        } catch (err) {
          console.error("Failed to delete local file:", err);
        }
      }
    }
  },
  {
    connection: bullMQConnection,
    concurrency: 1,
  },
);
