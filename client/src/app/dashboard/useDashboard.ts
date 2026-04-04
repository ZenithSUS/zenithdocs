import { useState, useEffect, useRef, useCallback } from "react";

import { useDashboardOverview } from "@/features/dashboard/useDashboardOverview";
import useMousePosition from "@/features/ui/useMousePostion";
import { calcPct } from "@/utils/usage";
import { NavItem } from "@/components/dashboard/Sidebar";
import useRetryStore from "@/store/useRetryStore";
import { useAuthMe } from "@/features/auth/useAuthMe";

const useDashboardPage = () => {
  const [nav, setNav] = useState<NavItem>("overview");
  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const mainRef = useRef<HTMLElement>(null);

  const { increment, retries } = useRetryStore();
  const pageRetry = retries["dashboard-page"] ?? 0;

  // ─── Auth ────────────────────────────────────────────────────────────────
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
    isError: userError,
    error: userErrorData,
  } = useAuthMe();

  // ─── Overview ────────────────────────────────────────────────────────────

  const {
    data: overview,
    isLoading: overviewLoading,
    refetch: overViewRefetch,
  } = useDashboardOverview(user?._id ?? "");

  // ─── Derived usage percentages ────────────────────────────────────────────
  const tokenPct = calcPct(overview?.tokensUsed, user?.tokenLimit);
  const documentPct = calcPct(overview?.documentsUploaded, user?.documentLimit);

  // ─── Refetch helper ───────────────────────────────────────────────────────
  const handleRefetch = useCallback(
    async (scope: "all" | "overview" | "user") => {
      increment("dashboard-page");

      if (scope === "all") {
        const [overviewResult, userResult] = await Promise.all([
          overViewRefetch(),
          refetchUser(),
        ]);
        if (
          overviewResult.status === "success" &&
          userResult.status === "success"
        ) {
          useRetryStore.getState().reset("dashboard-page");
        }
      } else if (scope === "overview") {
        const { status } = await overViewRefetch();
        if (status === "success")
          useRetryStore.getState().reset("dashboard-page");
      } else {
        const { status } = await refetchUser();
        if (status === "success")
          useRetryStore.getState().reset("dashboard-page");
      }
    },
    [overViewRefetch, refetchUser],
  );

  // ─── Animate main content on nav change ──────────────────────────────────
  useEffect(() => {
    if (userLoading) return;
    const el = mainRef.current;
    if (!el) return;
    el.classList.remove("content-in");
    const frame = requestAnimationFrame(() => el.classList.add("content-in"));
    return () => cancelAnimationFrame(frame);
  }, [nav, userLoading]);

  // ─── UI ───────────────────────────────────────────────────────────────────
  const mousePos = useMousePosition();

  return {
    // Auth
    user,
    userLoading,
    userError,
    userErrorData,
    refetchUser,

    // Retries
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

    // Filters
    filterFolder,
    setFilterFolder,

    // Usage
    tokenPct,
    documentPct,

    // Actions
    handleRefetch,
  };
};

export default useDashboardPage;
