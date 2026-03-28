"use client";

import { useRef, useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

interface DocumentViewerCanvasProps {
  fileUrl: string;
  documentId: string;
  scale: number;
  basePageWidth: number;
  onLoadSuccess: (numPages: number) => void;
  onPageVisible?: (page: number) => void;
  scrollRefSetter?: (el: HTMLDivElement | null) => void;
}

export default function DocumentViewerCanvas({
  fileUrl,
  documentId,
  scale,
  basePageWidth,
  onLoadSuccess,
  onPageVisible,
  scrollRefSetter,
}: DocumentViewerCanvasProps) {
  const [numPages, setNumPages] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const [renderWidth, setRenderWidth] = useState(basePageWidth || 600);
  const [cssScale, setCssScale] = useState(1);

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetWidth = Math.round((basePageWidth || 600) * scale);

  useEffect(() => {
    if (basePageWidth === 0) return;

    // Immediately update CSS scale for instant visual feedback
    setCssScale(targetWidth / renderWidth);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setRenderWidth(targetWidth);
      setCssScale(1); // Reset CSS scale
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, basePageWidth]);

  // Render width catches up to scale, so reset CSS scale
  useEffect(() => {
    setCssScale(1);
  }, [renderWidth]);

  const effectiveWidth = renderWidth > 0 ? renderWidth : 600;

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoaded(true);
    onLoadSuccess(numPages);
  };

  const attachObserver = (container: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    if (!container || !onPageVisible) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const page = Number((visible.target as HTMLElement).dataset.page);
          if (page) onPageVisible(page);
        }
      },
      { root: container, threshold: 0.3 },
    );
    container
      .querySelectorAll<HTMLElement>("[data-page]")
      .forEach((el) => observerRef.current!.observe(el));
  };

  const setCursor = (cursor: string) => {
    if (scrollRef.current) scrollRef.current.style.cursor = cursor;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    setCursor("grabbing");
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setCursor(scale > 1 ? "grab" : "default");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    scrollRef.current.scrollLeft -= e.clientX - dragStart.current.x;
    scrollRef.current.scrollTop -= e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft -= e.touches[0].clientX - dragStart.current.x;
    scrollRef.current.scrollTop -= e.touches[0].clientY - dragStart.current.y;
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  return (
    <div
      ref={(el) => {
        (scrollRef as React.RefObject<HTMLDivElement | null>).current = el;
        scrollRefSetter?.(el);
        attachObserver(el);
      }}
      className="h-full w-full overflow-auto"
      style={{
        backgroundColor: "#1a1a1a",
        WebkitOverflowScrolling: "touch",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div
        style={{
          width: effectiveWidth * cssScale,
          minHeight: "100%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        className="flex justify-center"
      >
        <div
          style={{
            transform: cssScale !== 1 ? `scale(${cssScale})` : undefined,
            transformOrigin: "top center",
            width: effectiveWidth,
          }}
          className="py-6 flex flex-col items-center gap-4"
        >
          <Document
            key={`${documentId}__${fileUrl}`}
            file={fileUrl}
            onLoadSuccess={handleLoadSuccess}
            loading={
              <div
                style={{ width: effectiveWidth, minHeight: 400 }}
                className="animate-pulse bg-white/5 rounded"
              />
            }
            error={
              <div className="flex items-center justify-center h-64 w-full text-red-400/70 text-sm">
                Failed to load PDF. Check CORS settings.
              </div>
            }
          >
            {isLoaded &&
              Array.from({ length: numPages }, (_, i) => (
                <div key={i} data-page={i + 1} className="mb-4">
                  <Page
                    pageNumber={i + 1}
                    width={effectiveWidth} // ← always the debounced render width
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    loading={
                      <div
                        style={{ width: effectiveWidth, minHeight: 300 }}
                        className="animate-pulse bg-white/5 rounded"
                      />
                    }
                  />
                </div>
              ))}
          </Document>
        </div>
      </div>
    </div>
  );
}
