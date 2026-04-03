import { Worker } from "bullmq";
import redis, { bullMQConnection } from "../config/redis.js";
import { updateDocument } from "../repositories/document.repository.js";
import { prepareDocumentforRAG } from "../lib/mistral/services/rag-index.service.js";
import extractRawText from "../lib/extract-text.js";
import { unlink } from "fs/promises";
import colors from "../utils/log-colors.js";
import { downloadFileFromCloudinary } from "../lib/cloudinary.service.js";

interface EmbeddingJobData {
  documentId: string;
  userId: string;
  publicId: string;
  mimeType: string;
  fileUrl: string;
}

export const embeddingWorker = new Worker(
  "embedding",
  async (job) => {
    console.log("=".repeat(50));
    console.log(`${colors.green}Job added to queue${colors.reset}: ${job.id}`);
    console.log("=".repeat(50) + "\n");

    const {
      documentId,
      userId,
      publicId,
      mimeType,
      fileUrl,
    }: EmbeddingJobData = job.data;

    let tempFilePath: string | null = null;

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
      const rawText = await extractRawText(
        async () => {
          tempFilePath = await downloadFileFromCloudinary(publicId, mimeType);
          return tempFilePath;
        },
        mimeType,
        fileUrl,
      );

      await updateDocument(documentId, { rawText });

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
    } finally {
      // Always clean up the temp file — whether success or failure
      if (tempFilePath) await unlink(tempFilePath).catch(() => {});
    }
  },
  {
    connection: bullMQConnection,
    concurrency: 5, // can process 5 jobs simultaneously safely
    lockDuration: 300000, // 5 min lock
    lockRenewTime: 60000, // renew every 1 min
    stalledInterval: 60000, // re-queue stalled jobs every 1 min
    skipVersionCheck: true,
  },
);

embeddingWorker.on("completed", (job) => {
  console.log("=".repeat(50));
  console.log(`${colors.green}Job ${job.id} completed${colors.reset}`);
  console.log("=".repeat(50) + "\n");
});

embeddingWorker.on("failed", (job, err) => {
  console.error("=".repeat(50));
  console.error(
    `${colors.red}Job ${job?.id} failed:${colors.reset}`,
    err.message,
  );
  console.error("=".repeat(50) + "\n");
});

embeddingWorker.on("error", (err) => {
  console.log("=".repeat(50));
  console.error(`${colors.red}Worker error:${colors.reset}`, err);
  console.log("=".repeat(50) + "\n");
});

embeddingWorker.on("stalled", (jobId) => {
  console.log("=".repeat(50));
  console.warn(`${colors.yellow}Job ${jobId} stalled${colors.reset}`);
  console.log("=".repeat(50) + "\n");
});
