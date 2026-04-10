"use client";

import SummaryCard from "@/components/dashboard/cards/SummaryCard";
import SummaryCardSkeleton from "@/components/dashboard/skeleton/SummaryCardSkeleton";

import useSummaryTab from "./useSummaryTab";
import SummaryEmptyState from "./components/SummaryEmptyState";
import SummaryLoadMore from "./components/SummaryLoadMore";
import UnusedSummaryTypes from "./components/UnusedSummaryTypes";
import SearchBar from "../../SearchBar";
import FetchError from "../../FetchError";

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
    searchQuery,
    setSearchQuery,
    isError,
    error,
    refetch,
  } = useSummaryTab(userId);

  if (isLoading) {
    return <SummaryCardSkeleton />;
  }

  if (isError) {
    return (
      <FetchError
        error={error}
        refetch={refetch}
        errorTitleMessage="Failed to fetch summaries"
      />
    );
  }

  return (
    <div className="space-y-5">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search Summaries by document title..."
      />
      {allSummaries.length > 0 ? (
        <>
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
        </>
      ) : searchQuery.trim() ? (
        <div className="text-center py-12 text-[12px] text-text/30 font-sans tracking-wider">
          No summaries found for &quot;{searchQuery}&quot;
        </div>
      ) : (
        <SummaryEmptyState />
      )}
    </div>
  );
};

export default SummaryTab;
