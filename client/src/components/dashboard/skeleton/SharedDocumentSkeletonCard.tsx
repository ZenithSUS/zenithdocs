function SharedDocumentSkeletonCard() {
  return (
    <article className="group relative bg-white/4 hover:bg-white/[0.07] border border-white/8 hover:border-white/15 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 animate-pulse">
      {/* Status strip */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 transition-colors duration-300 bg-gray-500
        "
      />

      <div className="p-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 p-2 bg-white/6 rounded-lg">
              <div className="w-8 h-8 bg-white/8 rounded" />
            </div>

            <div className="flex flex-col">
              <div className="w-32 h-3 bg-white/8 rounded" />
              <div className="w-24 h-2 bg-white/6 rounded mt-1" />
            </div>
          </div>
          <div className="h-8 w-8 bg-white/6 rounded-lg" />
        </div>

        {/* Badges row */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="w-12 h-6 bg-white/6 rounded-full" />
          <div className="w-12 h-6 bg-white/6 rounded-full" />
          <div className="w-12 h-6 bg-white/6 rounded-full" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-0.5 bg-white/6" />

      {/* Footer */}
      <div className="p-4 flex items-center justify-between">
        <div className="w-32 h-3 rounded-md bg-white/4" />
        <div className="w-12 h-3 rounded-md bg-white/4" />
      </div>
    </article>
  );
}

export default SharedDocumentSkeletonCard;
