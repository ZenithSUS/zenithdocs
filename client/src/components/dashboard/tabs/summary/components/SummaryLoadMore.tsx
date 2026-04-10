import { ThreeDot } from "react-loading-indicators";

interface Props {
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

const SummaryLoadMore = ({
  loadMoreRef,
  isFetchingNextPage,
  onLoadMore,
}: Props) => (
  <div ref={loadMoreRef} className="flex items-center justify-center py-8">
    {isFetchingNextPage ? (
      <div className="flex items-center gap-2">
        <p className="text-[12px] text-primary font-sans tracking-widest">
          Loading more summaries
        </p>
        <ThreeDot color="#c9a227" size="small" />
      </div>
    ) : (
      <button
        onClick={onLoadMore}
        className="px-6 py-2.5 border border-white/10 text-text/50 rounded-sm text-[11px] tracking-widest font-sans transition-all duration-200 hover:border-primary/30 hover:text-text/70"
      >
        LOAD MORE
      </button>
    )}
  </div>
);

export default SummaryLoadMore;
