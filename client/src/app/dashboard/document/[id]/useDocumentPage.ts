import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import useAuth from "@/features/auth/useAuth";
import useDocument from "@/features/documents/useDocument";
import useSummary from "@/features/summary/useSummary";
import useMousePosition from "@/features/ui/useMousePostion";
import STATUS_META from "@/constants/status-meta";

const SUMMARIES_PER_PAGE = 3;

const useDocumentPage = () => {
  const params = useParams();
  const documentId = params?.id as string;

  // ─── UI state ─────────────────────────────────────────────────────────────
  const mousePos = useMousePosition();
  const [activeTab, setActiveTab] = useState<"details" | "summaries">(
    "details",
  );
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const { me } = useAuth();
  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
    isError: userError,
    error: userErrorData,
  } = me;

  // ─── Document ─────────────────────────────────────────────────────────────
  const { documentById } = useDocument(user?._id ?? "", documentId);
  const { data: document, isLoading: docLoading } = documentById;

  // ─── Summaries ────────────────────────────────────────────────────────────
  const { summariesByDocumentPage } = useSummary(user?._id ?? "", documentId);
  const { data: summariesData } = summariesByDocumentPage;

  const allSummaries =
    summariesData?.pages.flatMap((page) => page.summaries) ?? [];

  const documentSummaries = allSummaries.filter((s) => {
    const summaryDocId =
      s.document && typeof s.document === "object"
        ? s.document._id
        : typeof s.document === "string"
          ? s.document
          : null;
    return summaryDocId === documentId;
  });

  // ─── Pagination ───────────────────────────────────────────────────────────
  const totalPages = Math.max(
    1,
    Math.ceil(documentSummaries.length / SUMMARIES_PER_PAGE),
  );

  const paginatedSummaries = documentSummaries.slice(
    (currentPage - 1) * SUMMARIES_PER_PAGE,
    currentPage * SUMMARIES_PER_PAGE,
  );

  // Reset to page 1 when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // ─── Derived ──────────────────────────────────────────────────────────────
  const folder = document
    ? typeof document.folder === "object"
      ? document.folder
      : null
    : null;

  const statusMeta = document ? STATUS_META[document.status] : null;

  return {
    // IDs
    documentId,
    userId: user?._id ?? "",

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
  };
};

export default useDocumentPage;
