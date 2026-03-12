import { ChevronUp } from "lucide-react";

interface LoadMoreButtonProps {
  isFetchingMore: boolean;
  handleLoadMore: () => void;
}

function LoadMoreButton({
  isFetchingMore,
  handleLoadMore,
}: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center pt-1 pb-2">
      <button
        onClick={handleLoadMore}
        disabled={isFetchingMore}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px]
                              font-mono tracking-wider transition-all duration-150
                              disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          color: "rgba(255,255,255,0.35)",
        }}
        onMouseEnter={(e) => {
          if (!isFetchingMore) {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(201,162,39,0.08)";
            el.style.borderColor = "rgba(201,162,39,0.22)";
            el.style.color = "#C9A227";
          }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = "rgba(255,255,255,0.04)";
          el.style.borderColor = "rgba(255,255,255,0.09)";
          el.style.color = "rgba(255,255,255,0.35)";
        }}
      >
        {isFetchingMore ? (
          <>
            <div
              className="w-2.5 h-2.5 rounded-full border animate-spin shrink-0"
              style={{
                borderColor: "rgba(201,162,39,0.4)",
                borderTopColor: "#C9A227",
              }}
            />
            LOADING...
          </>
        ) : (
          <>
            <ChevronUp size={11} />
            LOAD EARLIER
          </>
        )}
      </button>
    </div>
  );
}

export default LoadMoreButton;
