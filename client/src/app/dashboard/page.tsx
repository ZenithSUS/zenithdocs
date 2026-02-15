"use client";

import CursorGlow from "@/components/CursorGlow";
import FolderDashBoard from "@/components/dashboard/Folders";
import DashboardHeader from "@/components/dashboard/Header";
import OverViewDashboard from "@/components/dashboard/Overview";
import DashBoardSidebar, { NavItem } from "@/components/dashboard/Sidebar";
import SummaryDashboard, {
  SUMMARY_ICONS,
} from "@/components/dashboard/Summary";
import UsageDashboard from "@/components/dashboard/Usage";
import FileIcon from "@/components/FileIcon";
import STATUS_META from "@/constants/status-meta";
import sizefmt from "@/helpers/size-format";
import DOCUMENTS from "@/seeds/document";
import FOLDERS from "@/seeds/folder";
import SUMMARIES from "@/seeds/summary";
import USAGE from "@/seeds/usage";
import Doc, { DocStatus } from "@/types/doc";
import { Folder } from "@/types/folder";
import { useState, useEffect, useRef } from "react";

const TOKEN_LIMIT = 10000;
const CURRENT_TOKENS_USED = 3890;
const CURRENT_MONTH = "2026-02";

export default function DashboardPage() {
  const [nav, setNav] = useState<NavItem>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [filterStatus, setFilterStatus] = useState<DocStatus | "all">("all");
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // Animate main content on nav change
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.classList.remove("content-in");
    const frame = requestAnimationFrame(() => {
      el.classList.add("content-in");
    });
    return () => cancelAnimationFrame(frame);
  }, [nav]);

  const filteredDocs = DOCUMENTS.filter(
    (d) =>
      (filterStatus === "all" || d.status === filterStatus) &&
      (filterFolder === "all" || d.folder === filterFolder),
  );

  const completedDocs = DOCUMENTS.filter(
    (d) => d.status === "completed",
  ).length;
  const processingDocs = DOCUMENTS.filter(
    (d) => d.status === "processing",
  ).length;
  const tokenPct = Math.round((CURRENT_TOKENS_USED / TOKEN_LIMIT) * 100);
  const maxUsage = Math.max(...USAGE.map((u) => u.tokensUsed));

  return (
    <div className="min-h-screen bg-background text-text font-serif flex overflow-hidden">
      {/* Ambient cursor glow */}
      <CursorGlow mousePos={mousePos} />

      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <DashBoardSidebar
        nav={nav}
        setNav={setNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        tokenPct={tokenPct}
        processingDocs={processingDocs}
        tokensUsed={CURRENT_TOKENS_USED}
        tokenLimit={TOKEN_LIMIT}
      />

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <DashboardHeader
          nav={nav}
          setSidebarOpen={setSidebarOpen}
          documents={filteredDocs}
          summaries={SUMMARIES}
          folders={FOLDERS}
        />

        {/* Page content */}
        <main
          ref={mainRef}
          className="content-enter flex-1 overflow-y-auto px-5 sm:px-8 py-6 sm:py-8"
        >
          {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
          {nav === "overview" && (
            <OverViewDashboard
              setNav={setNav}
              setSelectedDoc={setSelectedDoc}
              currentMonth={CURRENT_MONTH}
              completedDocs={completedDocs}
              documents={filteredDocs}
              folders={FOLDERS}
              summaries={SUMMARIES}
              usage={USAGE}
              tokenPct={tokenPct}
              currentTokensUsed={CURRENT_TOKENS_USED}
              maxUsage={maxUsage}
            />
          )}

          {/* ══ DOCUMENTS ═════════════════════════════════════════════════════ */}
          {nav === "documents" && (
            <div className="space-y-5">
              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex gap-1 p-1 bg-white/4 border border-white/8 rounded-sm">
                  {(
                    [
                      "all",
                      "uploaded",
                      "processing",
                      "completed",
                      "failed",
                    ] as const
                  ).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-3 py-1.5 text-[10px] tracking-[0.08em] font-sans rounded-sm transition-all duration-150 capitalize ${
                        filterStatus === s
                          ? "bg-primary text-background font-bold"
                          : "text-text/45 hover:text-text/70"
                      }`}
                    >
                      {s === "all" ? "ALL" : STATUS_META[s].label.toUpperCase()}
                    </button>
                  ))}
                </div>
                <select
                  value={filterFolder}
                  onChange={(e) => setFilterFolder(e.target.value)}
                  className="px-3 py-2 bg-white/4 border border-white/8 rounded-sm text-[11px] font-sans text-text/60 outline-none hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <option value="all">All Folders</option>
                  {FOLDERS.map((f: Folder) => (
                    <option key={f._id} value={f._id}>
                      {f.name}
                    </option>
                  ))}
                  <option value="">No Folder</option>
                </select>
                <span className="text-[11px] text-text/25 font-sans ml-auto">
                  {filteredDocs.length} documents
                </span>
              </div>

              {/* Document table */}
              <div className="border border-white/8 rounded-sm overflow-hidden">
                <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/6 bg-white/2">
                  {["TYPE", "DOCUMENT", "SIZE", "STATUS", "DATE"].map((h) => (
                    <span
                      key={h}
                      className="text-[9px] tracking-[0.18em] text-text/25 font-sans"
                    >
                      {h}
                    </span>
                  ))}
                </div>
                <div className="divide-y divide-white/4">
                  {filteredDocs.length === 0 ? (
                    <div className="px-5 py-12 text-center text-text/25 text-[13px] font-sans">
                      No documents match the current filters.
                    </div>
                  ) : (
                    filteredDocs.map((doc) => {
                      const sm = STATUS_META[doc.status];
                      const folder = FOLDERS.find((f) => f._id === doc.folder);
                      const isSelected = selectedDoc?._id === doc._id;
                      return (
                        <div
                          key={doc._id}
                          onClick={() =>
                            setSelectedDoc(isSelected ? null : doc)
                          }
                          className={`grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto_auto] gap-2 sm:gap-4 px-5 py-4 cursor-pointer transition-all duration-150 ${
                            isSelected
                              ? "bg-primary/8 border-l-2 border-l-primary"
                              : "hover:bg-white/3"
                          }`}
                        >
                          <div className="flex items-center gap-3 sm:contents">
                            <FileIcon type={doc.fileType} />
                            <div className="sm:col-start-2 min-w-0">
                              <div className="text-[13px] font-sans text-text/80 truncate">
                                {doc.title}
                              </div>
                              <div className="text-[11px] text-text/30 font-sans mt-0.5 sm:hidden">
                                {folder?.name ?? "No folder"} ·{" "}
                                {sizefmt.bytes(doc.fileSize)}
                              </div>
                              <div className="text-[11px] text-text/30 font-sans mt-0.5 hidden sm:block">
                                {folder?.name ?? "—"}
                              </div>
                            </div>
                            <span className="text-[12px] text-text/35 font-sans hidden sm:block">
                              {sizefmt.bytes(doc.fileSize)}
                            </span>
                            <div
                              className={`flex items-center gap-1.5 text-[11px] font-sans ${sm.text}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${sm.dot} ${doc.status === "processing" ? "animate-pulse" : ""}`}
                              />
                              <span className="hidden sm:inline">
                                {sm.label}
                              </span>
                            </div>
                            <span className="text-[11px] text-text/25 font-sans hidden sm:block">
                              {sizefmt.date(doc.createdAt)}
                            </span>
                          </div>

                          {/* Expanded summary panel */}
                          {isSelected && (
                            <div className="col-span-full mt-3 pt-3 border-t border-primary/10">
                              {(() => {
                                const sum = SUMMARIES.find(
                                  (s) => s.document === doc._id,
                                );
                                return sum ? (
                                  <div className="px-4 py-4 bg-primary/5 border border-primary/12 rounded-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-primary text-[13px]">
                                        {SUMMARY_ICONS[sum.type]}
                                      </span>
                                      <span className="text-[10px] tracking-[0.12em] text-primary font-sans">
                                        {sum.type.toUpperCase()} SUMMARY
                                      </span>
                                      <span className="ml-auto text-[10px] text-text/25 font-sans">
                                        {sum.tokensUsed} tokens
                                      </span>
                                    </div>
                                    <p className="text-[13px] text-text/65 font-sans leading-[1.7] whitespace-pre-line">
                                      {sum.content}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="text-[12px] text-text/30 font-sans flex items-center gap-2">
                                    <span className="text-text/20">◎</span>
                                    {doc.status === "processing"
                                      ? "Processing — summary will appear when complete."
                                      : doc.status === "failed"
                                        ? "Processing failed. Please re-upload the document."
                                        : doc.status === "uploaded"
                                          ? "Document queued. Processing will begin shortly."
                                          : "No summary generated yet."}
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ SUMMARIES ═════════════════════════════════════════════════════ */}
          {nav === "summaries" && (
            <SummaryDashboard summaries={SUMMARIES} documents={DOCUMENTS} />
          )}

          {/* ══ FOLDERS ═══════════════════════════════════════════════════════ */}
          {nav === "folders" && (
            <FolderDashBoard
              setFilterFolder={setFilterFolder}
              setNav={setNav}
              documents={DOCUMENTS}
              folders={FOLDERS}
            />
          )}

          {/* ══ USAGE ═════════════════════════════════════════════════════════ */}
          {nav === "usage" && (
            <UsageDashboard
              usage={USAGE}
              currentMonth={CURRENT_MONTH}
              tokenPct={tokenPct}
              tokenLimit={TOKEN_LIMIT}
              currentTokensUsed={CURRENT_TOKENS_USED}
              maxUsage={maxUsage}
            />
          )}
        </main>
      </div>

      <style>{`
        .content-enter {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .content-enter.content-in {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .animate-pulse { animation: pulse 1.5s ease-in-out infinite; }

        select option { background: #0f1117; color: #d1d5db; }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
