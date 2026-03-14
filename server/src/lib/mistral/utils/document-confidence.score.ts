import { IDocumentChunkOutput } from "../../../models/DocumentChunk.js";

const calculateDocumentConfidenceScore = (
  chunks: IDocumentChunkOutput[],
): number => {
  if (chunks.length === 0) return 0;

  const topScore = chunks[0].score;
  const avgScore = chunks.reduce((s, c) => s + c.score, 0) / chunks.length;

  return parseFloat((topScore * 0.7 + avgScore * 0.3).toFixed(2));
};

export default calculateDocumentConfidenceScore;
