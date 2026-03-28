"use client";

import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface DocumentViewerControlsProps {
  currentPage: number;
  numPages: number;
  scale: number;
  onPageChange: (page: number) => void;
  onScaleChange: (scale: number) => void;
}

export default function DocumentControls({
  currentPage,
  numPages,
  scale,
  onPageChange,
  onScaleChange,
}: DocumentViewerControlsProps) {
  return (
    <div className="flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 border-b border-white/6 shrink-0 gap-2 sm:gap-3 overflow-x-auto scrollbar-none">
      {/* Page navigation */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="p-2 sm:p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors touch-manipulation"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-xs text-[#F5F5F5]/50 font-sans tabular-nums px-1 min-w-12 text-center">
          {currentPage} / {numPages || "—"}
        </span>
        <button
          onClick={() => onPageChange(Math.min(numPages, currentPage + 1))}
          disabled={currentPage >= numPages}
          className="p-2 sm:p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors touch-manipulation"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-white/10 shrink-0" />

      {/* Page Selector — hidden on small screens to save space */}
      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        <span className="text-xs text-[#F5F5F5]/40 font-sans shrink-0">
          Go to
        </span>
        <select
          value={currentPage}
          onChange={(e) => onPageChange(parseInt(e.target.value))}
          className="w-14 px-1.5 py-1 bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/18 rounded text-[#F5F5F5] text-xs font-sans focus:outline-none focus:border-[#C9A227]/40 transition-colors"
          aria-label="Go to page"
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

      {/* Divider — only shown when "Go to" is visible */}
      <div className="hidden sm:block w-px h-4 bg-white/10 shrink-0" />

      {/* Zoom controls */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        <button
          onClick={() =>
            onScaleChange(Math.max(0.5, +(scale - 0.25).toFixed(2)))
          }
          disabled={scale <= 0.5}
          className="p-2 sm:p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors touch-manipulation"
          aria-label="Zoom out"
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={() => onScaleChange(1.0)}
          className="text-xs text-[#F5F5F5]/50 font-sans tabular-nums w-10 sm:w-12 text-center hover:text-[#F5F5F5] transition-colors touch-manipulation"
          aria-label="Reset zoom to fit"
          title="Click to reset to fit width"
        >
          {scale === 1.0 ? "Fit" : `${Math.round(scale * 100)}%`}
        </button>
        <button
          onClick={() => onScaleChange(Math.min(3, +(scale + 0.25).toFixed(2)))}
          disabled={scale >= 3}
          className="p-2 sm:p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors touch-manipulation"
          aria-label="Zoom in"
        >
          <ZoomIn size={14} />
        </button>
      </div>
    </div>
  );
}
