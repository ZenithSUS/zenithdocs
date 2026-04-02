import { AlertTriangle, Building2, ChevronRight } from "lucide-react";
import { Summary } from "@/types/summary";
import { SUMMARY_ICONS } from "@/constants/summary-icons";

interface Props {
  summary: Summary;
}

const SummaryContents = ({ summary }: Props) => {
  const ad = summary.additionalDetails;
  const hasRisk = ad?.risk && ad.risk !== "No significant risk identified";
  const hasAction = ad?.action && ad.action !== "No immediate action required";
  const hasEntities = ad?.entity && ad.entity.length > 0;
  const hasAnyDetails = hasRisk || hasAction || hasEntities;

  return (
    <div className="px-4 py-4 bg-primary/5 border border-primary/12 rounded-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-primary text-[13px]">
          {SUMMARY_ICONS[summary.type]}
        </span>
        <span className="text-[10px] tracking-[0.12em] text-primary font-sans">
          {summary.type.toUpperCase()} SUMMARY
        </span>
        <span className="ml-auto text-[10px] text-text/25 font-sans">
          {summary.tokensUsed} tokens
        </span>
      </div>

      {/* Content */}
      <p className="text-[13px] text-text/65 font-sans leading-[1.7] whitespace-pre-line">
        {summary.content}
      </p>

      {/* Additional details */}
      {hasAnyDetails && (
        <div className="mt-3 rounded border border-white/6 bg-white/[0.018] overflow-hidden">
          {hasRisk && (
            <div
              className={`flex items-start gap-3 px-3 py-2.5 ${hasAction || hasEntities ? "border-b border-white/5" : ""}`}
            >
              <div className="flex items-center gap-1 w-14.5 shrink-0 pt-px">
                <AlertTriangle
                  size={9}
                  className="text-amber-400/65 shrink-0"
                />
                <span className="text-[8.5px] tracking-widest font-bold text-amber-400/65 font-sans uppercase">
                  Risk
                </span>
              </div>
              <p className="text-[11.5px] text-text/50 font-sans leading-relaxed">
                {ad!.risk}
              </p>
            </div>
          )}
          {hasAction && (
            <div
              className={`flex items-start gap-3 px-3 py-2.5 ${hasEntities ? "border-b border-white/5" : ""}`}
            >
              <div className="flex items-center gap-1 w-14.5 shrink-0 pt-px">
                <ChevronRight
                  size={9}
                  className="text-emerald-400/65 shrink-0"
                />
                <span className="text-[8.5px] tracking-widest font-bold text-emerald-400/65 font-sans uppercase">
                  Action
                </span>
              </div>
              <p className="text-[11.5px] text-text/50 font-sans leading-relaxed">
                {ad!.action}
              </p>
            </div>
          )}
          {hasEntities && (
            <div className="flex items-start gap-3 px-3 py-2.5">
              <div className="flex items-center gap-1 w-14.5 shrink-0 pt-0.75">
                <Building2 size={9} className="text-sky-400/65 shrink-0" />
                <span className="text-[8.5px] tracking-widest font-bold text-sky-400/65 font-sans uppercase">
                  Entity
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {ad!.entity.slice(0, 4).map((e, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-px rounded-sm text-[10px] text-text/45 font-sans bg-white/4 border border-white/7"
                  >
                    {e}
                  </span>
                ))}
                {ad!.entity.length > 4 && (
                  <span className="px-1.5 py-px text-[10px] text-text/30 font-sans">
                    +{ad!.entity.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryContents;
