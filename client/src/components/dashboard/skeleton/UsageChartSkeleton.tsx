function UsageChartSkeleton() {
  return (
    <div className="border border-white/8 rounded-sm overflow-hidden">
      <div className="px-5 sm:px-7 py-4 border-b border-white/6 bg-white/2 animate-pulse">
        <div className="w-40 h-3 bg-white/8 rounded" />
      </div>
      <div className="px-5 sm:px-7 py-6 space-y-6">
        {/* Bar chart skeleton */}
        <div className="flex items-end gap-2 sm:gap-3 h-32">
          {[40, 65, 55, 80, 70, 90].map((height, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-white/8 animate-pulse"
              style={{ height: `${height}%`, minHeight: 4 }}
            />
          ))}
        </div>
        {/* Labels skeleton */}
        <div className="flex gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-1 text-center">
              <div className="w-8 h-2 bg-white/6 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UsageChartSkeleton;
