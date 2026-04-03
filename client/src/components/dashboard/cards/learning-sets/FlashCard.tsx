import { memo, useRef, useState } from "react";
import { LearningItem } from "@/types/learning-set";
import { Check, X } from "lucide-react";

interface FlashCardProps {
  learningItem: LearningItem;
  isStudying?: boolean;
  setPoints?: (points: number) => void;
}

function FlashCard({
  learningItem,
  isStudying = false,
  setPoints,
}: FlashCardProps) {
  const answeredRef = useRef(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState<"correct" | "incorrect" | null>(
    null,
  );

  const front = learningItem.front ?? learningItem.question;
  const back = learningItem.back ?? learningItem.answer;

  const handlePoints = (points: number, result: "correct" | "incorrect") => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    console.log(result);
    if (setPoints && isStudying) {
      setAnswered(result);
      setPoints(points);
    }
  };

  const handleFlip = () => {
    if (!answered) setIsFlipped((prev) => !prev);
  };

  if (!front) return null;

  const cardHeight = isFlipped && isStudying ? "h-64" : "h-52";

  return (
    <div
      className={`w-full ${cardHeight} select-none group transition-all duration-300`}
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <button
          className="absolute inset-0 rounded-xl border border-border bg-white/2 flex flex-col p-4 group-hover:border-primary/40 transition-colors cursor-pointer w-full text-left"
          style={{ backfaceVisibility: "hidden" }}
          onClick={handleFlip}
        >
          <span className="text-[10px] font-medium text-primary/70 uppercase tracking-widest">
            Question
          </span>
          <div className="flex-1 flex items-center justify-center px-2">
            <p className="text-sm text-center text-text leading-relaxed line-clamp-5">
              {front}
            </p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-[10px] text-muted-foreground">
              Tap to reveal
            </span>
            <svg
              className="w-3 h-3 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
        </button>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl border border-primary/30 bg-primary/5 flex flex-col p-4 bg-white/8"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="text-[10px] font-medium text-primary/70 uppercase tracking-widest">
            Answer
          </span>

          <div
            className="flex-1 flex items-center justify-center px-2 cursor-pointer"
            onClick={handleFlip}
          >
            <p className="text-sm text-center text-text leading-relaxed line-clamp-4">
              {back}
            </p>
          </div>

          {learningItem.explanation && (
            <p
              className="text-[11px] text-muted-foreground text-center line-clamp-2 border-t border-border pt-2 mt-1 cursor-pointer"
              onClick={handleFlip}
            >
              {learningItem.explanation}
            </p>
          )}

          {isStudying && (
            <div className="mt-3 pt-2 border-t border-border">
              {answered ? (
                <p className="text-[10px] text-center text-muted-foreground">
                  {answered === "correct"
                    ? "✓ Marked correct"
                    : "✗ Marked incorrect"}
                </p>
              ) : (
                <>
                  <p className="text-[10px] text-muted-foreground text-center mb-2">
                    Did you get it right?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-red-500/30 ${answered === "incorrect" ? "bg-red-500/20" : "bg-red-500/10"} hover:bg-red-500/20 transition-colors cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePoints(0, "incorrect");
                      }}
                    >
                      <X className="w-3 h-3 text-red-400" />
                      <span className="text-[10px] font-medium text-red-400">
                        Nope
                      </span>
                    </button>

                    <button
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-green-500/30 ${answered === "correct" ? "bg-green-500/20" : "bg-green-500/10"}  hover:bg-green-500/20 transition-colors cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePoints(1, "correct");
                      }}
                    >
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-[10px] font-medium text-green-400">
                        Got it
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(FlashCard);
