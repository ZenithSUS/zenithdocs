import { useState } from "react";
import { LearningItem } from "@/types/learning-set";
import { CheckCircle2, XCircle } from "lucide-react";

interface TFCardProps {
  learningItem: LearningItem;
  isStudying?: boolean;
  setPoints?: (points: number) => void;
}

function TFCard({ learningItem, isStudying = false, setPoints }: TFCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const isAnswered = selected !== null;
  const isCorrect =
    selected?.toLowerCase() === learningItem.answer.toLowerCase();

  const handleSelect = (value: string) => {
    if (setPoints && isStudying) {
      setPoints(isCorrect ? 1 : 0);
    }
    setSelected(value);
  };

  if (!learningItem.question) return null;

  const getStyle = (value: string) => {
    if (!isAnswered) {
      return "border-border bg-muted/30 text-text hover:border-primary/40 hover:bg-primary/5";
    }
    const isThis = selected === value;
    const isRight = value.toLowerCase() === learningItem.answer.toLowerCase();

    if (isRight) return "border-green-500/40 bg-green-500/10 text-green-400";
    if (isThis && !isRight)
      return "border-red-500/40 bg-red-500/10 text-red-400";
    return "border-border bg-muted/20 text-muted-foreground";
  };

  return (
    <div className="w-full rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <span className="text-[10px] font-medium text-primary/70 uppercase tracking-widest">
        True / False
      </span>

      <p className="text-sm text-text leading-relaxed">
        {learningItem.question}
      </p>

      <div className="grid grid-cols-2 gap-2">
        {["True", "False"].map((option) => {
          const isRight =
            option.toLowerCase() === learningItem.answer.toLowerCase();
          const isSelected = selected === option;

          return (
            <button
              key={option}
              disabled={isAnswered}
              onClick={() => handleSelect(option)}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer disabled:cursor-default ${getStyle(option)}`}
            >
              {isAnswered && isRight && <CheckCircle2 className="w-4 h-4" />}
              {isAnswered && isSelected && !isRight && (
                <XCircle className="w-4 h-4" />
              )}
              {option}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isCorrect
              ? "Correct! "
              : `Incorrect. The answer is ${learningItem.answer}. `}
            {learningItem.explanation}
          </p>
          {!isStudying && (
            <button
              onClick={() => setSelected(null)}
              className="text-xs text-primary hover:underline underline-offset-4 shrink-0"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default TFCard;
