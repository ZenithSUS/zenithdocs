import Doc from "@/types/doc";
import React from "react";
import { Document, Page } from "react-pdf";

interface DocumentCanvasProps {
  containerRef: (node: HTMLDivElement | null) => (() => void) | undefined;
  draggingStart: React.RefObject<{ x: number; y: number }>;
  document: Doc;
  currentPage: number;
  scale: number;
  pageWidth: number;
  containerWidth: number;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setNumPages: React.Dispatch<React.SetStateAction<number>>;
}

function DocumentCanvas({
  containerRef,
  draggingStart: dragStart,
  document,
  currentPage,
  scale,
  pageWidth,
  containerWidth,
  isDragging,
  setIsDragging,
  setNumPages,
}: DocumentCanvasProps) {
  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto select-none"
      style={{
        backgroundColor: "#1a1a1a",
        cursor: isDragging ? "grabbing" : scale > 1 ? "grab" : "default",
        WebkitOverflowScrolling: "touch",
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
            key={document._id}
            file={document.fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="flex items-center justify-center h-full text-[#F5F5F5]/40 text-sm animate-pulse">
                Loading document…
              </div>
            }
            error={
              <div className="flex items-center justify-center h-full text-red-400/70 text-sm">
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
  );
}

export default DocumentCanvas;
