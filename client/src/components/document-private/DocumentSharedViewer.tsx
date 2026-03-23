"use client";

import { useState, useCallback, useRef } from "react";
import { pdfjs } from "react-pdf";
import DocumentViewerControls from "./DocumentViewerControls";
import DocumentViewerCanvas from "./DocumentViewerCanvas";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

// Horizontal padding inside the canvas scroll area (px each side)
const CANVAS_PADDING = 32;
// Maximum base width for the document — keeps it readable on large screens
const MAX_BASE_WIDTH = 900;

interface DocumentSharedViewerProps {
  document: {
    _id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    rawText: string;
  } | null;
}

export default function DocumentSharedViewer({
  document,
}: DocumentSharedViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);

  const [basePageWidth, setBasePageWidth] = useState<number>(0);

  const rafId = useRef<number | null>(null);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    const commit = (width: number) => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const base = Math.min(width - CANVAS_PADDING * 2, MAX_BASE_WIDTH);
        setBasePageWidth(Math.max(base, 200)); // floor at 200px
      });
    };

    commit(node.getBoundingClientRect().width);

    const observer = new ResizeObserver(([entry]) => {
      commit(entry.contentRect.width);
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const isPdf =
    document?.fileType === "application/pdf" || document?.fileType === "pdf";

  if (!isPdf) {
    return (
      <div className="h-full overflow-y-auto p-6 text-sm text-[#F5F5F5]/80 font-mono leading-relaxed whitespace-pre-wrap">
        {document?.rawText || "No preview available."}
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

  const pageWidth = basePageWidth * scale;

  return (
    <div className="flex flex-col h-full min-h-0">
      <DocumentViewerControls
        currentPage={currentPage}
        numPages={numPages}
        scale={scale}
        onPageChange={setCurrentPage}
        onScaleChange={setScale}
      />

      {/* Outer div measured for width; inner canvas handles scroll */}
      <div ref={containerRef} className="flex-1 min-h-0 overflow-hidden">
        <DocumentViewerCanvas
          fileUrl={document.fileUrl}
          documentId={document._id}
          currentPage={currentPage}
          scale={scale}
          pageWidth={pageWidth}
          basePageWidth={basePageWidth}
          onLoadSuccess={setNumPages}
        />
      </div>
    </div>
  );
}
