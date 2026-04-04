import sizefmt from "@/helpers/size-format";

interface Props {
  tokenPct: number;
  tokenLimit: number;
  tokensUsed: number;
  remainingTokens: number;
  documentsThisMonth: number;
  nextMonthLabel: string;
}

const UsageSnapshot = ({
  tokenPct,
  tokenLimit,
  tokensUsed,
  remainingTokens,
  documentsThisMonth,
  nextMonthLabel,
}: Props) => {
  const stats = [
    {
      label: "Documents This Month",
      value: documentsThisMonth ?? "...",
      icon: "▣",
      sub: `${documentsThisMonth} uploaded`,
    },
    {
      label: "Tokens This Month",
      value: sizefmt.num(tokensUsed) ?? "...",
      icon: "◉",
      sub: `${tokenPct}% of limit`,
    },
    {
      label: "Tokens Remaining",
      value: sizefmt.num(remainingTokens) ?? "...",
      icon: "◈",
      sub: `Resets on ${nextMonthLabel}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s, i) => (
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
          <div className="text-[11px] text-text/20 font-sans mt-2">{s.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default UsageSnapshot;
