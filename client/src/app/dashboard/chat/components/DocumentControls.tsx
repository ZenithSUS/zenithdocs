import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface DocumentControlsProps {
  numPages: number;
  currentPage: number;
  scale: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}

function DocumentControls({
  numPages,
  currentPage,
  scale,
  setCurrentPage,
  setScale,
}: DocumentControlsProps) {
  return (
    <div className="flex items-center justify-center px-3 py-2 border-b border-white/6 shrink-0 gap-3 overflow-x-auto scrollbar-none">
      {/* Page navigation */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-xs text-[#F5F5F5]/50 font-sans tabular-nums px-1">
          {currentPage} / {numPages || "—"}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
          disabled={currentPage >= numPages}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-white/10 shrink-0" />

      {/* Page Selector */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs text-[#F5F5F5]/40 font-sans shrink-0">
          Go to
        </span>
        <select
          value={currentPage}
          onChange={(e) => setCurrentPage(parseInt(e.target.value))}
          className="w-14 px-1.5 py-1 bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/18 rounded text-[#F5F5F5] text-xs font-sans focus:outline-none focus:border-[#C9A227]/40 transition-colors"
        >
          {Array.from({ length: numPages || 1 }, (_, i) => i + 1).map(
            (page) => (
              <option key={page} value={page} className="bg-background">
                {page}
              </option>
            ),
          )}
        </select>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-white/10 shrink-0" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)))}
          disabled={scale <= 0.5}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={() => setScale(1.0)}
          className="text-xs text-[#F5F5F5]/50 font-sans tabular-nums w-10 text-center hover:text-[#F5F5F5] transition-colors"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={() => setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)))}
          disabled={scale >= 3}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          <ZoomIn size={14} />
        </button>
      </div>
    </div>
  );
}

export default DocumentControls;
