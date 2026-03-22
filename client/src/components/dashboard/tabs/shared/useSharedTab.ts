import { useState } from "react";
import useDocumentShare from "@/features/document-share/useDocumentShare";

const useSharedTab = (userId: string) => {
  const [page, setPage] = useState(1);

  const { getDocumentSharesByUserQuery } = useDocumentShare(userId, page);
  const {
    data: sharedDocuments,
    isLoading: sharedDocumentsLoading,
    isError: sharedDocumentError,
    error: sharedDocumentErrorData,
    refetch: refetchSharedDocuments,
  } = getDocumentSharesByUserQuery;

  const allSharedDocuments = sharedDocuments?.documentShares ?? [];
  const totalPages = sharedDocuments?.pagination.totalPages ?? 0;
  const currentPage = sharedDocuments?.pagination.page ?? 1;

  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const fetchNextPage = () => {
    if (hasNextPage) setPage((prev) => prev + 1);
  };

  const fetchPreviousPage = () => {
    if (hasPreviousPage) setPage((prev) => prev - 1);
  };

  return {
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
  };
};

export default useSharedTab;
