function SummaryCardSkeleton() {
  return (
    <div className="border border-white/6 rounded-sm overflow-hidden animate-pulse">
      <div className="px-5 py-3.5 border-b border-white/6 bg-white/2 flex items-center gap-2">
        <div className="w-5 h-5 bg-white/8 rounded" />
        <div className="w-20 h-3 bg-white/8 rounded" />
        <div className="ml-auto w-16 h-2 bg-white/6 rounded" />
      </div>
      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-9 bg-white/8 rounded" />
          <div className="w-32 h-2 bg-white/6 rounded" />
        </div>
        <div className="w-full h-2 bg-white/6 rounded" />
        <div className="w-full h-2 bg-white/6 rounded" />
        <div className="w-3/4 h-2 bg-white/6 rounded" />
      </div>
    </div>
  );
}

export default SummaryCardSkeleton;
