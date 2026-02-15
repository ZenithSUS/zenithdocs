import STATUS_META from "@/constants/status-meta";
import sizefmt from "@/helpers/size-format";
import Doc from "@/types/doc";
import { Folder } from "@/types/folder";
import { Summary, SummaryType } from "@/types/summary";
import FileIcon from "@/components/FileIcon";
import { Usage } from "@/types/usage";
import { SUMMARY_ICONS } from "./Summary";
import { NavItem } from "@/components/dashboard/Sidebar";

interface OverViewProps {
  setNav: React.Dispatch<React.SetStateAction<NavItem>>;
  setSelectedDoc: React.Dispatch<React.SetStateAction<Doc | null>>;
  currentMonth: string;
  completedDocs: number;
  documents: Doc[];
  folders: Folder[];
  summaries: Summary[];
  usage: Usage[];
  tokenPct: number;
  currentTokensUsed: number;
  maxUsage: number;
}

function OverViewDashboard({
  setNav,
  setSelectedDoc,
  currentMonth,
  completedDocs,
  documents,
  folders,
  usage,
  summaries,
  tokenPct,
  currentTokensUsed,
  maxUsage,
}: OverViewProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            icon: "▣",
            label: "Total Documents",
            value: documents.length,
            sub: `${completedDocs} completed`,
          },
          {
            icon: "◎",
            label: "Summaries",
            value: summaries.length,
            sub: "4 summary types",
          },
          {
            icon: "⬡",
            label: "Folders",
            value: folders.length,
            sub: "Organised workspace",
          },
          {
            icon: "◉",
            label: "Tokens This Month",
            value: sizefmt.num(currentTokensUsed),
            sub: `${tokenPct}% of limit`,
          },
        ].map((s, i) => (
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
            <div className="text-[26px] sm:text-[28px] font-light text-text font-serif tracking-[-0.02em]">
              {s.value}
            </div>
            <div className="text-[10px] text-text/35 font-sans tracking-[0.06em] mt-0.5">
              {s.label.toUpperCase()}
            </div>
            <div className="text-[11px] text-text/25 font-sans mt-2">
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Recent docs + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
        {/* Recent documents */}
        <div className="xl:col-span-3 border border-white/8 rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-white/6 flex items-center justify-between">
            <span className="text-[11px] tracking-[0.15em] text-text/50 font-sans">
              RECENT DOCUMENTS
            </span>
            <button
              onClick={() => setNav("documents")}
              className="text-[11px] text-primary/70 font-sans hover:text-primary transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-white/4">
            {documents.slice(0, 5).map((doc) => {
              const sm = STATUS_META[doc.status];
              const folder = folders.find((f) => f._id === doc.folder);
              return (
                <div
                  key={doc._id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setNav("documents");
                  }}
                  className="px-5 py-3.5 flex items-center gap-3 hover:bg-white/3 cursor-pointer transition-colors duration-150"
                >
                  <FileIcon type={doc.fileType} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-sans text-text/80 truncate">
                      {doc.title}
                    </div>
                    <div className="text-[11px] text-text/30 font-sans mt-0.5">
                      {folder?.name ?? "No folder"} ·{" "}
                      {sizefmt.bytes(doc.fileSize)}
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-[10px] font-sans ${sm.text} shrink-0`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${sm.dot} ${doc.status === "processing" ? "animate-pulse" : ""}`}
                    />
                    <span className="hidden sm:inline">{sm.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mini usage chart */}
        <div className="xl:col-span-2 border border-white/8 rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-white/6">
            <span className="text-[11px] tracking-[0.15em] text-text/50 font-sans">
              TOKEN USAGE — 6 MONTHS
            </span>
          </div>
          <div className="px-5 py-5 flex flex-col gap-3">
            {usage.map((u) => (
              <div key={u.month} className="flex items-center gap-3">
                <span className="text-[11px] text-text/30 font-sans w-8 shrink-0">
                  {sizefmt.month(u.month)}
                </span>
                <div className="flex-1 h-1.5 bg-white/6 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(u.tokensUsed / maxUsage) * 100}%`,
                      background:
                        u.month === currentMonth
                          ? "#C9A227"
                          : "rgba(201,162,39,0.35)",
                    }}
                  />
                </div>
                <span className="text-[11px] text-text/30 font-sans w-10 text-right shrink-0">
                  {sizefmt.num(u.tokensUsed)}
                </span>
              </div>
            ))}
          </div>

          {/* Summary type breakdown */}
          <div className="px-5 pb-5">
            <div className="border-t border-white/6 pt-4">
              <div className="text-[10px] tracking-[0.15em] text-text/30 font-sans mb-3">
                SUMMARY TYPES
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(
                  ["short", "bullet", "detailed", "executive"] as SummaryType[]
                ).map((t) => {
                  const count = summaries.filter((s) => s.type === t).length;
                  return (
                    <div
                      key={t}
                      className="flex items-center gap-2 text-[11px] font-sans"
                    >
                      <span className="text-primary text-[13px]">
                        {SUMMARY_ICONS[t]}
                      </span>
                      <span className="text-text/45 capitalize">{t}</span>
                      <span className="ml-auto text-text/25">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest summaries preview */}
      <div className="border border-white/8 rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6 flex items-center justify-between">
          <span className="text-[11px] tracking-[0.15em] text-text/50 font-sans">
            LATEST SUMMARIES
          </span>
          <button
            onClick={() => setNav("summaries")}
            className="text-[11px] text-primary/70 font-sans hover:text-primary transition-colors"
          >
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/6">
          {summaries.slice(0, 2).map((s) => {
            const doc = documents.find((d) => d._id === s.document);
            return (
              <div key={s._id} className="px-5 py-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-primary text-[14px]">
                    {SUMMARY_ICONS[s.type]}
                  </span>
                  <span className="text-[10px] tracking-[0.12em] text-primary font-sans">
                    {s.type.toUpperCase()}
                  </span>
                  <span className="ml-auto text-[10px] text-text/25 font-sans">
                    {s.tokensUsed} tokens
                  </span>
                </div>
                <div className="text-[11px] text-text/35 font-sans mb-2 truncate">
                  {doc?.title}
                </div>
                <p className="text-[13px] text-text/60 font-sans leading-[1.65] line-clamp-3">
                  {s.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default OverViewDashboard;
