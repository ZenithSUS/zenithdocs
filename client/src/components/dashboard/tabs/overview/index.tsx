"use client";

import { NavItem } from "@/components/dashboard/Sidebar";
import { DashboardOverview } from "@/types/dashboard";

import StatCards from "./components/StatCards";
import RecentDocuments from "./components/RecentDocuments";
import LatestSummaries from "./components/LatestSummaries";
import AIActivity from "./components/AIActivity";

interface Props {
  setNav: React.Dispatch<React.SetStateAction<NavItem>>;
  completedDocs: number;
  overview: DashboardOverview | undefined;
  overviewLoading: boolean;
  messsagesPerDay: number;
}

const OverviewTab = ({
  setNav,
  completedDocs,
  overview,
  overviewLoading,
  messsagesPerDay,
}: Props) => (
  <div className="space-y-6 sm:space-y-8">
    <StatCards
      overview={overview}
      overviewLoading={overviewLoading}
      completedDocs={completedDocs}
    />

    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
      <RecentDocuments
        recentDocuments={overview?.recentDocuments ?? []}
        overviewLoading={overviewLoading}
        onViewAll={() => setNav("documents")}
      />

      <AIActivity overview={overview} messagesPerDay={messsagesPerDay} />
    </div>

    <LatestSummaries
      overview={overview}
      onViewAll={() => setNav("summaries")}
    />
  </div>
);

export default OverviewTab;
