import { IDocumentChunkOutput } from "../../../models/document-chunk.model.js";

const calculateGlobalConfidenceScore = (
  chunks: IDocumentChunkOutput[],
): number => {
  if (chunks.length === 0) return 0; // no relevant docs found

  const topScore = chunks[0].score;
  const avgScore = chunks.reduce((s, c) => s + c.score, 0) / chunks.length;

  // Slight multi-doc bonus since global chat searches across all user documents
  const multiDocBonus = Math.min(
    (new Set(chunks.map((c) => c.documentId.toString())).size - 1) * 0.02,
    0.06,
  );

  return Math.min(
    parseFloat((topScore * 0.7 + avgScore * 0.3 + multiDocBonus).toFixed(2)),
    1.0,
  );
};

export default calculateGlobalConfidenceScore;
