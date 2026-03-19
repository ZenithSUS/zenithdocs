"use client";

import { useState, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import type Doc from "@/types/doc";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface DocumentViewerProps {
  document: Doc;
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    setContainerWidth(node.getBoundingClientRect().width);

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const isPdf =
    document.fileType === "application/pdf" || document.fileType === "pdf";

  if (!isPdf) {
    return (
      <div className="h-full overflow-y-auto p-6 text-sm text-[#F5F5F5]/80 font-mono leading-relaxed whitespace-pre-wrap">
        {document.rawText || "No preview available."}
      </div>
    );
  }

  if (!document.fileUrl) {
    return (
      <div className="h-full flex items-center justify-center text-[#F5F5F5]/40 text-sm">
        No file URL available.
      </div>
    );
  }

  // Fill the full container width at 100%, scale multiplies on top
  const pageWidth = (containerWidth || 600) * scale;

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/6 shrink-0">
        {/* Page navigation */}
        <div className="flex items-center gap-1">
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

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)))
            }
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

      {/* PDF Render Area — this is the key part */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto select-none"
        style={{
          backgroundColor: "#1a1a1a",
          cursor: isDragging ? "grabbing" : scale > 1 ? "grab" : "default",
        }}
        onMouseDown={(e) => {
          if (scale <= 1) return;
          setIsDragging(true);
          dragStart.current = { x: e.clientX, y: e.clientY };
        }}
        onMouseMove={(e) => {
          if (!isDragging) return;
          const dx = e.clientX - dragStart.current.x;
          const dy = e.clientY - dragStart.current.y;
          e.currentTarget.scrollLeft -= dx;
          e.currentTarget.scrollTop -= dy;
          dragStart.current = { x: e.clientX, y: e.clientY };
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => {
          const t = e.touches[0];
          dragStart.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchMove={(e) => {
          const t = e.touches[0];
          const dx = t.clientX - dragStart.current.x;
          const dy = t.clientY - dragStart.current.y;
          e.currentTarget.scrollLeft -= dx;
          e.currentTarget.scrollTop -= dy;
          dragStart.current = { x: t.clientX, y: t.clientY };
        }}
      >
        <div
          className={`flex py-4 min-h-full ${pageWidth > containerWidth ? "justify-start px-4" : "justify-center"}`}
        >
          {containerWidth > 0 && (
            <Document
              file={document.fileUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <div className="flex items-center justify-center h-40 text-[#F5F5F5]/40 text-sm animate-pulse">
                  Loading document…
                </div>
              }
              error={
                <div className="flex items-center justify-center h-40 text-red-400/70 text-sm">
                  Failed to load PDF. Check CORS settings.
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                width={pageWidth}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Document>
          )}
        </div>
      </div>
    </div>
  );
}
