"use client";

import { useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

interface DocumentViewerCanvasProps {
  fileUrl: string;
  documentId: string;
  currentPage: number;
  scale: number;
  /** Final rendered width in px (basePageWidth × scale) */
  pageWidth: number;
  /** The "100% / fit" width — used to decide centering vs scroll */
  basePageWidth: number;
  onLoadSuccess: (numPages: number) => void;
}

export default function DocumentViewerCanvas({
  fileUrl,
  documentId,
  currentPage,
  scale,
  pageWidth,
  basePageWidth,
  onLoadSuccess,
}: DocumentViewerCanvasProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const isOverflow = scale > 1;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isOverflow) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    scrollRef.current.scrollLeft -= dx;
    scrollRef.current.scrollTop -= dy;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    dragStart.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    const t = e.touches[0];
    const dx = t.clientX - dragStart.current.x;
    const dy = t.clientY - dragStart.current.y;
    scrollRef.current.scrollLeft -= dx;
    scrollRef.current.scrollTop -= dy;
    dragStart.current = { x: t.clientX, y: t.clientY };
  };

  return (
    <div
      ref={scrollRef}
      className="h-full w-full overflow-auto"
      style={{
        backgroundColor: "#1a1a1a",
        cursor: isDragging ? "grabbing" : isOverflow ? "grab" : "default",
        WebkitOverflowScrolling: "touch",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Centre when fits, left-align + pad when overflowing */}
      <div
        className="flex py-6 min-h-full"
        style={{
          justifyContent: "center",
          paddingLeft: isOverflow ? 16 : 0,
          paddingRight: isOverflow ? 16 : 0,
        }}
      >
        {/* Gate on pageWidth > 0 to avoid a zero-width flash */}
        {pageWidth > 0 && (
          <Document
            key={documentId}
            file={fileUrl}
            onLoadSuccess={({ numPages }) => onLoadSuccess(numPages)}
            loading={
              <div
                style={{
                  width: pageWidth || basePageWidth || 600,
                  minHeight: 400,
                }}
                className="animate-pulse bg-white/5 rounded"
              />
            }
            error={
              <div className="flex items-center justify-center h-64 w-full text-red-400/70 text-sm">
                Failed to load PDF. Check CORS settings.
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              width={pageWidth}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={
                <div
                  style={{ width: pageWidth, minHeight: 300 }}
                  className="animate-pulse bg-white/5 rounded"
                />
              }
            />
          </Document>
        )}
      </div>
    </div>
  );
}
