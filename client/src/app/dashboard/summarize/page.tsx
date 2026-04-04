"use client";

import { Suspense } from "react";
import { Lightbulb, Sparkles, XCircle } from "lucide-react";

import CursorGlow from "@/components/CursorGlow";
import FileIcon from "@/components/FileIcon";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorScreen from "@/components/ErrorScreen";
import sizefmt from "@/helpers/size-format";

import useSummarizePage from "./useSummarizePage";
import SummaryTypeSelector from "./components/SummaryTypeSelector";
import SummaryResult from "./components/SummaryResult";
import GlobalChatUI from "@/components/dashboard/GlobalChatUI";
import SummaryDocumentNotFound from "./components/SummaryDocumentNotFound";
import Header from "@/components/dashboard/Header";

// ─── Page content ─────────────────────────────────────────────────────────────
function SummarizePageContent() {
  const {
    // Auth
    user,
    userLoading,
    userError,
    userErrorData,

    // Document
    document,
    docLoading,
    docError,
    docErrorData,

    // Retry
    retryDoc,
    retryUser,
    pageRetries,

    // Summary state
    selectedType,
    setSelectedType,
    generatedSummary,
    additionalDetails,
    tokenUsed,
    hasResult,

    // Mutation state
    isCreating,
    isCreateError,
    createErrorMessage,

    // UI
    mousePos,
    chatBotOpen,
    setChatBotOpen,

    // Handlers
    handleGenerate,
    handleRegenerate,
  } = useSummarizePage();

  // ─── Guards ────────────────────────────────────────────────────────────────

  if (userError)
    return (
      <ErrorScreen
        error={userErrorData}
        onRetry={retryUser}
        messageErrorTitle="User Error"
        retries={pageRetries}
      />
    );

  if (docError)
    return (
      <ErrorScreen
        error={docErrorData}
        onRetry={retryDoc}
        messageErrorTitle="Document Error"
        retries={pageRetries}
      />
    );

  if (userLoading || docLoading) return <LoadingScreen />;

  if (!document) {
    return <SummaryDocumentNotFound />;
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#111111] text-[#F5F5F5] font-serif">
      <CursorGlow mousePos={mousePos} />

      {/* Global Chat UI */}
      <GlobalChatUI
        user={user ?? null}
        chatBotOpen={chatBotOpen}
        setChatBotOpen={setChatBotOpen}
      />

      {/* Header */}
      <Header user={user ?? null} title="Document" titleHighlight="Summarize" />

      <main className="pt-24 pb-16 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
        {/* Document info */}
        <div className="bg-[rgba(31,41,55,0.4)] border border-[#C9A227]/15 rounded-lg p-4 mb-8 flex items-center gap-4">
          <FileIcon type={document.fileType} />
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-sans text-text/80 truncate">
              {document.title}
            </div>
            <div className="text-[11px] text-text/30 font-sans mt-0.5">
              {sizefmt.bytes(document.fileSize)} ·{" "}
              {sizefmt.date(document.createdAt)}
            </div>
          </div>
        </div>

        {/* Pre-generate */}
        {!hasResult && (
          <>
            <SummaryTypeSelector
              selected={selectedType}
              disabled={isCreating}
              onSelect={setSelectedType}
            />

            <div className="text-center mb-8">
              <button
                onClick={handleGenerate}
                disabled={isCreating}
                className={`inline-flex items-center gap-2.5 px-10 py-3.5 rounded-sm text-[12px] font-bold tracking-[0.14em] font-sans transition-all duration-200 ${
                  isCreating
                    ? "bg-[#C9A227]/40 text-[#111111]/50 cursor-not-allowed"
                    : "bg-[#C9A227] text-[#111111] hover:bg-[#e0b530] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(201,162,39,0.3)]"
                }`}
              >
                {isCreating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#111111]/30 border-t-[#111111] rounded-full animate-spin" />
                    GENERATING...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    GENERATE SUMMARY
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Post-generate */}
        {hasResult && (
          <SummaryResult
            summary={generatedSummary}
            type={selectedType}
            tokenUsed={tokenUsed}
            additionalDetails={additionalDetails}
            isCreating={isCreating}
            onRegenerate={handleRegenerate}
          />
        )}

        {/* Error */}
        {isCreateError && (
          <div className="mt-6 p-4 bg-red-500/5 border border-red-500/25 rounded-lg flex gap-3">
            <XCircle size={15} className="text-red-500/60 shrink-0 mt-px" />
            <p className="text-[12px] text-text/50 font-sans leading-[1.7]">
              <span className="text-text/70 font-semibold">Error: </span>
              {createErrorMessage}
            </p>
          </div>
        )}

        {/* Tip */}
        <div className="mt-8 p-4 bg-[#C9A227]/4 border border-[#C9A227]/12 rounded-lg flex gap-3">
          <span className="text-[#C9A227]/50 shrink-0">
            <Lightbulb size={15} color="#C9A227" />
          </span>
          <p className="text-[11.5px] text-text/40 font-sans leading-[1.75]">
            <span className="text-text/60 font-semibold">Tip: </span>
            Different summary types are optimized for different audiences. Short
            gives a quick overview, bullet points are great for scanning,
            detailed provides full context, and executive focuses on business
            impact.
          </p>
        </div>
      </main>
    </div>
  );
}

// ─── Suspense wrapper ─────────────────────────────────────────────────────────
export default function SummarizePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SummarizePageContent />
    </Suspense>
  );
}
