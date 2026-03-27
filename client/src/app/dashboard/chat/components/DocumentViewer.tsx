"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import type Doc from "@/types/doc";
import DocumentControls from "./DocumentControls";
import DocumentCanvas from "./DocumentCanvas";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface DocumentViewerProps {
  document: Doc | null;
}

const CANVAS_PADDING = 32;
const MAX_BASE_WIDTH = 900;

function computeBase(width: number) {
  return Math.max(Math.min(width - CANVAS_PADDING * 2, MAX_BASE_WIDTH), 200);
}

const FALLBACK_WIDTH = MAX_BASE_WIDTH + CANVAS_PADDING * 2;

export default function DocumentViewer({ document }: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const [containerWidth, setContainerWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : FALLBACK_WIDTH,
  );
  const [basePageWidth, setBasePageWidth] = useState<number>(() =>
    computeBase(
      typeof window !== "undefined" ? window.innerWidth : FALLBACK_WIDTH,
    ),
  );

  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const lastWidth = useRef(0);
  const rafId = useRef<number | null>(null);

  const pageWidth = useMemo(
    () => basePageWidth * scale,
    [basePageWidth, scale],
  );

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    const initialWidth = node.getBoundingClientRect().width;
    if (initialWidth > 0) {
      lastWidth.current = initialWidth;
      setContainerWidth(initialWidth);
      setBasePageWidth(computeBase(initialWidth));
    }

    const commit = (width: number) => {
      if (Math.abs(width - lastWidth.current) < 5) return;
      lastWidth.current = width;
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        setContainerWidth(width);
        setBasePageWidth(computeBase(width));
      });
    };

    const observer = new ResizeObserver(([entry]) => {
      commit(entry.contentRect.width);
    });
    observer.observe(node);

    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      observer.disconnect();
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

  return (
    <div className="flex flex-col h-full min-h-0">
      <DocumentControls
        numPages={numPages}
        currentPage={currentPage}
        scale={scale}
        setCurrentPage={(page) => {
          setIsPageLoading(true);
          setCurrentPage(page);
        }}
        setScale={setScale}
      />
      <DocumentCanvas
        containerRef={containerRef}
        draggingStart={dragStart}
        document={document}
        currentPage={currentPage}
        scale={scale}
        pageWidth={pageWidth}
        containerWidth={containerWidth}
        isDragging={isDragging}
        isPageLoading={isPageLoading}
        setIsDragging={setIsDragging}
        setNumPages={setNumPages}
        setIsPageLoading={setIsPageLoading}
      />
    </div>
  );
}
