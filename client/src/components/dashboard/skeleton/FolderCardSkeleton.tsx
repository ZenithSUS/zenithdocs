function FolderCardSkeleton() {
  return (
    <div className="border border-white/6 rounded-sm px-6 py-6 animate-pulse">
      <div className="flex items-start justify-between mb-5">
        <div className="w-7 h-7 bg-white/8 rounded" />
        <div className="w-16 h-2 bg-white/6 rounded" />
      </div>
      <div className="w-32 h-4 bg-white/8 rounded mb-1" />
      <div className="w-24 h-3 bg-white/6 rounded mb-5" />
      <div className="flex gap-2 flex-wrap">
        <div className="w-16 h-5 bg-white/6 rounded-full" />
        <div className="w-20 h-5 bg-white/6 rounded-full" />
      </div>
      <div className="mt-4 pt-4 border-t border-white/6">
        <div className="w-full h-1 bg-white/6 rounded-full mb-1.5" />
        <div className="w-20 h-2 bg-white/6 rounded" />
      </div>
    </div>
  );
}

export default FolderCardSkeleton;
