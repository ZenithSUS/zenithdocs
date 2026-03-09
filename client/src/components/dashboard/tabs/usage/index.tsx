"use client";

import useUsageTab from "./useUsageTab";
import UsageSnapshot from "./components/UsageSnapShot";
import TokenQuotaBar from "./components/TokenQuotaBar";
import UsageBarChart from "./components/UsageBarChart";
import UsageTable from "./components/UsageTable";

interface Props {
  userId: string;
  currentMonth: string;
  tokenPct: number;
  tokenLimit: number;
  currentTokensUsed: number;
  maxUsage: number;
}

const UsageTab = ({
  userId,
  currentMonth,
  tokenPct,
  tokenLimit,
  currentTokensUsed,
  maxUsage,
}: Props) => {
  const {
    usage,
    tokensUsed,
    remainingTokens,
    documentsThisMonth,
    nextMonthLabel,
  } = useUsageTab({ userId, currentMonth, tokenLimit, currentTokensUsed });

  return (
    <div className="space-y-5">
      <UsageSnapshot
        tokenPct={tokenPct}
        tokenLimit={tokenLimit}
        tokensUsed={tokensUsed}
        remainingTokens={remainingTokens}
        documentsThisMonth={documentsThisMonth}
        nextMonthLabel={nextMonthLabel}
      />

      <TokenQuotaBar
        tokenPct={tokenPct}
        tokenLimit={tokenLimit}
        tokensUsed={tokensUsed}
      />

      <div className="border border-white/8 rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6">
          <span className="text-[11px] tracking-[0.15em] text-text/50 font-sans">
            HISTORICAL USAGE
          </span>
        </div>

        <div className="px-5 sm:px-7 py-6">
          <UsageBarChart
            usage={usage}
            currentMonth={currentMonth}
            maxUsage={maxUsage}
          />
        </div>

        <UsageTable usage={usage} currentMonth={currentMonth} />
      </div>
    </div>
  );
};

export default UsageTab;
