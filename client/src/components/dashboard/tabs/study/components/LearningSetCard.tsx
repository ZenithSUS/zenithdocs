"use client";

import { LearningSet } from "@/types/learning-set";
import { memo } from "react";
import { formatDistanceToNow } from "date-fns";
import { BookOpen, HelpCircle, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import LearningSetDropdownMenu from "./LearningSetDropdownMenu";

interface LearningSetCardProps {
  userId: string;
  page: number;
  learningSet: LearningSet;
}

const TYPE_CONFIG: Record<
  LearningSet["type"],
  { label: string; icon: React.ReactNode; accent: string; pill: string }
> = {
  flashcard: {
    label: "Flashcard",
    icon: <Zap className="w-3.5 h-3.5" />,
    accent: "border-t-blue-500",
    pill: "bg-blue-500/10 text-blue-300 border border-blue-500/30",
  },
  quiz: {
    label: "Quiz",
    icon: <HelpCircle className="w-3.5 h-3.5" />,
    accent: "border-t-violet-500",
    pill: "bg-violet-500/10 text-violet-300 border border-violet-500/30",
  },
  reviewer: {
    label: "Reviewer",
    icon: <BookOpen className="w-3.5 h-3.5" />,
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

function LearningSetCard({ learningSet, userId, page }: LearningSetCardProps) {
  const router = useRouter();

  const timeAgo = formatDistanceToNow(new Date(learningSet.updatedAt), {
    addSuffix: true,
  });

  const cardCount = learningSet.items.length;
  const type = TYPE_CONFIG[learningSet.type];
  const difficulty = DIFFICULTY_CONFIG[learningSet.difficulty];

  return (
    <div
      className={`
        group flex flex-col gap-3
        bg-white/5 active:bg-white/8
        border border-white/10
        border-t-2 ${type.accent}
        rounded-xl p-3.5 cursor-pointer
        transition-colors duration-150
        /* tablet+ restore hover styles */
        sm:hover:bg-white/10 sm:hover:border-white/20
        sm:gap-4 sm:p-4
      `}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("[data-stop-propagation]"))
          return;
        router.push(`/dashboard/study/${learningSet._id}`);
      }}
    >
      {/* Type icon + title + menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <span
            className={`
              mt-0.5 shrink-0 flex items-center justify-center
              w-7 h-7 rounded-lg
              ${type.pill}
            `}
          >
            {type.icon}
          </span>
          <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
            {learningSet.title ?? "Untitled"}
          </p>
        </div>

        {/* Dropdown menu */}
        <LearningSetDropdownMenu
          userId={userId}
          page={page}
          learningSet={learningSet}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${type.pill}`}
          >
            {type.label}
          </span>
          <span className={`text-[10px] font-semibold ${difficulty.style}`}>
            {difficulty.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/40">
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
