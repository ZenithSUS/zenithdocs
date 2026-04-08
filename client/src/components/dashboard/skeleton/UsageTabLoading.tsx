const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-white/6 rounded-sm ${className ?? ""}`} />
);

const UsageSnapshotSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="px-6 py-5 border border-white/8 rounded-sm bg-white/2"
      >
        <div className="flex items-start justify-between mb-3">
          <SkeletonBox className="w-6 h-6" />
        </div>
        <SkeletonBox className="w-3/5 h-7 mb-2" />
        <SkeletonBox className="w-4/5 h-2.5 mb-2" />
        <SkeletonBox className="w-2/5 h-2.5 mt-2" />
      </div>
    ))}
  </div>
);

const ChartSkeleton = ({
  label,
  height = "h-[300px]",
}: {
  label: string;
  height?: string;
}) => (
  <div className="border border-white/8 rounded-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-white/6">
      <SkeletonBox className="w-36 h-2.5" />
    </div>
    <div className="p-5">
      <SkeletonBox className={`w-full ${height}`} />
    </div>
  </div>
);

const UsageTabLoading = () => {
  return (
    <div className="space-y-5">
      <UsageSnapshotSkeleton />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <ChartSkeleton label="DAILY MESSAGES USAGE" />
        <ChartSkeleton label="STORAGE USAGE" />
      </div>

      <ChartSkeleton label="AI REQUEST USAGE" height="h-[400px]" />

      <div className="md:col-span-2 border border-white/8 rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6">
          <SkeletonBox className="w-44 h-2.5" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] divide-y md:divide-y-0 md:divide-x divide-white/6">
          <div className="p-5">
            <SkeletonBox className="w-full h-60" />
          </div>
          <div className="p-5 flex flex-col gap-3 items-center justify-center">
            <SkeletonBox className="w-40 h-40 rounded-full" />
            <div className="w-full flex flex-col gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <SkeletonBox className="w-16 h-2.5" />
                  <SkeletonBox className="w-6 h-2.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageTabLoading;
