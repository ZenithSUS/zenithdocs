import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";

import useAuth from "@/features/auth/useAuth";
import useDocument from "@/features/documents/useDocument";
import useSummary from "@/features/summary/useSummary";
import useMousePosition from "@/features/ui/useMousePostion";
import STATUS_META from "@/constants/status-meta";
import useRetryStore from "@/store/useRetryStore";
import { useDocumentById } from "@/features/documents/useDocumentById";

const SUMMARIES_PER_PAGE = 3;

const useDocumentPage = () => {
  const params = useParams();
  const documentId = params?.id as string;

  const { retries, increment } = useRetryStore();
  const pageRetries = retries["document-page"] ?? 0;

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
  const {
    data: document,
    isLoading: docLoading,
    refetch: refetchDocument,
    isError: docError,
    error: docErrorData,
  } = useDocumentById(documentId);

  // ─── Summaries ────────────────────────────────────────────────────────────
  const { summariesByDocumentPage } = useSummary(user?._id ?? "", documentId);
  const {
    data: summariesData,
    isLoading: summariesLoading,
    refetch: refetchSummaries,
    isError: summariesError,
    error: summariesErrorData,
  } = summariesByDocumentPage;

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

  const isDocumentLoading = useMemo(
    () =>
      docLoading ||
      summariesLoading ||
      (userLoading && !user) ||
      (userLoading && !document),
    [docLoading, summariesLoading, userLoading, user, document],
  );

  const isDocumentError = docError || summariesError;
  const documentErrorData = docErrorData || summariesErrorData;

  const refetchDocumentPage = async () => {
    const docResult = await refetchDocument();
    if (docResult.status !== "success") return docResult;
    return await refetchSummaries();
  };

  const retryUser = () => {
    increment("chat-page");
    refetchUser().then(({ status }) => {
      if (status === "success") useRetryStore.getState().reset("chat-page");
    });
  };

  const retryDoc = () => {
    increment("document-page");
    refetchDocumentPage().then((result) => {
      if (result.status === "success") {
        useRetryStore.getState().reset("document-page");
      }
    });
  };

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
    userError,
    userErrorData,

    // Document
    document,
    folder,
    statusMeta,
    isDocumentLoading,
    isDocumentError,
    documentErrorData,

    // Retries
    pageRetries,
    retryUser,
    retryDoc,

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
