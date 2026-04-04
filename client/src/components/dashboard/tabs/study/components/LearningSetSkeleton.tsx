function LearningSetSkeletion() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="group flex flex-col gap-4  border border-white/10 hover:border-white/20 border-t-2 bg-white/5 hover:bg-white/10 rounded-xl p-4 cursor-pointer transition-all duration-200 animate-pulse"
        >
          {/* Type icon + title */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 " />
              <div className="w-24 h-3 bg-white/6 rounded " />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 -translate-y-0.5 " />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 mt-auto pt-2">
            <div className="flex items-center gap-2">
              <div className="w-20 h-3 bg-white/8 px-2" />
              <div className="w-10 h-3 bg-white/8 px-2" />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-3 bg-white/8 px-2" />
              <div className="h-3 w-3 bg-white/8 rounded-full" />
              <div className="w-10 h-3 bg-white/8 px-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LearningSetSkeletion;
