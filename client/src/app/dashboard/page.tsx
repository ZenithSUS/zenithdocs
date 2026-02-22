"use client";

import CursorGlow from "@/components/CursorGlow";
import DashboardHeader from "@/components/dashboard/Header";
import DashboardTabLoading from "@/components/dashboard/DashBoardTabLoading";
import DashBoardSidebar, { NavItem } from "@/components/dashboard/Sidebar";
import useAuth from "@/features/auth/useAuth";
import USAGE from "@/seeds/usage";

import { useState, useEffect, useRef, lazy, Suspense } from "react";
import DocumentsTab from "@/components/dashboard/tabs/Documents";
import useDashboard from "@/features/dashboard/useDashboard";

// Lazy-load dashboard tab components for code splitting
const OverViewTab = lazy(() => import("@/components/dashboard/tabs/Overview"));
const FolderTab = lazy(() => import("@/components/dashboard/tabs/Folders"));
const UsageTab = lazy(() => import("@/components/dashboard/tabs/Usage"));
const SummaryTab = lazy(() => import("@/components/dashboard/tabs/Summary"));

const CURRENT_MONTH = new Date().toISOString().slice(0, 7); // YYYY-MM

export default function DashboardPage() {
  const [nav, setNav] = useState<NavItem>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mainRef = useRef<HTMLElement>(null);

  const { me } = useAuth();
  const { data: user, isLoading: userLoading } = me;

  const { dashboardOverview } = useDashboard(user?._id || "");
  const { data: overview, isLoading: overviewLoading } = dashboardOverview;

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

  const tokenPct = user?.tokenLimit
    ? Math.round(((overview?.tokensUsed || 0) / user.tokenLimit) * 100)
    : 0;
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
        user={user ?? null}
        userLoading={userLoading}
        nav={nav}
        setNav={setNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        tokenPct={tokenPct}
        processingDocs={overview?.processingDocuments || 0}
        tokensUsed={overview?.tokensUsed || 0}
        tokenLimit={user?.tokenLimit || 0}
      />

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <DashboardHeader
          email={user?.email || "..."}
          nav={nav}
          setSidebarOpen={setSidebarOpen}
          totalDocuments={overview?.totalDocuments || 0}
          totalSummaries={overview?.totalSummary || 0}
          totalFolders={overview?.totalFolders || 0}
        />

        {/* Page content */}
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
                maxUsage={maxUsage}
                overview={overview}
                overviewLoading={overviewLoading}
              />
            </Suspense>
          )}

          {/* ══ DOCUMENTS ═════════════════════════════════════════════════════ */}
          {nav === "documents" && (
            <Suspense fallback={<DashboardTabLoading />}>
              <DocumentsTab />
            </Suspense>
          )}

          {/* ══ SUMMARIES ═════════════════════════════════════════════════════ */}
          {nav === "summaries" && (
            <Suspense fallback={<DashboardTabLoading />}>
              <SummaryTab />
            </Suspense>
          )}

          {/* ══ FOLDERS ═══════════════════════════════════════════════════════ */}
          {nav === "folders" && (
            <Suspense fallback={<DashboardTabLoading />}>
              <FolderTab setNav={setNav} />
            </Suspense>
          )}

          {/* ══ USAGE ═════════════════════════════════════════════════════════ */}
          {nav === "usage" && (
            <Suspense fallback={<DashboardTabLoading />}>
              <UsageTab
                usage={USAGE}
                currentMonth={CURRENT_MONTH}
                tokenPct={tokenPct}
                tokenLimit={user?.tokenLimit || 0}
                currentTokensUsed={overview?.tokensUsed || 0}
                maxUsage={maxUsage}
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
