import { IDocumentChunkOutput } from "../../../models/DocumentChunk.js";

const calculateConfidenceScore = (chunks: IDocumentChunkOutput[]): number => {
  if (chunks.length === 0) return 0;

  const weights = chunks.map((_, i) => 1 / (i + 1));
  const weightedSum = chunks.reduce(
    (sum, chunk, i) => sum + chunk.score * weights[i],
    0,
  );
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const weightedAvg = weightedSum / totalWeight;

  const coverageBonus = Math.min(chunks.length / 5, 1) * 0.05;

  return Math.min(parseFloat((weightedAvg + coverageBonus).toFixed(2)), 1.0);
};

export default calculateConfidenceScore;
