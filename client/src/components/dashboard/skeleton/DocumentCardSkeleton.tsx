function DocumentCardSkeleton() {
  return (
    <div className="px-5 py-4 flex items-center gap-4 border-b border-white/4 animate-pulse">
      <div className="w-8 h-9 bg-white/8 rounded shrink-0" />
      <div className="flex-1 space-y-2 min-w-0">
        <div className="w-56 h-3 bg-white/8 rounded" />
        <div className="w-40 h-2 bg-white/6 rounded" />
      </div>
      <div className="w-16 h-3 bg-white/6 rounded shrink-0 hidden sm:block" />
      <div className="w-6 h-6 bg-white/6 rounded-full shrink-0" />
    </div>
  );
}

export default DocumentCardSkeleton;
