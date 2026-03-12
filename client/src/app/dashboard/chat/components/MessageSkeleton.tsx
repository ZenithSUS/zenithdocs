function MessageSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`flex gap-4 ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          {i % 2 !== 0 && (
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 shrink-0 mt-1 animate-pulse" />
          )}
          <div
            className={`h-14 rounded-2xl animate-pulse ${i % 2 === 0 ? "bg-primary/5 border border-primary/10" : "bg-white/5 border border-white/10"}`}
            style={{ width: `${45 + (i % 3) * 15}%` }}
          />
          {i % 2 === 0 && (
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 shrink-0 mt-1 animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
}

export default MessageSkeleton;
