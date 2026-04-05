"use client";

import { NavItem } from "@/components/dashboard/Sidebar";
import { DashboardOverview } from "@/types/dashboard";

import StatCards from "./components/StatCards";
import RecentDocuments from "./components/RecentDocuments";
import TokenUsagePanel from "./components/TokenUsagePanel";
import LatestSummaries from "./components/LatestSummaries";

interface Props {
  setNav: React.Dispatch<React.SetStateAction<NavItem>>;
  currentMonth: string;
  completedDocs: number;
  tokenPct: number;
  currentTokensUsed: number;
  maxUsage: number;
  overview: DashboardOverview | undefined;
  overviewLoading: boolean;
}

const OverviewTab = ({
  setNav,
  currentMonth,
  completedDocs,
  tokenPct,
  currentTokensUsed,
  maxUsage,
  overview,
  overviewLoading,
}: Props) => (
  <div className="space-y-6 sm:space-y-8">
    <StatCards
      overview={overview}
      overviewLoading={overviewLoading}
      completedDocs={completedDocs}
      tokenPct={tokenPct}
      currentTokensUsed={currentTokensUsed}
      maxUsage={maxUsage}
    />

    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
      <RecentDocuments
        recentDocuments={overview?.recentDocuments ?? []}
        overviewLoading={overviewLoading}
        onViewAll={() => setNav("documents")}
      />
      <TokenUsagePanel
        overview={overview}
        overviewLoading={overviewLoading}
        currentMonth={currentMonth}
        maxUsage={maxUsage}
      />
    </div>

    <LatestSummaries
      overview={overview}
      onViewAll={() => setNav("summaries")}
    />
  </div>
);

export default OverviewTab;
