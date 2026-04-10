import sizefmt from "@/helpers/size-format";
import { Summary } from "@/types/summary";
import {
  AlertTriangle,
  AlignLeft,
  CalendarDays,
  Coins,
  FileText,
  Layers,
  List,
  Star,
  Zap,
  Building2,
} from "lucide-react";
import DeleteSummaryModal from "../modals/summary/DeleteSummaryModal";

// Map summary types to lucide icons
const SUMMARY_ICONS: Record<string, React.ReactNode> = {
  brief: <AlignLeft size={15} />,
  detailed: <FileText size={15} />,
  bullets: <List size={15} />,
  highlights: <Star size={15} />,
  default: <Layers size={15} />,
};

interface DocumentSummaryCardProps {
  idx: number;
  userId: string;
  summary: Summary;
  documentId: string;
}

function DocumentSummaryCard({
  idx,
  userId,
  summary,
  documentId,
}: DocumentSummaryCardProps) {
  const { additionalDetails } = summary;

  const hasRisk =
    additionalDetails?.risk &&
    additionalDetails.risk !== "No significant risk identified";

  const hasAction =
    additionalDetails?.action &&
    additionalDetails.action !== "No immediate action required";

  const hasEntities =
    additionalDetails?.entity && additionalDetails.entity.length > 0;

  const hasAnyDetails = hasRisk || hasAction || hasEntities;

  return (
    <div
      key={summary._id}
      className="bg-white/8 border border-[#C9A227]/12 rounded-lg p-6 transition-all duration-200 hover:border-[#C9A227]/25"
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      {/* Summary header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/8">
        <span className="text-[#C9A227]">
          {SUMMARY_ICONS[summary.type] ?? SUMMARY_ICONS.default}
        </span>
        <span className="text-[11px] tracking-widest text-[#C9A227] font-sans">
          {summary.type.toUpperCase()} SUMMARY
        </span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-text/25 font-sans">
          <Coins size={10} />
          {summary.tokensUsed} tokens
        </span>
      </div>

      {/* Content */}
      <p className="text-[14px] text-text/70 font-sans leading-[1.8] whitespace-pre-line">
        {summary.content}
      </p>

      {/* Additional Details */}
      {hasAnyDetails && (
        <div className="mt-5 rounded-md border border-white/6 bg-white/2 overflow-hidden">
          {/* Risk row */}
          {hasRisk && (
            <div className="flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-b-0">
              <div className="flex items-center gap-1.5 min-w-16 pt-px">
                <AlertTriangle
                  size={11}
                  className="text-amber-400/80 shrink-0"
                />
                <span className="text-[10px] tracking-widest font-semibold text-amber-400/80 font-sans uppercase">
                  Risk
                </span>
              </div>
              <p className="text-[12.5px] text-text/60 font-sans leading-relaxed">
                {additionalDetails.risk}
              </p>
            </div>
          )}

          {/* Action row */}
          {hasAction && (
            <div className="flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-b-0">
              <div className="flex items-center gap-1.5 min-w-16 pt-px">
                <Zap size={11} className="text-emerald-400/80 shrink-0" />
                <span className="text-[10px] tracking-widest font-semibold text-emerald-400/80 font-sans uppercase">
                  Action
                </span>
              </div>
              <p className="text-[12.5px] text-text/60 font-sans leading-relaxed">
                {additionalDetails.action}
              </p>
            </div>
          )}

          {/* Entity row */}
          {hasEntities && (
            <div className="flex items-start gap-3 px-4 py-3">
              <div className="flex items-center gap-1.5 min-w-16 pt-0.5">
                <Building2 size={11} className="text-sky-400/80 shrink-0" />
                <span className="text-[10px] tracking-widest font-semibold text-sky-400/80 font-sans uppercase">
                  Entity
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {additionalDetails.entity.map((e, i) => (
                  <span
                    key={i}
                    className="inline-block px-2 py-0.5 rounded text-[11px] text-text/55 font-sans bg-white/5 border border-white/8"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-[11px] text-text/30 font-sans">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <CalendarDays size={10} />
            Created {sizefmt.date(summary.createdAt)}
          </div>

          <div className="font-semibold text-primary">
            {summary.content.split(" ").length} words
          </div>
        </div>

        <DeleteSummaryModal
          userId={userId}
          summaryId={summary._id}
          documentId={documentId}
        />
      </div>
    </div>
  );
}

export default DocumentSummaryCard;
