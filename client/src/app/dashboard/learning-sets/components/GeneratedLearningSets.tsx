import FlashCard from "@/components/dashboard/cards/learning-sets/FlashCard";
import IdentificationCard from "@/components/dashboard/cards/learning-sets/IdentificationCard";
import MCQCard from "@/components/dashboard/cards/learning-sets/MCQCard";
import TFCard from "@/components/dashboard/cards/learning-sets/TFCard";
import { LearningItem, LearningSet } from "@/types/learning-set";
import { BookOpen, Layers, RotateCcw } from "lucide-react";
import { useState } from "react";

interface GeneratedLearningItemsProps {
  learningItem: LearningItem;
}

interface GeneratedLearningSetsProps {
  learningSet: LearningSet | null;
  setLearningSet: React.Dispatch<React.SetStateAction<LearningSet | null>>;
}

const DIFFICULTY_STYLES = {
  easy: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  hard: "bg-red-500/10   text-red-400   border-red-500/20",
};

const TYPE_STYLES: Record<string, string> = {
  flashcard: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  quiz: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  reviewer: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  flashcard: <Layers className="w-3.5 h-3.5" />,
  quiz: <BookOpen className="w-3.5 h-3.5" />,
  reviewer: <BookOpen className="w-3.5 h-3.5" />,
};

function GeneratedLearningItems({ learningItem }: GeneratedLearningItemsProps) {
  switch (learningItem.type) {
    case "flashcard":
      return <FlashCard learningItem={learningItem} />;
    case "mcq":
      return <MCQCard learningItem={learningItem} />;
    case "tf":
      return <TFCard learningItem={learningItem} />;
    case "identification":
      return <IdentificationCard learningItem={learningItem} />;
    default:
      return null;
  }
}
function GeneratedLearningSets({
  learningSet,
  setLearningSet,
}: GeneratedLearningSetsProps) {
  const VISIBLE_ITEM_COUNT = 8;
  const [startIndex, setStartIndex] = useState(0);

  const showedItems =
    learningSet?.items.slice(0, startIndex + VISIBLE_ITEM_COUNT) ?? [];

  const hasMoreItems = learningSet
    ? startIndex + VISIBLE_ITEM_COUNT < learningSet.items.length
    : false;

  const remainingCount = learningSet
    ? Math.min(
        VISIBLE_ITEM_COUNT,
        learningSet.items.length - (startIndex + VISIBLE_ITEM_COUNT),
      )
    : 0;

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
      {/* ── Left panel ── */}
      <div className="flex flex-col gap-5 bg-white/2 p-4 border-2 border-border rounded-lg">
        {/* Title + badges */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-text leading-snug">
            {learningSet?.title ?? "Untitled"}
          </h3>
          <div className="flex items-center flex-wrap gap-2">
            {learningSet?.type && (
              <span
                className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${TYPE_STYLES[learningSet.type].toUpperCase()}`}
              >
                {TYPE_ICONS[learningSet.type]}
                {learningSet.type.toUpperCase()}
              </span>
            )}
            {learningSet?.difficulty && (
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLES[learningSet.difficulty]}`}
              >
                {learningSet.difficulty}
              </span>
            )}
          </div>
        </div>

        {/* Stat cards */}
        {learningSet && (
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-0.5 bg-muted/40 rounded-lg p-3 border border-border">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
                Total cards
              </span>
              <span className="text-2xl font-semibold text-text">
                {learningSet.items.length}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 bg-muted/40 rounded-lg p-3 border border-border">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
                Showing
              </span>
              <span className="text-2xl font-semibold text-text">
                {showedItems.length}
              </span>
            </div>
          </div>
        )}

        {/* Auto-save indicator */}
        {learningSet && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Saved to library automatically
          </div>
        )}

        {/* Created date */}
        {learningSet?.createdAt && (
          <p className="text-xs text-muted-foreground">
            Generated{" "}
            {new Date(learningSet.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}

        <div className="border-t border-border" />

        {/* Single action */}
        <button
          onClick={() => setLearningSet(null)}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg border border-primary/30 text-text text-sm font-medium hover:bg-primary/10 transition-colors cursor-pointer bg-primary"
        >
          <RotateCcw className="w-4 h-4" />
          Generate new set
        </button>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-text">Learning Items</h2>

        <div className="border-b border-border" />

        <div className="max-h-125 overflow-y-auto overflow-x-hidden px-2 py-1">
          <div className="flex flex-col gap-2">
            {showedItems.map((item, idx) => (
              <GeneratedLearningItems key={idx} learningItem={item} />
            ))}
          </div>
          {hasMoreItems && (
            <button
              onClick={() => setStartIndex((prev) => prev + VISIBLE_ITEM_COUNT)}
              className="w-full my-4 text-sm text-primary hover:underline underline-offset-4 py-1"
            >
              Show {remainingCount} more cards
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GeneratedLearningSets;
