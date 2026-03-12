import { ChevronUp } from "lucide-react";

interface LoadMoreButtonProps {
  isFetchingNextPage: boolean;
  handleLoadMore: () => void;
}

function LoadMoreMessageButton({
  isFetchingNextPage,
  handleLoadMore,
}: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center">
      <button
        onClick={handleLoadMore}
        disabled={isFetchingNextPage}
        className="flex items-center gap-2 px-4 py-2 text-[12px] font-sans tracking-wider text-text/50 hover:text-text/80 border border-white/10 hover:border-white/20 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isFetchingNextPage ? (
          <>
            <div className="w-3 h-3 border border-text/30 border-t-transparent rounded-full animate-spin" />
            LOADING...
          </>
        ) : (
          <>
            <ChevronUp className="w-3 h-3" />
            LOAD EARLIER MESSAGES
          </>
        )}
      </button>
    </div>
  );
}

export default LoadMoreMessageButton;
