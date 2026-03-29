import { useState } from "react";
import useDocumentShare from "@/features/document-share/useDocumentShare";
import { AxiosError } from "@/types/api";
import { handleApiError } from "@/helpers/api-error";
import { toast } from "sonner";

const useSharedTab = (userId: string) => {
  const [page, setPage] = useState(1);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const { getDocumentSharesByUserQuery, updateDocumentShareMutation } =
    useDocumentShare(userId, page);
  const {
    data: sharedDocuments,
    isLoading: sharedDocumentsLoading,
    isError: sharedDocumentError,
    error: sharedDocumentErrorData,
    refetch: refetchSharedDocuments,
  } = getDocumentSharesByUserQuery;
  const { mutateAsync: updateDocumentShare, isPending: isUpdatePending } =
    updateDocumentShareMutation;

  const allSharedDocuments = sharedDocuments?.documentShares ?? [];
  const totalPages = sharedDocuments?.pagination.totalPages ?? 0;
  const currentPage = sharedDocuments?.pagination.page ?? 1;

  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const handleToggleActive = async (
    sharedDocumentId: string,
    isActive: boolean,
  ) => {
    if (pendingIds.has(sharedDocumentId)) return;

    setPendingIds((prev) => new Set(prev).add(sharedDocumentId));
    try {
      await updateDocumentShare({
        id: sharedDocumentId,
        data: { isActive },
      });
      toast.success("Shared document updated successfully.");
    } catch (error) {
      const err = error as AxiosError;
      handleApiError(
        err,
        "Failed to update shared document. Please try again.",
      );
    } finally {
      setPendingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(sharedDocumentId);
        return newSet;
      });
    }
  };

  const fetchNextPage = () => {
    if (hasNextPage) setPage((prev) => prev + 1);
  };

  const fetchPreviousPage = () => {
    if (hasPreviousPage) setPage((prev) => prev - 1);
  };

  return {
    // Data
    allSharedDocuments,
    totalPages,
    currentPage,
    sharedDocumentsLoading,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    sharedDocumentError,
    sharedDocumentErrorData,
    refetchSharedDocuments,
    isUpdatePending,

    // Actions
    handleToggleActive,
  };
};

export default useSharedTab;
