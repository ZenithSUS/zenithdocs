import { useEffect, useMemo, useRef, useState } from "react";
import { SummaryType } from "@/types/summary";
import { useSummaryByUserPage } from "@/features/summary/useSummaryByUserPage";

const ALL_TYPES: SummaryType[] = ["short", "bullet", "detailed", "executive"];

const useSummaryTab = (userId: string) => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
  } = useSummaryByUserPage(userId);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allSummaries = data?.pages.flatMap((page) => page.summaries) ?? [];

  const filteredSummaries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allSummaries;

    return allSummaries.filter((summary) => {
      const title =
        typeof summary.document === "object"
          ? summary.document.title
          : "Unknown Document";

      return title.toLowerCase().includes(q);
    });
  }, [allSummaries, searchQuery]);

  const existingTypes = new Set(allSummaries.map((s) => s.type));
  const unusedTypes = ALL_TYPES.filter((t) => !existingTypes.has(t));

  return {
    allSummaries: filteredSummaries,
    unusedTypes,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    loadMoreRef,
    searchQuery,
    setSearchQuery,
    isError,
    error,
    refetch,
  };
};

export default useSummaryTab;
