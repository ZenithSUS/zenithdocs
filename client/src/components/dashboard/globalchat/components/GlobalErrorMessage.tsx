function GlobalErrorMessage() {
  return (
    <div className="flex justify-center py-3">
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-red-400/70"
        style={{
          background: "rgba(239,68,68,0.06)",
          border: "1px solid rgba(239,68,68,0.12)",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 shrink-0" />
        Failed to load messages
      </div>
    </div>
  );
}

export default GlobalErrorMessage;
