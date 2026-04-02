"use client";

import { useState } from "react";
import GeneratedLearningCard from "@/components/dashboard/cards/learning-sets/GeneratedLearningCard";
import { LearningItem } from "@/types/learning-set";

interface StudyItemsProps {
  learningItems: LearningItem[];
  pageSize?: number;
}

function StudyItems({ learningItems, pageSize = 5 }: StudyItemsProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const visibleItems = learningItems.slice(0, visibleCount);
  const hasMore = visibleCount < learningItems.length;
  const remaining = learningItems.length - visibleCount;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + pageSize, learningItems.length));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Items count indicator */}
      <p className="text-xs text-muted font-medium">
        Showing {visibleItems.length} of {learningItems.length} items
      </p>

      {/* Items list */}
      <div className=" max-h-125 overflow-y-auto px-2">
        <div className="flex flex-col gap-3">
          {visibleItems.map((learningItem, index) => (
            <GeneratedLearningCard key={index} learningItem={learningItem} />
          ))}
        </div>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <button
          onClick={loadMore}
          className="my-2 w-full py-3 rounded-xl border border-border bg-card hover:bg-accent/10 text-sm font-semibold text-text transition-colors duration-200"
        >
          Load {Math.min(pageSize, remaining)} more
          <span className="ml-1 text-muted font-normal">
            ({remaining} remaining)
          </span>
        </button>
      )}

      {/* All loaded indicator */}
      {!hasMore && learningItems.length > pageSize && (
        <p className="text-center text-xs text-muted py-2">All items loaded</p>
      )}
    </div>
  );
}

export default StudyItems;
