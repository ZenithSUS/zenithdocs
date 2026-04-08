import { DashboardOverview } from "@/types/dashboard";
import { calcPct } from "@/utils/usage";
import { Mail } from "lucide-react";
import { useState } from "react";

interface Props {
  overview: DashboardOverview | undefined;
  messagesPerDay: number;
}

const AIActivity = ({ overview, messagesPerDay }: Props) => {
  const messages = overview?.dailyMessage ?? 0;
  const messagePct = calcPct(messages, messagesPerDay);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxMessages = Math.max(
    ...(overview?.usageHistory?.map((u) => u.totalMessages) || [1]),
  );

  const totalHistoryMessages =
    overview?.usageHistory?.reduce((sum, u) => sum + u.totalMessages, 0) ?? 0;

  const avgMessages = overview?.usageHistory?.length
    ? Math.round(totalHistoryMessages / overview.usageHistory.length)
    : 0;

  const peakMonth = overview?.usageHistory?.reduce(
    (max, u) => (u.totalMessages > max.totalMessages ? u : max),
    overview.usageHistory[0],
  );

  return (
    <div className="xl:col-span-2 border border-white/8 rounded-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-white/6">
        <span className="text-[11px] tracking-[0.15em] text-text/50 font-sans">
          AI Activity
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Daily Message */}
        <div className="flex flex-col gap-2 border-b border-white/6 p-4">
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <h2 className="text-[15px] font-serif">
              Today&apos;s Message Usage
            </h2>
            <Mail size={16} />
            <p className="text-[11px] text-text/50 font-sans">{`${messages} / ${messagesPerDay}`}</p>
          </div>
          <div className="w-full h-2 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{ width: `${messagePct}%`, backgroundColor: "#C9A227" }}
            />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 px-4">
          <div className="flex flex-col gap-0.5 bg-white/4 rounded-sm p-3">
            <span className="text-[10px] text-text/40 font-sans tracking-wide">
              TOTAL
            </span>
            <span className="text-[16px] font-serif text-primary">
              {totalHistoryMessages}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 bg-white/4 rounded-sm p-3">
            <span className="text-[10px] text-text/40 font-sans tracking-wide">
              AVG / MO
            </span>
            <span className="text-[16px] font-serif text-primary">
              {avgMessages}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 bg-white/4 rounded-sm p-3">
            <span className="text-[10px] text-text/40 font-sans tracking-wide">
              PEAK MO
            </span>
            <span className="text-[16px] font-serif text-primary">
              {peakMonth
                ? new Date(peakMonth.month + "-01")
                    .toLocaleString("en-US", { month: "short" })
                    .toUpperCase()
                : "—"}
            </span>
          </div>
        </div>

        {/* Total Message Usage History */}
        <div className="p-4 flex flex-col">
          <div className="flex gap-2 items-center">
            <Mail size={16} color="#C9A227" />
            <p className="text-[12px] tracking-wide text-text/40">
              Total Message Usage History - Last 6 Months
            </p>
          </div>
          <div className="mt-4 h-48 flex items-end gap-2">
            {overview?.usageHistory?.map((item, i) => {
              const monthLabel = new Date(item.month + "-01")
                .toLocaleString("en-US", { month: "short" })
                .toUpperCase();
              const isHovered = hoveredIndex === i;
              const isPeak = item.totalMessages === maxMessages;

              return (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center h-full cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span
                    className="text-[9px] font-sans mb-1 transition-opacity duration-200"
                    style={{
                      color: isHovered || isPeak ? "#C9A227" : "transparent",
                    }}
                  >
                    {item.totalMessages}
                  </span>
                  <div
                    className="rounded-sm w-full mt-auto transition-all duration-200"
                    style={{
                      height: `${calcPct(item.totalMessages, maxMessages)}%`,
                      backgroundColor: isHovered
                        ? "#E5B84A"
                        : isPeak
                          ? "#C9A227"
                          : "#C9A22766",
                    }}
                  />
                  <span
                    className="mt-1 text-[9px] font-sans transition-colors duration-200"
                    style={{ color: isHovered ? "#C9A227" : undefined }}
                  >
                    {monthLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIActivity;
