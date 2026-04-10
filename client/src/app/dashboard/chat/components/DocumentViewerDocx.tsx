"use client";

import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";

interface DocumentViewerDocxProps {
  fileUrl: string;
  scale: number;
}

export default function DocumentViewerDocx({
  fileUrl,
  scale,
}: DocumentViewerDocxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loadDocx = async () => {
      if (!containerRef.current) return;

      setIsLoading(true);

      const res = await fetch(fileUrl);
      const blob = await res.blob();

      containerRef.current.innerHTML = "";

      await renderAsync(blob, containerRef.current, undefined, {
        className: "docx",
        inWrapper: true,
      });

      setIsLoading(false);
    };

    loadDocx();
  }, [fileUrl]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!wrapperRef.current) return;

    setIsDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
    setScrollStart({
      x: wrapperRef.current.scrollLeft,
      y: wrapperRef.current.scrollTop,
    });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !wrapperRef.current) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    wrapperRef.current.scrollLeft = scrollStart.x - dx;
    wrapperRef.current.scrollTop = scrollStart.y - dy;
  };

  const onMouseUp = () => setIsDragging(false);
  const onMouseLeave = () => setIsDragging(false);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#1a1a1a]">
          <div className="flex flex-col items-center gap-3">
            {/* Animated page icon */}
            <div className="relative w-12 h-14">
              <div className="w-12 h-14 rounded-sm border border-white/20 bg-white/5 flex items-end justify-center pb-2 overflow-hidden">
                {/* Shimmer lines */}
                <div className="absolute inset-0 flex flex-col justify-center gap-1.5 px-2 pt-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1 rounded-full bg-white/10 animate-pulse"
                      style={{
                        animationDelay: `${i * 100}ms`,
                        width: i === 4 ? "60%" : "100%",
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Folded corner */}
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#1a1a1a]">
                <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[12px] border-b-white/20 border-r-[12px] border-r-transparent" />
              </div>
            </div>
            <span className="text-sm text-white/40 tracking-wide">
              Loading document…
            </span>
          </div>
        </div>
      )}

      <div
        ref={wrapperRef}
        className="w-full h-full overflow-auto cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div
          style={{
            display: "inline-block",
            minWidth: "100%",
            paddingTop: "24px",
            paddingBottom: "24px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              width: "fit-content",
              margin: "0 auto",
            }}
          >
            <div ref={containerRef} className="bg-white text-black shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
