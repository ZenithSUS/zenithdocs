import getConfidenceMessage from "@/utils/confidence-message";

interface ConfidenceMessageProps {
  confidenceScore: number | undefined;
}

function ConfidenceMessage({ confidenceScore }: ConfidenceMessageProps) {
  const conf = getConfidenceMessage(confidenceScore);

  if (!conf) return null;

  return (
    <div
      className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-md"
      style={{
        background: conf.bg,
        border: `1px solid ${conf.border}`,
      }}
    >
      <div
        className="rounded-full shrink-0"
        style={{
          width: 6,
          height: 6,
          background: conf.color,
        }}
      />
      <span className="text-[10px]" style={{ color: conf.color }}>
        {conf.label}
      </span>
      <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
        {Math.round((confidenceScore ?? 0) * 100)}%
      </span>
    </div>
  );
}

export default ConfidenceMessage;
