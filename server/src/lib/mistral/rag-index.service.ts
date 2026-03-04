import {
  getDocumentById,
  updateDocument,
} from "../../repositories/document.repository.js";
import chunkText from "./chunk.util.js";
import { generateEmbedding } from "./embedding.service.js";

const MAX_CHAR_PER_CHUNK = 5000; // Maximum number of characters per chunk

/**
 * Prepare a document for RAG (Reading Assistant Generation) by generating embeddings for
 * each chunk of text in the document and storing the enriched chunks in the document.
 * @param {string} documentId - The ID of the document to prepare
 * @returns {Promise<void>} - A promise that resolves when the document has been prepared
 */
export async function prepareDocumentforRAG(documentId: string) {
  const document = await getDocumentById(documentId);

  if (!document || !document.rawText) return;

  const chunks = chunkText(document.rawText, MAX_CHAR_PER_CHUNK);

  const enrichedChunks = [];

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);

    enrichedChunks.push({ text: chunk, embedding });
  }

  document.chunks = enrichedChunks;
  await updateDocument(documentId, { chunks: enrichedChunks });
}
