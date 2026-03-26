"use client";

import dynamic from "next/dynamic";

const DocumentSharedViewer = dynamic(() => import("./DocumentSharedViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-[#F5F5F5]/40 text-sm animate-pulse">
      Loading viewer…
    </div>
  ),
});

export default DocumentSharedViewer;
