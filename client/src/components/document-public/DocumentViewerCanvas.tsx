"use client";

import { useRef, useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const effectiveWidth = basePageWidth > 0 ? basePageWidth : 600;

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoaded(true);
    onLoadSuccess(numPages);
  };

  /**
   * Attaches an IntersectionObserver to the given container
   * and observes all elements with the "data-page" attribute.
   * When an element with the "data-page" attribute comes into view,
   * the onPageVisible callback is called with the page number as an argument.
   * @param {HTMLDivElement | null} container - The container to observe.
   * @param {function} onPageVisible - The callback to call when an element comes into view.
   */
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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
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
        cursor: isDragging ? "grabbing" : scale > 1 ? "grab" : "default",
        WebkitOverflowScrolling: "touch",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div
        style={{
          width: effectiveWidth * scale,
          paddingBottom: `calc((${scale} - 1) * 50%)`,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            width: effectiveWidth,
            marginLeft: "auto",
            marginRight: "auto",
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
                    width={effectiveWidth}
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
