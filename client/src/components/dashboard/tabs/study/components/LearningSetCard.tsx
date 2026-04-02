"use client";

import { LearningSet } from "@/types/learning-set";
import { memo } from "react";
import { formatDistanceToNow } from "date-fns";
import { BookOpen, HelpCircle, Zap } from "lucide-react";

interface LearningSetCardProps {
  learningSet: LearningSet;
}

const TYPE_CONFIG: Record<
  LearningSet["type"],
  { label: string; icon: React.ReactNode; accent: string; pill: string }
> = {
  flashcard: {
    label: "Flashcard",
    icon: <Zap className="w-4 h-4" />,
    accent: "border-t-blue-500",
    pill: "bg-blue-500/10 text-blue-300 border border-blue-500/30",
  },
  quiz: {
    label: "Quiz",
    icon: <HelpCircle className="w-4 h-4" />,
    accent: "border-t-violet-500",
    pill: "bg-violet-500/10 text-violet-300 border border-violet-500/30",
  },
  reviewer: {
    label: "Reviewer",
    icon: <BookOpen className="w-4 h-4" />,
    accent: "border-t-emerald-500",
    pill: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
  },
};

const DIFFICULTY_CONFIG: Record<
  LearningSet["difficulty"],
  { label: string; style: string }
> = {
  easy: { label: "Easy", style: "text-green-400" },
  medium: { label: "Medium", style: "text-amber-400" },
  hard: { label: "Hard", style: "text-red-400" },
};

function LearningSetCard({ learningSet }: LearningSetCardProps) {
  const timeAgo = formatDistanceToNow(new Date(learningSet.updatedAt), {
    addSuffix: true,
  });

  const cardCount = learningSet.items.length;
  const type = TYPE_CONFIG[learningSet.type];
  const difficulty = DIFFICULTY_CONFIG[learningSet.difficulty];

  return (
    <div
      className={`
        group flex flex-col gap-4
        bg-white/5 hover:bg-white/10
        border border-white/10 hover:border-white/20
        border-t-2 ${type.accent}
        rounded-xl p-4 cursor-pointer
        transition-all duration-200
      `}
    >
      {/* Type icon + title */}
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 shrink-0 ${type.pill} p-1.5 rounded-lg`}>
          {type.icon}
        </span>
        <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
          {learningSet.title ?? "Untitled"}
        </p>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${type.pill}`}
          >
            {type.label}
          </span>
          <span className={`text-[11px] font-medium ${difficulty.style}`}>
            {difficulty.label}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span>
            {cardCount} {cardCount === 1 ? "card" : "cards"}
          </span>
          <span>·</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(LearningSetCard);
