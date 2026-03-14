import { updateDocument } from "../repositories/document.repository.js";
import { prepareDocumentforRAG } from "../lib/mistral/services/rag-index.service.js";
import { getIO } from "../config/socket.js";

interface EmbeddingJobData {
  documentId: string;
  userId: string;
}

export const processEmbedding = async ({
  documentId,
  userId,
}: EmbeddingJobData) => {
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
  } catch (error: any) {
    console.error("[Embedding] Processing error:", error?.message ?? error);
    await updateDocument(documentId, { status: "failed" });
    getIO()
      .to(userId)
      .emit("document:failed", { documentId, status: "failed" });
  }
};
