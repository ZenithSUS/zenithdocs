"use client";
import dynamic from "next/dynamic";

const DocumentViewer = dynamic(() => import("./DocumentViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-40 text-[#F5F5F5]/40 text-sm animate-pulse">
      Loading viewer…
    </div>
  ),
});

export default DocumentViewer;
