import sizefmt from "@/helpers/size-format";
import { Usage } from "@/types/usage";

interface UsageProps {
  currentMonth: string;
  usage: Usage[];
  tokenPct: number;
  tokenLimit: number;
  currentTokensUsed: number;
  maxUsage: number;
}

function UsageDashboard({
  currentMonth,
  usage,

  tokenPct,
  tokenLimit,
  currentTokensUsed,
  maxUsage,
}: UsageProps) {
  return (
    <div className="space-y-5">
      {/* Current month snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Documents This Month",
            value: usage.slice(-1)[0].documentsUploaded,
            icon: "▣",
            sub: "vs 9 last month",
          },
          {
            label: "Tokens This Month",
            value: sizefmt.num(currentTokensUsed),
            icon: "◉",
            sub: `${tokenPct}% of limit`,
          },
          {
            label: "Tokens Remaining",
            value: sizefmt.num(tokenLimit - currentTokensUsed),
            icon: "◈",
            sub: `Resets March 1`,
          },
        ].map((s, i) => (
          <div
            key={i}
            className="px-6 py-5 border border-white/8 rounded-sm bg-white/2 hover:border-primary/20 transition-colors duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[20px] text-primary">{s.icon}</span>
            </div>
            <div className="text-[28px] font-light text-text font-serif tracking-[-0.02em]">
              {s.value}
            </div>
            <div className="text-[10px] text-text/35 font-sans tracking-[0.06em] mt-0.5">
              {s.label.toUpperCase()}
            </div>
            <div className="text-[11px] text-text/20 font-sans mt-2">
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Token quota bar */}
      <div className="border border-white/8 rounded-sm px-5 sm:px-7 py-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[11px] tracking-[0.15em] text-text/50 font-sans">
            MONTHLY TOKEN QUOTA
          </span>
          <span className="text-[13px] font-sans text-text/60">
            {sizefmt.num(currentTokensUsed)} / {sizefmt.num(tokenLimit)}
          </span>
        </div>
        <div className="w-full h-3 bg-white/6 rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${tokenPct}%`,
              background:
                tokenPct > 80
                  ? "linear-gradient(90deg,#C9A227,#ef4444)"
                  : "linear-gradient(90deg,#C9A227,#e0b530)",
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-text/25 font-sans">
          <span>0</span>
          <span>2,500</span>
          <span>5,000</span>
          <span>7,500</span>
          <span>10,000</span>
        </div>
      </div>

      {/* Monthly bar chart */}
      <div className="border border-white/8 rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6">
          <span className="text-[11px] tracking-[0.15em] text-text/50 font-sans">
            HISTORICAL USAGE
          </span>
        </div>
        <div className="px-5 sm:px-7 py-6">
          {/* Bar chart */}
          <div className="flex items-end gap-2 sm:gap-3 h-32 mb-3">
            {usage.map((u) => {
              const h = (u.tokensUsed / maxUsage) * 100;
              const isCurrent = u.month === currentMonth;
              return (
                <div
                  key={u.month}
                  className="flex-1 flex flex-col items-center gap-1.5 group relative"
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background border border-primary/20 px-2.5 py-1.5 rounded-sm text-[10px] font-sans text-text/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {sizefmt.num(u.tokensUsed)} tokens
                    <br />
                    <span className="text-text/30">
                      {u.documentsUploaded} docs
                    </span>
                  </div>
                  <div
                    className="w-full rounded-t-sm transition-all duration-700"
                    style={{
                      height: `${h}%`,
                      minHeight: 4,
                      background: isCurrent
                        ? "#C9A227"
                        : "rgba(201,162,39,0.25)",
                      border: isCurrent
                        ? "1px solid rgba(201,162,39,0.5)"
                        : "1px solid rgba(255,255,255,0.06)",
                    }}
                  />
                </div>
              );
            })}
          </div>
          {/* X labels */}
          <div className="flex gap-2 sm:gap-3">
            {usage.map((u) => (
              <div
                key={u.month}
                className={`flex-1 text-center text-[10px] font-sans ${u.month === currentMonth ? "text-primary" : "text-text/25"}`}
              >
                {sizefmt.month(u.month)}
              </div>
            ))}
          </div>
        </div>

        {/* Monthly breakdown table */}
        <div className="border-t border-white/6 divide-y divide-white/4">
          <div className="hidden sm:grid grid-cols-4 px-5 sm:px-7 py-2.5 bg-white/2">
            {["MONTH", "DOCUMENTS", "TOKENS", "TREND"].map((h) => (
              <span
                key={h}
                className="text-[9px] tracking-[0.18em] text-text/25 font-sans"
              >
                {h}
              </span>
            ))}
          </div>
          {[...usage].reverse().map((u, idx) => {
            const prev = usage[usage.length - 2 - idx];
            const trend = prev ? u.tokensUsed - prev.tokensUsed : 0;
            return (
              <div
                key={u.month}
                className={`grid grid-cols-2 sm:grid-cols-4 px-5 sm:px-7 py-3.5 text-[13px] ${u.month === currentMonth ? "bg-primary/5" : ""}`}
              >
                <span className="font-sans text-text/70 flex items-center gap-2">
                  {u.month === currentMonth && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                  {u.month}
                </span>
                <span className="font-sans text-text/50">
                  {u.documentsUploaded} docs
                </span>
                <span className="font-sans text-text/50 hidden sm:block">
                  {sizefmt.num(u.tokensUsed)}
                </span>
                <span
                  className={`font-sans hidden sm:block text-[12px] ${trend > 0 ? "text-red-400" : trend < 0 ? "text-green-400" : "text-text/20"}`}
                >
                  {trend > 0
                    ? `↑ +${sizefmt.num(trend)}`
                    : trend < 0
                      ? `↓ ${sizefmt.num(trend)}`
                      : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UsageDashboard;
