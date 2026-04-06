import { useState } from "react";
import { LearningItem } from "@/types/learning-set";
import { CheckCircle2, XCircle } from "lucide-react";
import { HandleSetPointsProps } from "@/app/dashboard/study/[id]/components/StudyDocument";

interface MCQCardProps {
  learningItem: LearningItem;
  isStudying?: boolean;
  setPoints?: (answerInfo: HandleSetPointsProps) => void;
}

function MCQCard({
  learningItem,
  isStudying = false,
  setPoints,
}: MCQCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const isAnswered = selected !== null;

  const handleSelect = (value: string) => {
    const isCorrect = value === learningItem.answer;

    if (isStudying && setPoints) {
      setPoints({
        points: isCorrect ? 1 : 0,
        itemId: learningItem._id,
        correct: isCorrect,
        answeredAt: new Date(),
      });
    }

    setSelected(value);
  };

  if (!learningItem.question || !learningItem.choices) return null;

  return (
    <div className="w-full rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <span className="text-[10px] font-medium text-primary/70 uppercase tracking-widest mt-0.5 shrink-0">
          MCQ
        </span>
      </div>

      <p className="text-sm text-text leading-relaxed">
        {learningItem.question}
      </p>

      <div className="flex flex-col gap-2">
        {learningItem.choices.map((choice, idx) => {
          const isSelected = selected === choice;
          const isRight = choice === learningItem.answer;

          let style =
            "border-border bg-muted/30 text-text hover:border-primary/40 hover:bg-primary/5";

          if (isAnswered) {
            if (isRight)
              style = "border-green-500/40 bg-green-500/10 text-green-400";
            else if (isSelected && !isRight)
              style = "border-red-500/40 bg-red-500/10 text-red-400";
            else style = "border-border bg-muted/20 text-muted-foreground";
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleSelect(choice)}
              className={`flex items-center justify-between gap-2 w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors cursor-pointer disabled:cursor-default ${style}`}
            >
              <span className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground w-4 shrink-0">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {choice}
              </span>
              {isAnswered && isRight && (
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              )}
              {isSelected && !isRight && (
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && learningItem.explanation && (
        <p className="text-xs text-muted-foreground border-t border-border pt-2 leading-relaxed">
          {learningItem.explanation}
        </p>
      )}

      {isAnswered && !isStudying && (
        <button
          onClick={() => setSelected(null)}
          className="self-end text-xs text-primary hover:underline underline-offset-4"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default MCQCard;
