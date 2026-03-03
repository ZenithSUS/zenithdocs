import DocumentCardSkeleton from "@/components/dashboard/skeleton/DocumentCardSkeleton";

function DocumentsLoadingSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="w-64 h-9 bg-white/6 rounded-sm animate-pulse" />
        <div className="w-32 h-9 bg-white/6 rounded-sm animate-pulse" />
        <div className="ml-auto w-24 h-4 bg-white/6 rounded-sm animate-pulse" />
      </div>
      <div className="border border-white/8 rounded-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/6 bg-white/2">
          {["TYPE", "DOCUMENT", "SIZE", "STATUS", "DATE", ""].map((h) => (
            <span
              key={h}
              className="text-[9px] tracking-[0.18em] text-text/25 font-sans"
            >
              {h}
            </span>
          ))}
        </div>
        <div className="divide-y divide-white/4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <DocumentCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DocumentsLoadingSkeleton;
