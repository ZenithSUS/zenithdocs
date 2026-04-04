"use client";

import SummaryCard from "@/components/dashboard/cards/SummaryCard";
import SummaryCardSkeleton from "@/components/dashboard/skeleton/SummaryCardSkeleton";

import useSummaryTab from "./useSummaryTab";
import SummaryEmptyState from "./components/SummaryEmptyState";
import SummaryLoadMore from "./components/SummaryLoadMore";
import UnusedSummaryTypes from "./components/UnusedSummaryTypes";

interface Props {
  userId: string;
}

const SummaryTab = ({ userId }: Props) => {
  const {
    allSummaries,
    unusedTypes,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    loadMoreRef,
  } = useSummaryTab(userId);

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return <SummaryCardSkeleton />;
  }

  // ─── Empty ─────────────────────────────────────────────────────────────────
  if (allSummaries.length === 0) return <SummaryEmptyState />;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allSummaries.map((s) => (
          <SummaryCard key={`${s._id}-${s.createdAt}`} summary={s} />
        ))}
      </div>

      {hasNextPage && (
        <SummaryLoadMore
          loadMoreRef={loadMoreRef}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      )}

      {!hasNextPage && allSummaries.length > 0 && (
        <div className="text-center py-6 text-[11px] text-text/20 font-sans tracking-wider">
          — END OF SUMMARIES —
        </div>
      )}

      <UnusedSummaryTypes unusedTypes={unusedTypes} />
    </div>
  );
};

export default SummaryTab;
