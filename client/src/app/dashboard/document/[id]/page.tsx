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
import { SUMMARY_ICONS } from "@/components/dashboard/tabs/Summary";

export default function DocumentViewPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params?.id as string;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<"details" | "summaries">(
    "details",
  );

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
      typeof s.document === "object"
        ? s.document._id
        : typeof s.document === "string"
          ? s.document
          : null;

    return summaryDocId === documentId;
  });

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

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

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 md:px-12 py-5 bg-[#111111]/92 backdrop-blur-xl border-b border-[#C9A227]/12">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-[#F5F5F5]/60 hover:text-[#C9A227] transition-colors duration-200 flex items-center gap-2 text-sm tracking-widest font-sans"
            >
              ← BACK
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
            className="hidden sm:block px-5 py-2 bg-[#C9A227] text-[#111111] rounded-sm text-[12px] font-bold tracking-widest font-sans transition-all duration-200 hover:bg-[#e0b530] hover:-translate-y-0.5"
          >
            SUMMARIZE →
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
        {/* Document Header Card */}
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
                    <span className="text-[#C9A227]">📁</span>
                    {folder.name}
                  </span>
                )}
                <span>•</span>
                <span>{sizefmt.bytes(document.fileSize)}</span>
                <span>•</span>
                <span>{sizefmt.date(document.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
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
                  className="px-4 py-2 bg-white/5 border border-white/10 text-[#F5F5F5]/70 rounded-sm text-[11px] tracking-widest font-sans hover:bg-white/8 transition-colors"
                >
                  DOWNLOAD
                </a>
              )}
              <button
                onClick={() =>
                  router.push(`/dashboard/summarize?doc=${documentId}`)
                }
                className="px-4 py-2 bg-[#C9A227] text-[#111111] rounded-sm text-[11px] font-bold tracking-widest font-sans hover:bg-[#e0b530] transition-colors"
              >
                SUMMARIZE
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 p-1 bg-white/4 border border-white/8 rounded-sm w-fit">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 text-[11px] tracking-widest font-sans rounded-sm transition-all ${
              activeTab === "details"
                ? "bg-primary text-background font-bold"
                : "text-text/50 hover:text-text/70"
            }`}
          >
            DETAILS
          </button>
          <button
            onClick={() => setActiveTab("summaries")}
            className={`px-4 py-2 text-[11px] tracking-widest font-sans rounded-sm transition-all ${
              activeTab === "summaries"
                ? "bg-primary text-background font-bold"
                : "text-text/50 hover:text-text/70"
            }`}
          >
            SUMMARIES ({documentSummaries.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/12 rounded-lg p-6 sm:p-8">
            <h3 className="text-[11px] tracking-[0.15em] text-[#C9A227] mb-6 font-sans">
              DOCUMENT INFORMATION
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-[10px] tracking-widest text-text/30 font-sans mb-1">
                    FILE TYPE
                  </div>
                  <div className="text-[14px] text-text/70 font-sans">
                    {document.fileType}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] tracking-widest text-text/30 font-sans mb-1">
                    FILE SIZE
                  </div>
                  <div className="text-[14px] text-text/70 font-sans">
                    {sizefmt.bytes(document.fileSize)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] tracking-widest text-text/30 font-sans mb-1">
                    STATUS
                  </div>
                  <div className={`text-[14px] font-sans ${statusMeta.text}`}>
                    {statusMeta.label}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/8">
                <div className="text-[10px] tracking-widest text-text/30 font-sans mb-1">
                  FOLDER
                </div>
                <div className="text-[14px] text-text/70 font-sans">
                  {folder?.name || "No folder"}
                </div>
              </div>

              <div className="pt-4 border-t border-white/8">
                <div className="text-[10px] tracking-widest text-text/30 font-sans mb-1">
                  UPLOADED
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
                  <div className="text-[10px] tracking-widest text-text/30 font-sans mb-3">
                    EXTRACTED TEXT
                  </div>
                  <div className="text-[13px] text-text/60 font-sans leading-[1.8] whitespace-pre-wrap max-h-96 overflow-y-auto p-4 bg-black/20 rounded border border-white/6">
                    {document.rawText}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "summaries" && (
          <div className="space-y-4">
            {documentSummaries.length === 0 ? (
              <div className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/12 rounded-lg p-8 text-center">
                <div className="text-4xl mb-3">✨</div>
                <p className="text-[14px] text-text/50 font-sans mb-4">
                  No summaries generated yet for this document.
                </p>
                <button
                  onClick={() =>
                    router.push(`/dashboard/summarize?doc=${documentId}`)
                  }
                  className="px-6 py-3 bg-[#C9A227] text-[#111111] rounded-sm text-[12px] font-bold tracking-widest font-sans hover:bg-[#e0b530] transition-colors"
                >
                  CREATE SUMMARY
                </button>
              </div>
            ) : (
              documentSummaries.map((summary) => (
                <div
                  key={summary._id}
                  className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/12 rounded-lg p-6"
                >
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/8">
                    <span className="text-[#C9A227] text-lg">
                      {SUMMARY_ICONS[summary.type]}
                    </span>
                    <span className="text-[11px] tracking-widest text-[#C9A227] font-sans">
                      {summary.type.toUpperCase()} SUMMARY
                    </span>
                    <span className="ml-auto text-[10px] text-text/25 font-sans">
                      {summary.tokensUsed} tokens
                    </span>
                  </div>
                  <p className="text-[14px] text-text/70 font-sans leading-[1.8] whitespace-pre-line">
                    {summary.content}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/6 text-[11px] text-text/30 font-sans">
                    Created {sizefmt.date(summary.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
