import sizefmt from "@/helpers/size-format";

interface UsageEntry {
  month: string;
  tokensUsed: number;
  documentsUploaded: number;
}

interface Props {
  usage: UsageEntry[];
  currentMonth: string;
  maxUsage: number;
}

const CHART_HEIGHT_PX = 128;

const UsageBarChart = ({ usage, currentMonth, maxUsage }: Props) => (
  <>
    {/* Chart bars */}
    <div
      className="flex items-end gap-2 sm:gap-3 mb-3"
      style={{ height: CHART_HEIGHT_PX }}
    >
      {usage.slice(0, 6).map((u) => {
        const barPx =
          maxUsage > 0
            ? Math.max(
                4,
                Math.round((u.tokensUsed / maxUsage) * CHART_HEIGHT_PX),
              )
            : 4;
        const isCurrent = u.month === currentMonth;

        return (
          <div
            key={u.month}
            className="flex-1 flex flex-col justify-end items-center group relative h-full"
          >
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background border border-primary/20 px-2.5 py-1.5 rounded-sm text-[10px] font-sans text-text/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {sizefmt.num(u.tokensUsed)} tokens
              <br />
              <span className="text-text/30">{u.documentsUploaded} docs</span>
            </div>

            {/* Bar */}
            <div
              className="w-full rounded-t-sm transition-all duration-700 shrink-0"
              style={{
                height: barPx,
                background: isCurrent ? "#C9A227" : "rgba(201,162,39,0.25)",
                border: isCurrent
                  ? "1px solid rgba(201,162,39,0.5)"
                  : "1px solid rgba(255,255,255,0.06)",
              }}
            />
          </div>
        );
      })}
    </div>

    {/* X-axis labels */}
    <div className="flex gap-2 sm:gap-3">
      {usage.map((u) => (
        <div
          key={u.month}
          className={`flex-1 text-center text-[10px] font-sans ${
            u.month === currentMonth ? "text-primary" : "text-text/25"
          }`}
        >
          {sizefmt.month(u.month)}
        </div>
      ))}
    </div>
  </>
);

export default UsageBarChart;
