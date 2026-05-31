import { IDocumentChunkOutput } from "../../../models/document-chunk.model.js";
import { getDocumentUserSimilarityScore } from "../../../repositories/document-chunk.repository.js";
import { generateEmbedding } from "../services/embedding.service.js";
import extractKeywords from "./extract-keywords.js";

// ─── Chunk retrieval thresholds ───────────────────────────────────────────────
const HIGH_THRESHOLD = 0.82;
const FALLBACK_THRESHOLD = 0.72;
const MAX_PER_DOC = 2;
const MAX_TOTAL = 8;

const retrieveGlobalChunks = async (
  queries: string[],
  userId: string,
  abortCheck: () => boolean,
): Promise<IDocumentChunkOutput[]> => {
  const keywords = extractKeywords(queries[0] ?? queries.join(" "));

  console.log("Keywords for global chunk retrieval:", keywords);

  const allChunks = (
    await Promise.all(
      queries.map(async (q) => {
        const embedding = await generateEmbedding(q);
        return getDocumentUserSimilarityScore(embedding, userId, keywords);
      }),
    )
  ).flat();

  if (abortCheck()) return [];

  const uniqueChunks = Array.from(
    new Map(
      allChunks.map((c) => [`${c.documentId.toString()}-${c.chunkIndex}`, c]),
    ).values(),
  );

  let passing = uniqueChunks.filter((c) => c.score >= HIGH_THRESHOLD);

  if (passing.length === 0) {
    passing = uniqueChunks
      .filter((c) => c.score >= FALLBACK_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  const docCount = new Map<string, number>();

  return passing
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_TOTAL)
    .filter((chunk) => {
      const key = chunk.documentId.toString();
      const count = docCount.get(key) ?? 0;
      if (count >= MAX_PER_DOC) return false;
      docCount.set(key, count + 1);
      return true;
    });
};

export default retrieveGlobalChunks;
