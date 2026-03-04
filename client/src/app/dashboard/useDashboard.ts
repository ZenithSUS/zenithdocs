import { NavItem } from "@/components/dashboard/Sidebar";
import useAuthStore from "@/features/auth/auth.store";
import useAuth from "@/features/auth/useAuth";
import useDashboard from "@/features/dashboard/useDashboard";
import { useState, useEffect, useRef, useCallback } from "react";

const useDashboardPage = () => {
  const [nav, setNav] = useState<NavItem>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mainRef = useRef<HTMLElement>(null);

  const { setAccessToken, setUserId } = useAuthStore();
  const { me } = useAuth();
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
    isError: userError,
    error: userErrorData,
  } = me;

  const { dashboardOverview } = useDashboard(user?._id || "");
  const {
    data: overview,
    isLoading: overviewLoading,
    refetch: overViewRefetch,
  } = dashboardOverview;

  const tokenPct = user?.tokenLimit
    ? Math.min(
        100,
        Math.round(((overview?.tokensUsed || 0) / user.tokenLimit) * 100),
      )
    : 0;
  const documentPct = user?.documentLimit
    ? Math.min(
        100,
        Math.round(
          ((overview?.documentsUploaded || 0) / user.documentLimit) * 100,
        ),
      )
    : 0;

  const handleRefetch = useCallback(
    async (scope: "all" | "overview" | "user") => {
      if (scope === "all") {
        await Promise.all([overViewRefetch(), refetchUser()]);
      } else if (scope === "overview") {
        await overViewRefetch();
      } else if (scope === "user") {
        await refetchUser();
      }
    },
    [overViewRefetch, refetchUser],
  );

  useEffect(() => {
    const h = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // Animate main content on nav change
  useEffect(() => {
    if (userLoading) return;
    const el = mainRef.current;
    if (!el) return;
    el.classList.remove("content-in");
    const frame = requestAnimationFrame(() => {
      el.classList.add("content-in");
    });
    return () => cancelAnimationFrame(frame);
  }, [nav, userLoading]);

  useEffect(() => {
    if (user?._id) {
      setUserId(user._id);
    }
  }, [user?._id]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setAccessToken(token);
  }, []);

  return {
    // Auth
    user,
    userLoading,
    userError,
    userErrorData,
    refetchUser,

    // Navigation & Layout
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
