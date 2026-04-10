"use client";

import dayjs from "dayjs";
import CursorGlow from "@/components/CursorGlow";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabLoading from "@/components/dashboard/DashBoardTabLoading";
import DashBoardSidebar from "@/components/dashboard/Sidebar";

import { lazy, Suspense } from "react";
import DashboardLoading from "@/components/LoadingScreen";
import ErrorScreen from "@/components/ErrorScreen";
import useDashboardPage from "./useDashboard";
import DocumentsLoadingSkeleton from "@/components/dashboard/tabs/document/components/DocumentsLoadingSkeleton";
import LearningSetSkeletion from "@/components/dashboard/tabs/study/components/LearningSetSkeleton";
import FolderLoadingSkeletion from "@/components/dashboard/tabs/folder/components/FolderLoadingSkeletion";
import SummaryCardSkeleton from "@/components/dashboard/skeleton/SummaryCardSkeleton";
import DocumentChatLoading from "@/components/dashboard/tabs/chat/components/DocumentChatLoading";
import SharedDocumentLoading from "@/components/dashboard/tabs/shared/components/SharedDocumentLoading";
import UsageTabLoading from "@/components/dashboard/skeleton/UsageTabLoading";
import GlobalChatUI from "@/components/dashboard/GlobalChatUI";

// Lazy-load dashboard tab components for code splitting
const OverViewTab = lazy(() => import("@/components/dashboard/tabs/overview"));
const DocumentsTab = lazy(() => import("@/components/dashboard/tabs/document"));
const StudyTab = lazy(() => import("@/components/dashboard/tabs/study"));
const SummaryTab = lazy(() => import("@/components/dashboard/tabs/summary"));
const ChatsTab = lazy(() => import("@/components/dashboard/tabs/chat"));
const FolderTab = lazy(() => import("@/components/dashboard/tabs/folder"));
const UsageTab = lazy(() => import("@/components/dashboard/tabs/usage"));
const SharedTab = lazy(() => import("@/components/dashboard/tabs/shared"));

const CURRENT_MONTH = dayjs().format("YYYY-MM");

export default function DashboardPage() {
  const {
    // Auth
    user,
    userLoading,
    userError,
    userErrorData,

    // Retry
    pageRetry,

    // Navigation & layout
    nav,
    setNav,
    sidebarOpen,
    setSidebarOpen,
    mainRef,
    mousePos,

    // UI
    chatBotOpen,
    setChatBotOpen,

    // Overview
    overview,
    overviewLoading,
    overviewError,
    overviewErrorData,

    // Filters
    filterFolder,
    setFilterFolder,

    // Usage
    documentPct,
    storagePct,
    messagePct,

    // Actions
    handleRefetch,
  } = useDashboardPage();

  if (userError) {
    return (
      <ErrorScreen
        error={userErrorData}
        onRetry={() => handleRefetch("user")}
        messageErrorTitle="User Error"
        retries={pageRetry}
      />
    );
  }

  if (userLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="h-screen bg-background text-text font-serif flex overflow-hidden">
      {/* Ambient cursor glow */}
      <CursorGlow mousePos={mousePos} />

      {/* Global ChatBot */}
      <GlobalChatUI
        user={user ?? null}
        chatBotOpen={chatBotOpen}
        setChatBotOpen={setChatBotOpen}
      />

      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <DashBoardSidebar
        user={user ?? null}
        userLoading={userLoading}
        nav={nav}
        setNav={setNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        processingDocs={overview?.processingDocuments || 0}
        documentLimit={user?.documentLimit || 0}
        documentUsed={overview?.documentsUploaded || 0}
        documentPct={documentPct}
        storageLimit={user?.storageLimit || 0}
        storageUsed={overview?.storageUsed || 0}
        storagePct={storagePct}
        messages={overview?.dailyMessage || 0}
        messagesPerDay={user?.messagesPerDay || 0}
        messagePct={messagePct}
      />

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-64">
        {/* Top bar */}
        <DashboardHeader
          email={user?.email || "..."}
          plan={user?.plan || ""}
          nav={nav}
          setSidebarOpen={setSidebarOpen}
          totalDocuments={overview?.totalDocuments || 0}
          totalSummaries={overview?.totalSummary || 0}
          totalFolders={overview?.totalFolders || 0}
          documentUsed={overview?.documentsUploaded || 0}
          documentLimit={user?.documentLimit || 0}
          documentPct={documentPct}
          storageLimit={user?.storageLimit || 0}
          storageUsed={overview?.storageUsed || 0}
          storagePct={storagePct}
        />

        {/* Page content — this is the ONLY scrollable area */}
        <main
          ref={mainRef}
          className="content-enter flex-1 overflow-y-auto px-5 sm:px-8 py-6 sm:py-8"
        >
          {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
          {nav === "overview" && (
            <Suspense fallback={<DashboardTabLoading />}>
              <OverViewTab
                key={CURRENT_MONTH}
                setNav={setNav}
                messsagesPerDay={user?.messagesPerDay || 0}
                completedDocs={overview?.completedDocuments || 0}
                overview={overview}
                overviewLoading={overviewLoading}
                overviewError={overviewError}
                overViewErrorData={overviewErrorData}
                refetch={() => handleRefetch("overview")}
              />
            </Suspense>
          )}

          {/* ══ DOCUMENTS ═════════════════════════════════════════════════════ */}
          {nav === "documents" && (
            <Suspense fallback={<DocumentsLoadingSkeleton />}>
              <DocumentsTab
                userId={user?._id ?? ""}
                filterFolder={filterFolder}
                setFilterFolder={setFilterFolder}
              />
            </Suspense>
          )}

          {/* ═══ STUDIES ═════════════════════════════════════════════════════ */}
          {nav === "studies" && (
            <Suspense fallback={<LearningSetSkeletion />}>
              <StudyTab userId={user?._id ?? ""} />
            </Suspense>
          )}

          {/* ══ SUMMARIES ═════════════════════════════════════════════════════ */}
          {nav === "summaries" && (
            <Suspense fallback={<SummaryCardSkeleton />}>
              <SummaryTab userId={user?._id ?? ""} />
            </Suspense>
          )}

          {/* ══ FOLDERS ═══════════════════════════════════════════════════════ */}
          {nav === "folders" && (
            <Suspense fallback={<FolderLoadingSkeletion />}>
              <FolderTab
                setNav={setNav}
                userId={user?._id ?? ""}
                setFilterFolder={setFilterFolder}
                onRefresh={handleRefetch}
              />
            </Suspense>
          )}

          {/* ══ Chats ═════════════════════════════════════════════════════ */}
          {nav === "chats" && (
            <Suspense fallback={<DocumentChatLoading />}>
              <ChatsTab userId={user?._id ?? ""} />
            </Suspense>
          )}

          {/* ══ USAGE ═════════════════════════════════════════════════════════ */}
          {nav === "usage" && (
            <Suspense fallback={<UsageTabLoading />}>
              <UsageTab
                userId={user?._id ?? ""}
                totalMessagesThisMonth={overview?.totalMessages ?? 0}
                totalAIRequests={overview?.totalAIRequests ?? 0}
                currentMonth={CURRENT_MONTH}
              />
            </Suspense>
          )}

          {nav === "shared" && (
            <Suspense fallback={<SharedDocumentLoading />}>
              <SharedTab userId={user?._id ?? ""} setNav={setNav} />
            </Suspense>
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
