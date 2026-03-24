"use client";

import { useState, useCallback, useRef } from "react";
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

  const pageWidth = (containerWidth || 600) * scale;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Controls */}
      <DocumentControls
        numPages={numPages}
        currentPage={currentPage}
        scale={scale}
        setCurrentPage={setCurrentPage}
        setScale={setScale}
      />

      {/* PDF Render Area */}
      <DocumentCanvas
        containerRef={containerRef}
        draggingStart={dragStart}
        document={document}
        currentPage={currentPage}
        scale={scale}
        pageWidth={pageWidth}
        containerWidth={containerWidth}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        setNumPages={setNumPages}
      />
    </div>
  );
}
