import { DashboardOverview } from "@/types/dashboard";
import { SummaryType } from "@/types/summary";
import { SUMMARY_ICONS } from "../summaryIcons";

interface Props {
  overview: DashboardOverview | undefined;
  onViewAll: () => void;
}

const LatestSummaries = ({ overview, onViewAll }: Props) => (
  <div className="border border-white/8 rounded-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-white/6 flex items-center justify-between">
      <span className="text-[11px] tracking-[0.15em] text-text/50 font-sans">
        LATEST SUMMARIES
      </span>
      <button
        onClick={onViewAll}
        className="text-[11px] text-primary/70 font-sans hover:text-primary transition-colors"
      >
        View all →
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/6">
      {overview?.recentSummary.map((s) => {
        const doc = overview.recentDocuments.find((d) => d._id === s.document);

        return (
          <div key={s._id} className="px-5 py-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary text-[14px]">
                {SUMMARY_ICONS[s.type as SummaryType]}
              </span>
              <span className="text-[10px] tracking-[0.12em] text-primary font-sans">
                {s.type.toUpperCase()}
              </span>
              <span className="ml-auto text-[10px] text-text/25 font-sans">
                {s.tokensUsed} tokens
              </span>
            </div>
            <div className="text-[11px] text-text/35 font-sans mb-2 truncate">
              {doc?.title ?? "Unknown document"}
            </div>
            <p className="text-[13px] text-text/60 font-sans leading-[1.65] line-clamp-3">
              {s.content}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);

export default LatestSummaries;
