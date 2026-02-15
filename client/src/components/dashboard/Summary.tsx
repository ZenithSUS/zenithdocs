import Doc from "@/types/doc";
import { Summary, SummaryType } from "@/types/summary";
import FileIcon from "@/components/FileIcon";
import sizefmt from "@/helpers/size-format";

interface SummaryProps {
  summaries: Summary[];
  documents: Doc[];
}

export const SUMMARY_ICONS: Record<SummaryType, string> = {
  short: "◎",
  bullet: "◆",
  detailed: "▣",
  executive: "◈",
};

function SummaryDashboard({ summaries, documents }: SummaryProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summaries.map((s) => {
          const doc = documents.find((d) => d._id === s.document);
          return (
            <div
              key={s._id}
              className="border border-white/8 rounded-sm overflow-hidden hover:border-primary/20 transition-colors duration-200"
            >
              <div className="px-5 py-3.5 border-b border-white/6 bg-white/2 flex items-center gap-2">
                <span className="text-primary text-[15px]">
                  {SUMMARY_ICONS[s.type]}
                </span>
                <span className="text-[10px] tracking-[0.12em] text-primary font-sans">
                  {s.type.toUpperCase()}
                </span>
                <div className="ml-auto flex items-center gap-3">
                  <span className="text-[10px] text-text/25 font-sans">
                    {s.tokensUsed} tokens
                  </span>
                  <span className="text-[10px] text-text/20 font-sans">
                    {sizefmt.date(s.createdAt)}
                  </span>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="text-[11px] text-text/30 font-sans mb-3 flex items-center gap-2">
                  {doc && <FileIcon type={doc.fileType} />}
                  <span className="truncate">
                    {doc?.title ?? "Unknown document"}
                  </span>
                </div>
                <p className="text-[13px] text-text/65 font-sans leading-[1.7] whitespace-pre-line">
                  {s.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty states for unused summary types */}
      {(["short", "bullet", "detailed", "executive"] as SummaryType[])
        .filter((t) => !summaries.find((s) => s.type === t))
        .map((t) => (
          <div
            key={t}
            className="border border-white/5 border-dashed rounded-sm px-5 py-8 text-center"
          >
            <div className="text-[24px] text-text/10 mb-2">
              {SUMMARY_ICONS[t]}
            </div>
            <div className="text-[11px] text-text/20 font-sans tracking-wider capitalize">
              No {t} summaries yet
            </div>
          </div>
        ))}
    </div>
  );
}

export default SummaryDashboard;
