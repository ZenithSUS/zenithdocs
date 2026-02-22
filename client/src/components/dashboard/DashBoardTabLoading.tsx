"use client";

export default function DashboardTabLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Skeleton stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="px-5 py-5 border border-white/8 rounded-sm bg-white/2 animate-pulse"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="w-6 h-6 bg-white/8 rounded" />
              <div className="w-8 h-3 bg-white/6 rounded" />
            </div>
            <div className="w-16 h-8 bg-white/8 rounded mb-1" />
            <div className="w-24 h-3 bg-white/6 rounded mb-2" />
            <div className="w-20 h-3 bg-white/6 rounded" />
          </div>
        ))}
      </div>

      {/* Skeleton main content area */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
        {/* Left column skeleton */}
        <div className="xl:col-span-3 border border-white/8 rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-white/6 bg-white/2 animate-pulse">
            <div className="w-32 h-3 bg-white/8 rounded" />
          </div>
          <div className="divide-y divide-white/4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="px-5 py-4 flex items-center gap-4 animate-pulse"
              >
                <div className="w-8 h-9 bg-white/8 rounded shrink-0" />
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="w-full max-w-xs h-3 bg-white/8 rounded" />
                  <div className="w-32 h-2 bg-white/6 rounded" />
                </div>
                <div className="w-16 h-3 bg-white/6 rounded shrink-0 hidden sm:block" />
                <div className="w-6 h-6 bg-white/6 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Right column skeleton */}
        <div className="xl:col-span-2 border border-white/8 rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-white/6 bg-white/2 animate-pulse">
            <div className="w-40 h-3 bg-white/8 rounded" />
          </div>
          <div className="px-5 py-5 space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-3 bg-white/6 rounded shrink-0" />
                <div className="flex-1 h-1.5 bg-white/6 rounded" />
                <div className="w-10 h-3 bg-white/6 rounded shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section skeleton */}
      <div className="border border-white/8 rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6 bg-white/2 animate-pulse">
          <div className="w-32 h-3 bg-white/8 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/6">
          {[1, 2].map((i) => (
            <div key={i} className="px-5 py-5 animate-pulse space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-white/8 rounded" />
                <div className="w-20 h-3 bg-white/8 rounded" />
                <div className="ml-auto w-16 h-2 bg-white/6 rounded" />
              </div>
              <div className="w-full h-2 bg-white/6 rounded" />
              <div className="w-full h-2 bg-white/6 rounded" />
              <div className="w-3/4 h-2 bg-white/6 rounded" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export function FolderCardSkeleton() {
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

export function UsageChartSkeleton() {
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

export function StatCardSkeleton() {
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
