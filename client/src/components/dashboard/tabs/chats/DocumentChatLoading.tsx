function DocumentChatLoading() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-serif text-text/90">
          Your Conversations
        </h2>
        <div className="text-[11px] text-text/25 font-sans">Loading...</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-5 bg-white/5 border border-white/10 rounded-lg animate-pulse"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-sm bg-white/10" />
              <div className="flex-1">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </div>
            <div className="h-10 bg-white/10 rounded mb-4" />
            <div className="h-8 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DocumentChatLoading;
