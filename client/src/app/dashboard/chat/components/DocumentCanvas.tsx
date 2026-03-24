import Doc from "@/types/doc";
import React, { useRef, useState } from "react";
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
  isPageLoading: boolean;
  setIsPageLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
  isPageLoading,
  setIsPageLoading,
  setIsDragging,
  setNumPages,
}: DocumentCanvasProps) {
  const [renderedPage, setRenderedPage] = useState(currentPage);
  const renderedPageWidth = useRef(pageWidth);

  const handleRenderSuccess = () => {
    setRenderedPage(currentPage);
    renderedPageWidth.current = pageWidth;
    setIsPageLoading(false);
  };

  const isTransitioning = isPageLoading && renderedPage !== currentPage;

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
        className={`flex py-4 min-h-full ${
          pageWidth > containerWidth ? "justify-start px-4" : "justify-center"
        }`}
      >
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
          {/*
           * Stacking strategy: both pages occupy the same grid cell so the
           * container never collapses between renders. The previous page fades
           * out only after the new page has fully painted.
           */}
          <div style={{ display: "grid" }}>
            {/* Previous page — visible only while next page is loading */}
            {isTransitioning && (
              <Page
                key={`prev-${renderedPage}`}
                pageNumber={renderedPage}
                width={renderedPageWidth.current}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            )}

            {/* Incoming / current page */}
            <Page
              key={`curr-${currentPage}`}
              pageNumber={currentPage}
              width={pageWidth}
              onRenderSuccess={handleRenderSuccess}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </div>
        </Document>
      </div>
    </div>
  );
}

export default DocumentCanvas;
