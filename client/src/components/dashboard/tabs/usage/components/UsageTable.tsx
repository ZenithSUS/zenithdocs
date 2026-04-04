import sizefmt from "@/helpers/size-format";

interface UsageEntry {
  month: string;
  tokensUsed: number;
  documentsUploaded: number;
}

interface Props {
  usage: UsageEntry[];
  currentMonth: string;
}

const UsageTable = ({ usage, currentMonth }: Props) => {
  const rows = [...usage].reverse().slice(0, 6);

  return (
    <div className="border-t border-white/6 divide-y divide-white/4">
      {/* Header */}
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

      {rows.map((u, idx) => {
        const prev = rows[idx + 1];
        const trend = prev ? u.tokensUsed - prev.tokensUsed : 0;
        const isCurrent = u.month === currentMonth;

        return (
          <div
            key={u.month}
            className={`grid grid-cols-2 sm:grid-cols-4 px-5 sm:px-7 py-3.5 text-[13px] ${
              isCurrent ? "bg-primary/5" : ""
            }`}
          >
            <span className="font-sans text-text/70 flex items-center gap-2">
              {isCurrent && (
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
              className={`font-sans hidden sm:block text-[12px] ${
                trend > 0
                  ? "text-red-400"
                  : trend < 0
                    ? "text-green-400"
                    : "text-text/20"
              }`}
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
  );
};

export default UsageTable;
