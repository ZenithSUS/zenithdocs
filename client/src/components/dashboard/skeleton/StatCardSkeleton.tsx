function StatCardSkeleton() {
  return (
    <div className="px-5 py-5 border border-white/8 rounded-sm bg-white/2 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="w-6 h-6 bg-white/8 rounded" />
        <div className="w-8 h-3 bg-white/6 rounded" />
      </div>
      <div className="w-16 h-8 bg-white/8 rounded mb-1" />
      <div className="w-24 h-3 bg-white/6 rounded mb-2" />
      <div className="w-20 h-3 bg-white/6 rounded" />
    </div>
  );
}

export default StatCardSkeleton;
