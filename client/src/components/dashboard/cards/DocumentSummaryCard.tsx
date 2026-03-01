import sizefmt from "@/helpers/size-format";
import { Summary } from "@/types/summary";
import {
  AlignLeft,
  CalendarDays,
  Coins,
  FileText,
  Layers,
  List,
  Star,
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
  return (
    <div
      key={summary._id}
      className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/12 rounded-lg p-6 transition-all duration-200 hover:border-[#C9A227]/25"
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

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-[11px] text-text/30 font-sans">
        <div className="flex items-center gap-2">
          <CalendarDays size={10} />
          Created {sizefmt.date(summary.createdAt)}
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
