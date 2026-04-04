import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

import DocumentSummaryCard from "@/components/dashboard/cards/DocumentSummaryCard";
import { Summary } from "@/types/summary";

interface Props {
  documentId: string;
  userId: string;
  summaries: Summary[];
  paginatedSummaries: Summary[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DocumentSummariesTab = ({
  documentId,
  userId,
  summaries,
  paginatedSummaries,
  currentPage,
  totalPages,
  onPageChange,
}: Props) => {
  const router = useRouter();

  if (summaries.length === 0) {
    return (
      <div className="bg-white/8 border border-[#C9A227]/12 rounded-lg p-8 text-center">
        <Sparkles size={36} className="mx-auto mb-3 text-[#C9A227]/40" />
        <p className="text-[14px] text-text/50 font-sans mb-4">
          No summaries generated yet for this document.
        </p>
        <button
          onClick={() => router.push(`/dashboard/summarize?doc=${documentId}`)}
          className="flex items-center gap-2 mx-auto px-6 py-3 bg-[#C9A227] text-[#111111] rounded-sm text-[12px] font-bold tracking-widest font-sans hover:bg-[#e0b530] transition-colors"
        >
          <Sparkles size={13} />
          CREATE SUMMARY
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paginatedSummaries.map((summary, idx) => (
        <DocumentSummaryCard
          key={summary._id}
          userId={userId}
          documentId={documentId}
          summary={summary}
          idx={idx}
        />
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-text/30 font-sans tracking-wider">
            PAGE {currentPage} OF {totalPages}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-sans tracking-widest border border-white/8 rounded-sm transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:border-[#C9A227]/30 hover:text-[#C9A227]"
            >
              <ChevronLeft size={13} />
              PREV
            </button>

            <div className="flex items-center gap-1 mx-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-8 h-8 text-[11px] font-sans rounded-sm transition-all ${
                    p === currentPage
                      ? "bg-[#C9A227] text-[#111111] font-bold"
                      : "text-text/40 hover:text-text/70 border border-white/8 hover:border-[#C9A227]/20"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-sans tracking-widest border border-white/8 rounded-sm transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:border-[#C9A227]/30 hover:text-[#C9A227]"
            >
              NEXT
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}

      <p className="text-[10px] text-text/20 font-sans tracking-widest text-right">
        {summaries.length} TOTAL SUMMAR{summaries.length === 1 ? "Y" : "IES"}
      </p>
    </div>
  );
};

export default DocumentSummariesTab;
