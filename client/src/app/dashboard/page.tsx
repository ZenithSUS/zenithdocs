"use client";

import CursorGlow from "@/components/CursorGlow";
import DashboardHeader from "@/components/dashboard/Header";
import DashboardTabLoading from "@/components/dashboard/DashBoardTabLoading";
import DashBoardSidebar from "@/components/dashboard/Sidebar";

import { lazy, Suspense } from "react";
import DashboardLoading from "@/components/dashboard/LoadingScreen";
import ErrorScreen from "@/components/dashboard/ErrorScreen";
import useDashboardPage from "./useDashboard";
import DocumentsLoadingSkeleton from "@/components/dashboard/tabs/documents/DocumentsLoadingSkeleton";
import FolderLoadingSkeletion from "@/components/dashboard/tabs/folders/FolderLoadingSkeletion";

// Lazy-load dashboard tab components for code splitting
const OverViewTab = lazy(() => import("@/components/dashboard/tabs/Overview"));
const DocumentsTab = lazy(
  () => import("@/components/dashboard/tabs/documents"),
);
const FolderTab = lazy(() => import("@/components/dashboard/tabs/folders"));
const UsageTab = lazy(() => import("@/components/dashboard/tabs/Usage"));
const SummaryTab = lazy(() => import("@/components/dashboard/tabs/Summary"));

const CURRENT_MONTH = new Date().toISOString().slice(0, 7); // YYYY-MM

export default function DashboardPage() {
  const {
    user,
    userLoading,
    userError,
    userErrorData,
    overview,
    tokenPct,
    documentPct,
    handleRefetch,
    refetchUser,
    nav,
    setNav,
    sidebarOpen,
    setSidebarOpen,
    mousePos,
    filterFolder,
    setFilterFolder,
    mainRef,
    overviewLoading,
  } = useDashboardPage();

  if (userError) {
    return (
      <ErrorScreen
        error={userErrorData}
        onRetry={() => handleRefetch("user")}
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
        tokenPct={tokenPct}
        tokensUsed={overview?.tokensUsed || 0}
        tokenLimit={user?.tokenLimit || 0}
        documentLimit={user?.documentLimit || 0}
        documentUsed={overview?.documentsUploaded || 0}
        documentPct={documentPct}
      />

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-64">
        {/* Top bar */}
        <DashboardHeader
          refetch={refetchUser}
          email={user?.email || "..."}
          userId={user?._id || ""}
          plan={user?.plan || ""}
          nav={nav}
          setSidebarOpen={setSidebarOpen}
          totalDocuments={overview?.totalDocuments || 0}
          totalSummaries={overview?.totalSummary || 0}
          totalFolders={overview?.totalFolders || 0}
          tokensUsed={overview?.tokensUsed || 0}
          tokenLimit={user?.tokenLimit || 0}
          tokenPct={tokenPct}
          documentUsed={overview?.documentsUploaded || 0}
          documentLimit={user?.documentLimit || 0}
          documentPct={documentPct}
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
                currentMonth={CURRENT_MONTH}
                completedDocs={overview?.completedDocuments || 0}
                tokenPct={tokenPct}
                currentTokensUsed={overview?.tokensUsed || 0}
                maxUsage={user?.tokenLimit || 0}
                overview={overview}
                overviewLoading={overviewLoading}
                summaryTypesOverview={overview?.totalSummaryTypes || []}
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

          {/* ══ SUMMARIES ═════════════════════════════════════════════════════ */}
          {nav === "summaries" && (
            <Suspense fallback={<DashboardTabLoading />}>
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

          {/* ══ USAGE ═════════════════════════════════════════════════════════ */}
          {nav === "usage" && (
            <Suspense fallback={<DashboardTabLoading />}>
              <UsageTab
                userId={user?._id ?? ""}
                currentMonth={CURRENT_MONTH}
                tokenPct={tokenPct}
                tokenLimit={user?.tokenLimit || 0}
                currentTokensUsed={overview?.tokensUsed || 0}
                maxUsage={user?.tokenLimit || 0}
              />
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
