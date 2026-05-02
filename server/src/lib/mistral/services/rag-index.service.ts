import { createManyDocumentChunks } from "../../../repositories/document-chunk.repository.js";
import { getDocumentById } from "../../../repositories/document.repository.js";
import { generateEmbedding } from "./embedding.service.js";
import chunkText from "../utils/chunk-text.js";

const MAX_CHAR_PER_CHUNK = 2000;
const MAX_CHUNKS = 50;
const BATCH_SIZE = 5;
const BATCH_DELAY_MS = 200;

export async function prepareDocumentforRAG(
  documentId: string,
  userId: string,
  mineType: string,
) {
  const document = await getDocumentById(documentId);

  if (!document || !document.rawText) return;

  const chunks = chunkText(
    document.rawText,
    MAX_CHAR_PER_CHUNK,
    mineType,
  ).slice(0, MAX_CHUNKS);

  const enrichedChunks = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const embeddings = await Promise.all(batch.map(generateEmbedding));
    enrichedChunks.push(
      ...batch.map((text, j) => ({ text, embedding: embeddings[j] })),
    );

    // Avoid rate limiting between batches (skip delay on last batch)
    if (i + BATCH_SIZE < chunks.length) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  const chunkDocs = enrichedChunks.map((chunk, index) => ({
    documentId: document._id.toString(),
    documentName: document.title,
    userId: userId,
    text: chunk.text,
    embedding: chunk.embedding,
    chunkIndex: index,
  }));

  if (!chunkDocs.length) return;

  await createManyDocumentChunks(chunkDocs);
}
