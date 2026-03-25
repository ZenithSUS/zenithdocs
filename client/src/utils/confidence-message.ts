export interface ConfidenceStyle {
  label: string;
  color: string;
  bg: string;
  border: string;
}

const getConfidenceMessage = (
  score: number | undefined | null,
): ConfidenceStyle | null => {
  if (score === undefined || score === null) return null;

  if (score >= 0.92)
    return {
      label: "High confidence",
      color: "#4ade80",
      bg: "rgba(74,222,128,0.08)",
      border: "rgba(74,222,128,0.2)",
    };
  if (score >= 0.85)
    return {
      label: "Moderate confidence",
      color: "#facc15",
      bg: "rgba(250,204,21,0.08)",
      border: "rgba(250,204,21,0.2)",
    };

  return {
    label: "Low confidence",
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
  };
};

export default getConfidenceMessage;
