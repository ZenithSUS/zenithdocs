"use client";

import { LearningSet } from "@/types/learning-set";
import { memo } from "react";
import { formatDistanceToNow } from "date-fns";
import { Brain } from "lucide-react";

interface LearningSetCardProps {
  learningSet: LearningSet;
}

const TYPE_STYLES: Record<LearningSet["type"], string> = {
  flashcard: "bg-blue-400/10 text-blue-300 border border-blue-400/40",
  quiz: "bg-violet-400/10 text-violet-300 border border-violet-400/40",
  reviewer: "bg-emerald-400/10 text-emerald-300 border border-emerald-400/40",
};

const DIFFICULTY_STYLES: Record<LearningSet["difficulty"], string> = {
  easy: "bg-green-400/10 text-green-300 border border-green-400/40",
  medium: "bg-amber-400/10 text-amber-300 border border-amber-400/40",
  hard: "bg-red-400/10 text-red-300 border border-red-400/40",
};

function LearningSetCard({ learningSet }: LearningSetCardProps) {
  const timeAgo = formatDistanceToNow(new Date(learningSet.updatedAt), {
    addSuffix: true,
  });

  const cardCount = learningSet.items.length;

  return (
    <div className="group flex flex-col gap-3 bg-white/8 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 cursor-pointer transition-colors duration-150">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          <p className="text-sm font-medium text-text leading-snug">
            {learningSet.title ?? "Untitled"}
          </p>
        </div>
        <span
          className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${DIFFICULTY_STYLES[learningSet.difficulty]}`}
        >
          {learningSet.difficulty}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md capitalize ${TYPE_STYLES[learningSet.type]}`}
          >
            {learningSet.type}
          </span>
          <span className="text-xs text-gray-400">
            {cardCount} {cardCount === 1 ? "card" : "cards"}
          </span>
        </div>
        <span className="text-xs text-gray-400">{timeAgo}</span>
      </div>
    </div>
  );
}

export default memo(LearningSetCard);
