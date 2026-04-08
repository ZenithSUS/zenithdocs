"use client";

import useUsageTab from "./useUsageTab";
import UsageSnapshot from "./components/UsageSnapShot";
import DailyMessageLineChart from "./components/DailyMessageLineChart";
import StorageUsageAreaChart from "./components/StorageUsedAreaChart";
import AIRequestBarChart from "./components/AIRequestBarChart";
import DocumentUploadUsageChart from "./components/DocumentUploadUsageChart";
import FetchError from "../../FetchError";
import UsageTabLoading from "../../skeleton/UsageTabLoading";

interface Props {
  userId: string;
  totalMessagesThisMonth: number;
  totalAIRequests: number;
  currentMonth: string;
}

const LEGEND_COLORS: Record<string, string> = {
  golden: "bg-[#c9a227]",
  orange: "bg-[#f59e0b]",
};

const ChartPanel = ({
  label,
  children,
  legends,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  legends?: { name: string; color: keyof typeof LEGEND_COLORS }[];
  className?: string;
}) => (
  <div
    className={`border border-white/8 rounded-sm overflow-hidden ${className}`}
  >
    <div className="px-5 py-4 border-b border-white/6 flex justify-between items-center">
      <span className="text-[11px] tracking-[0.15em] font-sans text-white/50">
        {label}
      </span>

      <div className="flex items-center gap-2">
        {legends &&
          legends.map((legend, index) => (
            <div key={index} className="flex items-center gap-2">
              <p className="text-xs tracking-wide font-sans text-white/50">
                {legend.name}
              </p>

              <div
                className={`h-4 w-4 rounded-md ${LEGEND_COLORS[legend.color]}`}
              />
            </div>
          ))}
      </div>
    </div>
    {children}
  </div>
);

const UsageTab = ({
  userId,
  totalMessagesThisMonth,
  totalAIRequests,
  currentMonth,
}: Props) => {
  const {
    usage,
    isLoadingUsage,
    userDailyMessages,
    isLoadingDailyMessages,
    isUsageTabError,
    usageErrorInfo,
    refetchUsagePage,
    documentsThisMonth,
    nextMonthLabel,
  } = useUsageTab({ userId, currentMonth });

  if (isLoadingUsage || isLoadingDailyMessages) {
    return <UsageTabLoading />;
  }

  if (isUsageTabError) {
    return (
      <FetchError
        error={usageErrorInfo}
        refetch={refetchUsagePage}
        errorTitleMessage="Failed to get usage data"
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Snapshot ── */}
      <UsageSnapshot
        documentsThisMonth={documentsThisMonth}
        totalMessagesThisMonth={totalMessagesThisMonth}
        totalAIRequests={totalAIRequests}
        nextMonthLabel={nextMonthLabel}
      />

      {/* ── Charts grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Daily Messages */}
        <ChartPanel label="DAILY MESSAGES USAGE">
          <DailyMessageLineChart
            dailyMessages={userDailyMessages?.dailyMessages || {}}
          />
        </ChartPanel>

        {/* Storage */}
        <ChartPanel label="STORAGE USAGE">
          <StorageUsageAreaChart usage={usage} />
        </ChartPanel>

        {/* AI Requests — full width */}
        <ChartPanel
          label="AI REQUEST USAGE"
          className="md:col-span-2"
          legends={[
            { name: "AI Requests", color: "orange" },
            { name: "Total Messages", color: "golden" },
          ]}
        >
          <AIRequestBarChart usage={usage} />
        </ChartPanel>

        {/* Document Uploads — full width, split into bar + donut */}
        <div className="md:col-span-2 border border-white/8 rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-white/6">
            <span className="text-[11px] tracking-[0.15em] font-sans text-white/50">
              DOCUMENT UPLOADED USAGE
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] divide-y md:divide-y-0 md:divide-x divide-white/6">
            {/* Left — horizontal bar chart */}
            <div className="p-5">
              <DocumentUploadUsageChart usage={usage} variant="bar" />
            </div>
            {/* Right — doughnut + legend */}
            <div className="p-5 flex flex-col items-center justify-center">
              <DocumentUploadUsageChart usage={usage} variant="donut" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageTab;
