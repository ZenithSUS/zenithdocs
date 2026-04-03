import { useState } from "react";
import { LearningItem } from "@/types/learning-set";
import { CheckCircle2, XCircle } from "lucide-react";

interface IdentificationCardProps {
  learningItem: LearningItem;
  isStudying?: boolean;
  setPoints?: (points: number) => void;
}

function IdentificationCard({
  learningItem,
  isStudying = false,
  setPoints,
}: IdentificationCardProps) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isCorrect =
    input.trim().toLowerCase() === learningItem.answer.trim().toLowerCase();

  const handleSubmit = () => {
    if (!input.trim()) return;

    if (setPoints && isStudying) {
      setPoints(isCorrect ? 1 : 0);
    }

    setSubmitted(true);
  };

  const handleRetry = () => {
    setInput("");
    setSubmitted(false);
  };

  if (!learningItem.question) return null;

  return (
    <div className="w-full rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <span className="text-[10px] font-medium text-primary/70 uppercase tracking-widest">
        Identification
      </span>

      <p className="text-sm text-text leading-relaxed">
        {learningItem.question}
      </p>

      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={input}
          disabled={submitted}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !submitted && handleSubmit()}
          placeholder="Type your answer..."
          className={`flex-1 px-3 py-2 rounded-lg border text-sm bg-muted/30 text-text placeholder:text-muted-foreground outline-none transition-colors disabled:opacity-60
            ${
              submitted
                ? isCorrect
                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                  : "border-red-500/40 bg-red-500/10 text-red-400"
                : "border-border focus:border-primary/50"
            }`}
        />
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="px-3 py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Check
          </button>
        ) : (
          !isStudying && (
            <button
              onClick={handleRetry}
              className="px-3 py-2 rounded-lg border border-border text-muted-foreground text-sm hover:text-text hover:border-primary/30 transition-colors cursor-pointer"
            >
              Retry
            </button>
          )
        )}
      </div>

      {submitted && (
        <div
          className={`flex items-start gap-2 text-xs rounded-lg px-3 py-2 border ${isCorrect ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          )}
          <span>
            {isCorrect ? (
              "Correct!"
            ) : (
              <>
                Incorrect. The answer is{" "}
                <span className="font-medium">{learningItem.answer}</span>.
              </>
            )}
            {learningItem.explanation && (
              <span className="text-muted-foreground ml-1">
                {learningItem.explanation}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

export default IdentificationCard;
