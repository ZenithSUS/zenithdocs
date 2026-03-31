import { memo, useState } from "react";
import { LearningItem } from "@/types/learning-set";

interface FlashCardProps {
  learningItem: LearningItem;
  isReviewing?: boolean;
  setPoints?: (points: number) => void;
}

function FlashCard({
  learningItem,
  isReviewing = false,
  setPoints,
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const front = learningItem.front ?? learningItem.question;
  const back = learningItem.back ?? learningItem.answer;

  if (!front) return null;

  return (
    <div
      className="w-full h-52 cursor-pointer select-none group"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl border border-border bg-white/2 flex flex-col p-4 group-hover:border-primary/40 transition-colors"
          style={{ backfaceVisibility: "hidden" }}
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
        </div>

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
          <div className="flex-1 flex items-center justify-center px-2">
            <p className="text-sm text-center text-text leading-relaxed line-clamp-4">
              {back}
            </p>
          </div>
          {learningItem.explanation && (
            <p className="text-[11px] text-muted-foreground text-center line-clamp-2 border-t border-border pt-2 mt-1">
              {learningItem.explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(FlashCard);
