function DocumentPreview() {
  return (
    <section className="px-5 sm:px-8 md:px-12 pb-20 md:pb-30 pt-10 flex justify-center">
      <div className="w-full max-w-215 border border-primary/18 rounded-md bg-[rgba(31,41,55,0.4)] backdrop-blur-xl overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-white/6 flex items-center gap-2 bg-black/30">
          {["#ff5f57", "#ffbd2e", "#28ca41"].map((c) => (
            <div
              key={c}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: c }}
            />
          ))}
          <span className="ml-2 sm:ml-3 text-[10px] sm:text-[12px] text-white/30 font-mono truncate">
            contract_review_2024.pdf — ZenithDocs
          </span>
        </div>
        <div className="flex flex-col md:flex-row min-h-80">
          <div className="flex-1 p-5 sm:p-7 border-b md:border-b-0 md:border-r border-white/6">
            <div className="text-[11px] tracking-widest text-white/25 mb-4 font-sans">
              DOCUMENT
            </div>
            {[100, 85, 95, 60, 80, 70, 90].map((w, i) => (
              <div
                key={i}
                className="h-2 rounded mb-2.5 animate-pulse"
                style={{
                  background: `rgba(255,255,255,${i % 3 === 0 ? 0.12 : 0.06})`,
                  width: `${w}%`,
                  animationDuration: `${1.5 + i * 0.2}s`,
                }}
              />
            ))}
            <div className="mt-5 px-3 sm:px-3.5 py-2 sm:py-2.5 bg-blue-600/12 border border-blue-600/25 rounded text-[11px] text-blue-300 font-sans">
              ◈ Key clause detected on page 3
            </div>
          </div>
          <div className="flex-[1.2] p-5 sm:p-7">
            <div className="text-[11px] tracking-widest text-primary mb-4 font-sans">
              AI SUMMARY
            </div>
            {/* Summary mode tabs */}
            <div className="flex gap-1.5 mb-4 flex-wrap">
              {["Executive", "Detailed", "Bullet", "Short"].map((mode, i) => (
                <span
                  key={mode}
                  className={`text-[9px] tracking-widest px-2.5 py-1 rounded-sm font-sans font-bold cursor-pointer transition-colors ${
                    i === 0
                      ? "bg-primary text-background"
                      : "border border-white/12 text-text/35 hover:border-primary/30 hover:text-primary/60"
                  }`}
                >
                  {mode.toUpperCase()}
                </span>
              ))}
            </div>
            <div className="mb-4 px-3 sm:px-4 py-2.5 sm:py-3 bg-primary/6 border border-primary/15 rounded">
              <div className="text-[11px] text-primary tracking-[0.08em] mb-1.5 font-sans">
                EXECUTIVE SUMMARY
              </div>
              <div className="text-[12px] sm:text-[13px] text-text/70 leading-[1.6] font-sans">
                Service agreement between Party A and Party B covering
                2024–2026. Auto-renewal clause present. Payment terms: Net-30.
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                {
                  label: "⚠ Risk",
                  text: "Auto-renewal clause (§4.2)",
                  color: "text-red-400",
                },
                {
                  label: "✓ Action",
                  text: "Sign before March 1, 2024",
                  color: "text-green-400",
                },
                {
                  label: "◆ Entity",
                  text: "Acme Corp, John Doe (CEO)",
                  color: "text-blue-300",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 sm:gap-2.5 text-[12px] font-sans"
                >
                  <span
                    className={`${item.color} min-w-12 sm:min-w-14 text-[11px] tracking-[0.05em]`}
                  >
                    {item.label}
                  </span>
                  <span className="text-text/55">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DocumentPreview;
