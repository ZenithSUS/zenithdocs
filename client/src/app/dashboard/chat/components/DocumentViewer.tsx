"use client";

import { useState, useCallback, useRef } from "react";
import { pdfjs } from "react-pdf";
import DocumentControls from "./DocumentControls";
import DocumentCanvas from "./DocumentCanvas";
import DocumentViewerDocx from "./DocumentViewerDocx";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const CANVAS_PADDING = 32;
const MAX_BASE_WIDTH = 900;

interface DocumentViewerProps {
  document: {
    _id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    rawText: string;
  } | null;
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [basePageWidth, setBasePageWidth] = useState<number>(0);

  const rafId = useRef<number | null>(null);
  const canvasScrollRef = useRef<HTMLDivElement | null>(null);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    const commit = (width: number) => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const base = Math.min(width - CANVAS_PADDING * 2, MAX_BASE_WIDTH);
        setBasePageWidth(Math.max(base, 200));
      });
    };

    commit(node.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) =>
      commit(entry.contentRect.width),
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const target = canvasScrollRef.current?.querySelector<HTMLElement>(
      `[data-page="${page}"]`,
    );
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePageVisible = (page: number) => {
    setCurrentPage(page);
  };

  const isPdf =
    document?.fileType === "application/pdf" || document?.fileType === "pdf";
  const isDocx =
    document?.fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    document?.fileType ===
      "vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (!isPdf && !isDocx) {
    return (
      <div className="h-full overflow-y-auto p-6 text-sm text-[#F5F5F5]/80 font-mono leading-relaxed whitespace-pre-wrap">
        {document?.rawText || "No preview available."}
      </div>
    );
  }

  if (isDocx && document.fileUrl) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="flex-1 min-h-0 overflow-hidden">
          <DocumentViewerDocx fileUrl={document.fileUrl} scale={scale} />
        </div>
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

  return (
    <div className="flex flex-col h-full min-h-0">
      <DocumentControls
        currentPage={currentPage}
        numPages={numPages}
        scale={scale}
        onPageChange={handlePageChange}
        onScaleChange={setScale}
      />
      <div ref={containerRef} className="flex-1 min-h-0 overflow-hidden">
        <DocumentCanvas
          fileUrl={document.fileUrl}
          documentId={document._id}
          scale={scale}
          basePageWidth={basePageWidth}
          onLoadSuccess={setNumPages}
          onPageVisible={handlePageVisible}
          scrollRefSetter={(el) => {
            canvasScrollRef.current = el;
          }}
        />
      </div>
    </div>
  );
}
