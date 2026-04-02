import { SummaryType } from "@/types/summary";
import { DashboardOverview } from "@/types/dashboard";
import UsageCard from "@/components/dashboard/cards/UsageCard";
import UsageChartSkeleton from "@/components/dashboard/skeleton/UsageChartSkeleton";
import { SUMMARY_ICONS } from "@/constants/summary-icons";

interface Props {
  overview: DashboardOverview | undefined;
  overviewLoading: boolean;
  currentMonth: string;
  maxUsage: number;
}

const TokenUsagePanel = ({
  overview,
  overviewLoading,
  currentMonth,
  maxUsage,
}: Props) => (
  <div className="xl:col-span-2 border border-white/8 rounded-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-white/6">
      <span className="text-[11px] tracking-[0.15em] text-text/50 font-sans">
        TOKEN USAGE — 6 MONTHS
      </span>
    </div>

    {/* Usage history bars */}
    <div className="px-5 py-5 flex flex-col gap-3">
      {overviewLoading ? (
        <UsageChartSkeleton />
      ) : overview?.usageHistory.length === 0 ? (
        <div className="px-5 py-5 text-center text-text/40">
          No usage history
        </div>
      ) : (
        overview?.usageHistory.map((u) => (
          <UsageCard
            key={u.month}
            usage={u}
            currentMonth={currentMonth}
            maxUsage={maxUsage}
          />
        ))
      )}
    </div>

    {/* Summary type breakdown */}
    <div className="px-5 pb-5">
      <div className="border-t border-white/6 pt-4">
        <div className="text-[10px] tracking-[0.15em] text-text/30 font-sans mb-3">
          SUMMARY TYPES
        </div>
        <div className="grid grid-cols-2 gap-2">
          {overview?.totalSummaryTypes.map((t) => (
            <div
              key={t._id}
              className="flex items-center gap-2 text-[11px] font-sans"
            >
              <span className="text-primary text-[13px]">
                {SUMMARY_ICONS[t._id as SummaryType]}
              </span>
              <span className="text-text/45 capitalize">{t._id}</span>
              <span className="ml-auto text-text/25">{t.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default TokenUsagePanel;
