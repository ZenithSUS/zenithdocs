import sizefmt from "@/helpers/size-format";
import { DashboardOverview } from "@/types/dashboard";
import { ThreeDot } from "react-loading-indicators";

interface Props {
  overview: DashboardOverview | undefined;
  overviewLoading: boolean;
  completedDocs: number;
  tokenPct: number;
  currentTokensUsed: number;
  maxUsage: number;
}

const StatCards = ({
  overview,
  overviewLoading,
  completedDocs,
  tokenPct,
  currentTokensUsed,
  maxUsage,
}: Props) => {
  const tokensUsed = Math.min(maxUsage, currentTokensUsed);

  const stats = [
    {
      icon: "▣",
      label: "Total Documents",
      value: overview?.totalDocuments ?? 0,
      sub: `${completedDocs} completed`,
    },
    {
      icon: "◎",
      label: "Summaries",
      value: overview?.totalSummary ?? 0,
      sub: "4 summary types",
    },
    {
      icon: "⬡",
      label: "Folders",
      value: overview?.totalFolders ?? 0,
      sub: "Organised workspace",
    },
    {
      icon: "◉",
      label: "Tokens This Month",
      value: sizefmt.num(tokensUsed),
      sub: `${tokenPct}% of limit`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="px-5 py-5 border border-white/8 rounded-sm bg-white/2 hover:border-primary/20 hover:bg-primary/3 transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-[18px] text-primary">{s.icon}</span>
            <span className="text-[10px] text-text/20 font-sans tracking-wider">
              #{String(i + 1).padStart(2, "0")}
            </span>
          </div>

          {overviewLoading ? (
            <ThreeDot color="#c9a227" size="small" text="" textColor="" />
          ) : (
            <div className="text-[26px] sm:text-[28px] font-light text-text font-serif tracking-[-0.02em]">
              {s.value}
            </div>
          )}

          <div className="text-[10px] text-text/35 font-sans tracking-[0.06em] mt-0.5">
            {s.label.toUpperCase()}
          </div>
          <div className="text-[11px] text-text/25 font-sans mt-2">{s.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
