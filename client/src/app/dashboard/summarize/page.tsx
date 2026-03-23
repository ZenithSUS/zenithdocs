"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, Sparkles, XCircle, Zap } from "lucide-react";

import CursorGlow from "@/components/CursorGlow";
import FileIcon from "@/components/FileIcon";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import ErrorScreen from "@/components/dashboard/ErrorScreen";
import sizefmt from "@/helpers/size-format";

import useSummarizePage from "./useSummarizePage";
import SummaryTypeSelector from "./components/SummaryTypeSelector";
import SummaryResult from "./components/SummaryResult";
import GlobalChat from "@/components/dashboard/globalchat";

// ─── Page content ─────────────────────────────────────────────────────────────
function SummarizePageContent() {
  const router = useRouter();
  const [chatBotOpen, setChatBotOpen] = useState(false);

  const {
    // Auth
    user,
    userLoading,
    userError,
    userErrorData,
    refetchUser,

    // Document
    document,
    docLoading,

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

    // Handlers
    handleGenerate,
    handleRegenerate,
  } = useSummarizePage();

  // ─── Guards ────────────────────────────────────────────────────────────────

  if (userError)
    return <ErrorScreen error={userErrorData} onRetry={refetchUser} />;
  if (userLoading || docLoading) return <LoadingScreen />;

  if (!document) {
    return (
      <div className="min-h-screen bg-[#111111] text-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">404</div>
          <h2 className="text-xl font-normal mb-2 font-serif">
            Document not found
          </h2>
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

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen overflow-y-auto bg-[#111111] text-[#F5F5F5] font-serif">
      <CursorGlow mousePos={mousePos} />

      {/* Chatbot button */}
      {chatBotOpen ? (
        <div className="fixed bottom-5 right-5 z-50">
          <GlobalChat user={user ?? null} setIsOpen={setChatBotOpen} />
        </div>
      ) : (
        <div className="bg-background rounded-full p-2 border border-primary fixed bottom-5 right-5 z-50 hover:bg-primary/10 hover:scale-105 transition-transform">
          <Zap
            onClick={() => setChatBotOpen(true)}
            className="cursor-pointer hover:scale-105 transition-transform"
            size={20}
            strokeWidth={2}
          />
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-45 px-5 sm:px-8 md:px-12 py-5 bg-[#111111]/92 backdrop-blur-xl border-b border-[#C9A227]/12">
        <div className="flex items-center gap-4 max-w-5xl mx-auto">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-[#F5F5F5]/50 hover:text-[#C9A227] transition-colors duration-200 flex items-center gap-1.5 text-[11px] tracking-widest font-sans"
          >
            ← BACK
          </button>
          <div className="h-4 w-px bg-[#F5F5F5]/10" />
          <h1 className="text-[15px] font-bold tracking-[0.08em] font-serif">
            AI <span className="text-[#C9A227]">SUMMARIZE</span>
          </h1>
        </div>
      </header>

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
