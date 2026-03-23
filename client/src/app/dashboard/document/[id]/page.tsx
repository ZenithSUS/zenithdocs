"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileX2Icon,
  MessageCircle,
  Sparkles,
  Zap,
} from "lucide-react";

import CursorGlow from "@/components/CursorGlow";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorScreen from "@/components/dashboard/ErrorScreen";

import useDocumentPage from "./useDocumentPage";
import DocumentHeader from "./components/DocumentHeader";
import DocumentTabs from "./components/DocumentTabs";
import DocumentDetailsTab from "./components/DocumentDetailsTab";
import DocumentSummariesTab from "./components/DocumentSummariesTab";
import GlobalChat from "@/components/dashboard/globalchat";
import { useState } from "react";

export default function DocumentViewPage() {
  const router = useRouter();
  const [chatBotOpen, setChatBotOpen] = useState(false);

  const {
    // IDs
    documentId,
    userId,

    // Auth
    user,
    userLoading,
    userError,
    userErrorData,
    refetchUser,

    // Document
    document,
    docLoading,
    folder,
    statusMeta,

    // Summaries
    documentSummaries,
    paginatedSummaries,
    totalPages,

    // Pagination
    currentPage,
    setCurrentPage,

    // Tabs
    activeTab,
    setActiveTab,

    // UI
    mousePos,
  } = useDocumentPage();

  // ─── Guards ───────────────────────────────────────────────────────────────

  if (userError)
    return <ErrorScreen error={userErrorData} onRetry={refetchUser} />;
  if (docLoading || userLoading) return <LoadingScreen />;

  if (!document) {
    return (
      <div className="min-h-screen bg-[#111111] text-[#F5F5F5] font-serif flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 flex items-center justify-center">
            <FileX2Icon size={50} />
          </div>
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

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="h-screen bg-[#111111] text-[#F5F5F5] font-serif overflow-y-auto">
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

          <div className="flex flex-row items-center gap-2">
            <button
              onClick={() =>
                router.push(`/dashboard/summarize?doc=${documentId}`)
              }
              className="hidden sm:flex items-center gap-2 px-5 py-2 bg-[#C9A227] text-[#111111] rounded-sm text-[12px] font-bold tracking-widest font-sans transition-all duration-200 hover:bg-[#e0b530] hover:-translate-y-0.5"
            >
              <Sparkles size={13} />
              SUMMARIZE
            </button>
            <button
              onClick={() => router.push(`/dashboard/chat?doc=${documentId}`)}
              className="hidden sm:flex items-center gap-2 px-5 py-2 bg-accent text-[#FFFFFF] rounded-sm text-[12px] font-bold tracking-widest font-sans transition-all duration-200 hover:bg-accent hover:-translate-y-0.5"
            >
              <MessageCircle size={20} />
              CHAT
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="pt-24 pb-12 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
        <DocumentHeader
          documentId={documentId}
          document={document}
          folder={folder}
          statusMeta={statusMeta!}
        />

        <DocumentTabs
          active={activeTab}
          summaryCount={documentSummaries.length}
          onSelect={setActiveTab}
        />

        {activeTab === "details" && (
          <DocumentDetailsTab
            document={document}
            folder={folder}
            statusMeta={statusMeta!}
          />
        )}

        {activeTab === "summaries" && (
          <DocumentSummariesTab
            documentId={documentId}
            userId={userId}
            summaries={documentSummaries}
            paginatedSummaries={paginatedSummaries}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}
