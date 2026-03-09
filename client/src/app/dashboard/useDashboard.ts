import { useState, useEffect, useRef, useCallback } from "react";

import useAuth from "@/features/auth/useAuth";
import useDashboard from "@/features/dashboard/useDashboard";
import useMousePosition from "@/features/ui/useMousePostion";

import { calcPct } from "@/utils/usage";

import { NavItem } from "@/components/dashboard/Sidebar";

const useDashboardPage = () => {
  const [nav, setNav] = useState<NavItem>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const mainRef = useRef<HTMLElement>(null);

  // ─── Auth ────────────────────────────────────────────────────────────────
  const { me } = useAuth();
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
    isError: userError,
    error: userErrorData,
  } = me;

  // ─── Overview ────────────────────────────────────────────────────────────
  const { dashboardOverview } = useDashboard(user?._id ?? "");
  const {
    data: overview,
    isLoading: overviewLoading,
    refetch: overViewRefetch,
  } = dashboardOverview;

  // ─── Derived usage percentages ────────────────────────────────────────────
  const tokenPct = calcPct(overview?.tokensUsed, user?.tokenLimit);
  const documentPct = calcPct(overview?.documentsUploaded, user?.documentLimit);

  // ─── Refetch helper ───────────────────────────────────────────────────────
  const handleRefetch = useCallback(
    async (scope: "all" | "overview" | "user") => {
      if (scope === "all") {
        await Promise.all([overViewRefetch(), refetchUser()]);
      } else if (scope === "overview") {
        await overViewRefetch();
      } else {
        await refetchUser();
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

    // Navigation & layout
    nav,
    setNav,
    sidebarOpen,
    setSidebarOpen,
    mainRef,
    mousePos,

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
