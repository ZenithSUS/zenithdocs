import { useEffect, useRef } from "react";
import { SummaryType } from "@/types/summary";
import useSummary from "@/features/summary/useSummary";
import SummaryCardSkeleton from "../skeleton/SummaryCardSkeleton";
import { ThreeDot } from "react-loading-indicators";
import SummaryCard from "../cards/SummaryCard";

export const SUMMARY_ICONS: Record<SummaryType, string> = {
  short: "◎",
  bullet: "◆",
  detailed: "▣",
  executive: "◈",
};

interface SummaryTabProps {
  userId: string;
}

function SummaryTab({ userId }: SummaryTabProps) {
  const { summariesByUserPage } = useSummary(userId);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    summariesByUserPage;

  // Intersection Observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages into a single array
  const allSummaries = data?.pages.flatMap((page) => page.summaries) ?? [];

  // Get unique summary types that exist
  const existingTypes = new Set(allSummaries.map((s) => s.type));
  const unusedTypes = (
    ["short", "bullet", "detailed", "executive"] as SummaryType[]
  ).filter((t) => !existingTypes.has(t));

  // Initial loading state
  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SummaryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (allSummaries.length === 0) {
    return (
      <div className="border border-white/8 rounded-sm px-8 py-16 text-center">
        <div className="text-[48px] text-text/10 mb-4">◎</div>
        <h3 className="text-[18px] font-serif text-text/60 mb-2">
          No summaries yet
        </h3>
        <p className="text-[13px] text-text/30 font-sans max-w-sm mx-auto">
          Upload a document to generate AI-powered summaries in multiple
          formats.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allSummaries.map((s) => (
          <SummaryCard key={s._id} summary={s} />
        ))}
      </div>

      {/* Load more trigger (intersection observer target) */}
      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-8"
        >
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-[12px] text-text/40 font-sans">
              <ThreeDot
                color="#c9a227"
                size="small"
                text="Loading more summaries..."
                textColor=""
              />
            </div>
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="px-6 py-2.5 border border-white/10 text-text/50 rounded-sm text-[11px] tracking-widest not-even:font-sans transition-all duration-200 hover:border-primary/30 hover:text-text/70"
            >
              LOAD MORE
            </button>
          )}
        </div>
      )}

      {/* End of list indicator */}
      {!hasNextPage && allSummaries.length > 0 && (
        <div className="text-center py-6 text-[11px] text-text/20 font-sans tracking-wider">
          — END OF SUMMARIES —
        </div>
      )}

      {/* Empty states for unused summary types */}
      {unusedTypes.length > 0 && (
        <div className="border-t border-white/6 pt-5 mt-8">
          <div className="text-[10px] tracking-[0.15em] text-text/25 font-sans mb-4">
            AVAILABLE SUMMARY TYPES
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {unusedTypes.map((t) => (
              <div
                key={t}
                className="border border-white/5 border-dashed rounded-sm px-4 py-6 text-center"
              >
                <div className="text-[20px] text-text/10 mb-2">
                  {SUMMARY_ICONS[t]}
                </div>
                <div className="text-[10px] text-text/20 font-sans tracking-wider capitalize">
                  {t}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryTab;
