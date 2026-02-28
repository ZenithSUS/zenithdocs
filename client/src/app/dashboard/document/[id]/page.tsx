"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import CursorGlow from "@/components/CursorGlow";
import useAuth from "@/features/auth/useAuth";
import useDocument from "@/features/documents/useDocument";
import useSummary from "@/features/summary/useSummary";
import FileIcon from "@/components/FileIcon";
import sizefmt from "@/helpers/size-format";
import STATUS_META from "@/constants/status-meta";
import {
  ArrowLeft,
  Download,
  Sparkles,
  FileText,
  AlignLeft,
  List,
  Star,
  Layers,
  ChevronLeft,
  ChevronRight,
  Coins,
  CalendarDays,
  Tag,
  Folder,
  Clock,
  HardDrive,
  FileType,
  ScrollText,
} from "lucide-react";

// Map summary types to lucide icons
const SUMMARY_ICONS: Record<string, React.ReactNode> = {
  brief: <AlignLeft size={15} />,
  detailed: <FileText size={15} />,
  bullets: <List size={15} />,
  highlights: <Star size={15} />,
  default: <Layers size={15} />,
};

const SUMMARIES_PER_PAGE = 3;

export default function DocumentViewPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params?.id as string;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<"details" | "summaries">(
    "details",
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { me } = useAuth();
  const { data: user } = me;

  const { documentById } = useDocument(user?._id || "", documentId);
  const { data: document, isLoading: docLoading } = documentById;

  const { summariesByDocumentPage } = useSummary(user?._id || "", documentId);
  const { data: summariesData } = summariesByDocumentPage;

  const allSummaries =
    summariesData?.pages.flatMap((page) => page.summaries) ?? [];

  const documentSummaries = allSummaries.filter((s) => {
    const summaryDocId =
      s.document && typeof s.document === "object"
        ? s.document._id
        : typeof s.document === "string"
          ? s.document
          : null;
    return summaryDocId === documentId;
  });

  // Pagination derived state
  const totalPages = Math.max(
    1,
    Math.ceil(documentSummaries.length / SUMMARIES_PER_PAGE),
  );
  const paginatedSummaries = documentSummaries.slice(
    (currentPage - 1) * SUMMARIES_PER_PAGE,
    currentPage * SUMMARIES_PER_PAGE,
  );

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (docLoading) {
    return (
      <div className="min-h-screen bg-[#111111] text-[#F5F5F5] font-serif">
        <CursorGlow mousePos={mousePos} />
        <header className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 md:px-12 py-5 bg-[#111111]/92 backdrop-blur-xl border-b border-[#C9A227]/12">
          <div className="flex items-center gap-4 max-w-7xl mx-auto">
            <div className="w-20 h-5 bg-white/6 rounded animate-pulse" />
            <div className="h-5 w-px bg-[#F5F5F5]/10" />
            <div className="w-48 h-6 bg-white/6 rounded animate-pulse" />
          </div>
        </header>
        <main className="pt-24 pb-12 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="h-32 bg-white/6 rounded-lg animate-pulse" />
            <div className="h-96 bg-white/6 rounded-lg animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!document) {
    return (
      <div className="min-h-screen bg-[#111111] text-[#F5F5F5] font-serif flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="text-xl font-normal mb-2">Document not found</h2>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-6 py-2.5 bg-primary text-background text-[12px] font-bold tracking-widest font-sans rounded-sm hover:bg-[#e0b530] transition-colors"
          >
            BACK TO DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  const folder = typeof document.folder === "object" ? document.folder : null;
  const statusMeta = STATUS_META[document.status];

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F5F5] font-serif">
      <CursorGlow mousePos={mousePos} />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 md:px-12 py-5 bg-[#111111]/92 backdrop-blur-xl border-b border-[#C9A227]/12">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-[#F5F5F5]/60 hover:text-[#C9A227] transition-colors duration-200 flex items-center gap-2 text-sm tracking-widest font-sans"
            >
              <ArrowLeft size={14} />
              BACK
            </button>
            <div className="h-5 w-px bg-[#F5F5F5]/10" />
            <h1 className="text-lg font-bold tracking-[0.08em] font-serif">
              DOCUMENT <span className="text-[#C9A227]">VIEW</span>
            </h1>
          </div>

          <button
            onClick={() =>
              router.push(`/dashboard/summarize?doc=${documentId}`)
            }
            className="hidden sm:flex items-center gap-2 px-5 py-2 bg-[#C9A227] text-[#111111] rounded-sm text-[12px] font-bold tracking-widest font-sans transition-all duration-200 hover:bg-[#e0b530] hover:-translate-y-0.5"
          >
            <Sparkles size={13} />
            SUMMARIZE
          </button>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="pt-24 pb-12 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
        {/* Document header card */}
        <div className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/18 rounded-lg p-6 sm:p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">
              <FileIcon type={document.fileType} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-normal mb-2 wrap-break-word">
                {document.title}
              </h2>
              <div className="flex flex-wrap gap-3 text-[12px] text-[#F5F5F5]/40 font-sans">
                {folder && (
                  <span className="flex items-center gap-1.5">
                    <Folder size={11} className="text-[#C9A227]" />
                    {folder.name}
                  </span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <HardDrive size={11} />
                  {sizefmt.bytes(document.fileSize)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={11} />
                  {sizefmt.date(document.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Status and actions */}
          <div className="flex flex-wrap gap-3 items-center pt-4 border-t border-white/8">
            <div
              className={`flex items-center gap-2 text-[12px] font-sans ${statusMeta.text}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${statusMeta.dot} ${document.status === "processing" ? "animate-pulse" : ""}`}
              />
              {statusMeta.label}
            </div>

            <div className="flex gap-2 ml-auto">
              {document.fileUrl && (
                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 text-[#F5F5F5]/70 rounded-sm text-[11px] tracking-widest font-sans hover:bg-white/8 transition-colors"
                >
                  <Download size={12} />
                  DOWNLOAD
                </a>
              )}
              <button
                onClick={() =>
                  router.push(`/dashboard/summarize?doc=${documentId}`)
                }
                className="flex items-center gap-1.5 px-4 py-2 bg-[#C9A227] text-[#111111] rounded-sm text-[11px] font-bold tracking-widest font-sans hover:bg-[#e0b530] transition-colors"
              >
                <Sparkles size={12} />
                SUMMARIZE
              </button>
            </div>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────────── */}
        <div className="mb-6 flex gap-1 p-1 bg-white/4 border border-white/8 rounded-sm w-fit">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex items-center gap-2 px-4 py-2 text-[11px] tracking-widest font-sans rounded-sm transition-all ${
              activeTab === "details"
                ? "bg-primary text-background font-bold"
                : "text-text/50 hover:text-text/70"
            }`}
          >
            <ScrollText size={12} />
            DETAILS
          </button>
          <button
            onClick={() => setActiveTab("summaries")}
            className={`flex items-center gap-2 px-4 py-2 text-[11px] tracking-widest font-sans rounded-sm transition-all ${
              activeTab === "summaries"
                ? "bg-primary text-background font-bold"
                : "text-text/50 hover:text-text/70"
            }`}
          >
            <Layers size={12} />
            SUMMARIES ({documentSummaries.length})
          </button>
        </div>

        {/* ── Details tab ───────────────────────────────────────────────────── */}
        {activeTab === "details" && (
          <div className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/12 rounded-lg p-6 sm:p-8">
            <h3 className="text-[11px] tracking-[0.15em] text-[#C9A227] mb-6 font-sans flex items-center gap-2">
              <FileText size={13} />
              DOCUMENT INFORMATION
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-text/30 font-sans mb-1">
                    <FileType size={10} /> FILE TYPE
                  </div>
                  <div className="text-[14px] text-text/70 font-sans">
                    {document.fileType}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-text/30 font-sans mb-1">
                    <HardDrive size={10} /> FILE SIZE
                  </div>
                  <div className="text-[14px] text-text/70 font-sans">
                    {sizefmt.bytes(document.fileSize)}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-text/30 font-sans mb-1">
                    <Tag size={10} /> STATUS
                  </div>
                  <div className={`text-[14px] font-sans ${statusMeta.text}`}>
                    {statusMeta.label}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/8">
                <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-text/30 font-sans mb-1">
                  <Folder size={10} /> FOLDER
                </div>
                <div className="text-[14px] text-text/70 font-sans">
                  {folder?.name || "No folder"}
                </div>
              </div>

              <div className="pt-4 border-t border-white/8">
                <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-text/30 font-sans mb-1">
                  <Clock size={10} /> UPLOADED
                </div>
                <div className="text-[14px] text-text/70 font-sans">
                  {new Date(document.createdAt).toLocaleString("en-US", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </div>
              </div>

              {document.rawText && (
                <div className="pt-4 border-t border-white/8">
                  <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-text/30 font-sans mb-3">
                    <AlignLeft size={10} /> EXTRACTED TEXT
                  </div>
                  <div className="text-[13px] text-text/60 font-sans leading-[1.8] whitespace-pre-wrap max-h-96 overflow-y-auto p-4 bg-black/20 rounded border border-white/6">
                    {document.rawText}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Summaries tab ─────────────────────────────────────────────────── */}
        {activeTab === "summaries" && (
          <div className="space-y-4">
            {documentSummaries.length === 0 ? (
              <div className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/12 rounded-lg p-8 text-center">
                <Sparkles
                  size={36}
                  className="mx-auto mb-3 text-[#C9A227]/40"
                />
                <p className="text-[14px] text-text/50 font-sans mb-4">
                  No summaries generated yet for this document.
                </p>
                <button
                  onClick={() =>
                    router.push(`/dashboard/summarize?doc=${documentId}`)
                  }
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-[#C9A227] text-[#111111] rounded-sm text-[12px] font-bold tracking-widest font-sans hover:bg-[#e0b530] transition-colors"
                >
                  <Sparkles size={13} />
                  CREATE SUMMARY
                </button>
              </div>
            ) : (
              <>
                {/* Summary cards */}
                {paginatedSummaries.map((summary, idx) => (
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
                    <div className="mt-4 pt-3 border-t border-white/6 flex items-center gap-1.5 text-[11px] text-text/30 font-sans">
                      <CalendarDays size={10} />
                      Created {sizefmt.date(summary.createdAt)}
                    </div>
                  </div>
                ))}

                {/* ── Pagination controls ────────────────────────────────────── */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    {/* Page info */}
                    <span className="text-[11px] text-text/30 font-sans tracking-wider">
                      PAGE {currentPage} OF {totalPages}
                    </span>

                    {/* Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-sans tracking-widest border border-white/8 rounded-sm transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:border-[#C9A227]/30 hover:text-[#C9A227]"
                      >
                        <ChevronLeft size={13} />
                        PREV
                      </button>

                      {/* Page number pills */}
                      <div className="flex items-center gap-1 mx-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((p) => (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
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
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
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

                {/* Results count */}
                <p className="text-[10px] text-text/20 font-sans tracking-widest text-right">
                  {documentSummaries.length} TOTAL SUMMAR
                  {documentSummaries.length === 1 ? "Y" : "IES"}
                </p>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
