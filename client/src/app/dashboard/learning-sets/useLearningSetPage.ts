import { useAuthMe } from "@/features/auth/useAuthMe";
import { useDocumentByUserPage } from "@/features/documents/useDocumentByUserPage";
import useLearningSet from "@/features/learning-sets/useLearningSet";
import useMousePosition from "@/features/ui/useMousePostion";
import useRetryStore from "@/store/useRetryStore";
import { LearningSet } from "@/types/learning-set";
import { useState } from "react";

const useLearningSetPage = () => {
  const { increment, retries } = useRetryStore();
  const pageRetry = retries["learning-sets-page"] ?? 0;

  const [generatedSet, setGeneratedSet] = useState<LearningSet | null>(null);
  const [chatBotOpen, setChatBotOpen] = useState(false);

  // ─── Mouse Position ─────────────────────────────────────────────────────────
  const mousePos = useMousePosition();

  // ─── Auth ────────────────────────────────────────────────────────────────────
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
    error: userErrorData,
    refetch: refetchUser,
  } = useAuthMe();

  // ─── Documents ───────────────────────────────────────────────────────────────
  const {
    data: documents,
    isLoading: documentsLoading,
    isError: documentsError,
    error: documentsErrorData,
    refetch: refetchDocuments,
    hasNextPage: documentsHasNextPage,
    fetchNextPage: fetchNextDocumentsPage,
  } = useDocumentByUserPage(user?._id ?? "");

  // ─── Learning Sets ───────────────────────────────────────────────────────────
  const { createLearningSetMutation } = useLearningSet(user?._id ?? "");

  // ─── Memoized values ─────────────────────────────────────────────────────────
  const allDocuments = documents?.pages.flatMap((page) => page.documents) ?? [];

  const isLearningSetPageError = userError || documentsError;
  const learningSetPageErrorData = userErrorData || documentsErrorData;

  // ─── Retry ───────────────────────────────────────────────────────────────────
  const retryLearningSetsPage = () => {
    increment("learning-sets-page");
    refetchUser().then(({ status }) => {
      if (status !== "success") return;

      refetchDocuments().then(({ status }) => {
        if (status === "success") {
          useRetryStore.getState().reset("learning-sets-page");
        }
      });
    });
  };

  return {
    // UI
    mousePos,
    chatBotOpen,
    setChatBotOpen,

    // Retry
    pageRetry,
    retryLearningSetsPage,

    // Auth
    user,
    userLoading,
    refetchUser,

    // Documents
    documents: allDocuments,
    documentsLoading,
    refetchDocuments,
    documentsHasNextPage,
    fetchNextDocumentsPage,

    // Learning Sets
    createLearningSetMutation,
    generatedSet,
    setGeneratedSet,

    // Errors
    isLearningSetPageError,
    learningSetPageErrorData,
  };
};

export default useLearningSetPage;
