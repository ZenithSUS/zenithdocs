import { DocumentShare } from "@/types/document-share";
import { QueryClient } from "@tanstack/react-query";
import { DocumentSharePage } from "./useDocumentShare";

export const addDocumentShareCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  newDocumentShare: DocumentShare,
) => {
  queryClient.setQueriesData<DocumentSharePage>({ queryKey }, (oldData) => {
    if (!oldData) return oldData;

    const isPageOne = oldData.pagination.page === 1;
    const newTotal = isPageOne ? 1 : oldData.pagination.total + 1;
    const newTotalPages = isPageOne
      ? 1
      : Math.ceil(newTotal / oldData.pagination.limit);

    return {
      ...oldData,
      // Add pagination if the current page or documentShares is empty
      pagination: {
        ...oldData.pagination,
        total: newTotal,
        totalPages: newTotalPages,
      },
      documentShares: isPageOne
        ? [newDocumentShare, ...oldData.documentShares]
        : oldData.documentShares,
    };
  });
};

export const updateDocumentShareCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  updatedDocumentShare: DocumentShare,
) => {
  queryClient.setQueryData<DocumentSharePage>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      documentShares: oldData.documentShares.map((documentShare) =>
        documentShare._id === updatedDocumentShare._id
          ? updatedDocumentShare
          : documentShare,
      ),
    };
  });
};

export const removeDocumentShareCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  deletedId: string,
) => {
  queryClient.setQueriesData<DocumentSharePage>({ queryKey }, (oldData) => {
    if (!oldData) return oldData;

    const hasItem = oldData.documentShares.some((d) => d._id === deletedId);
    const newTotal = oldData.pagination.total - 1;

    if (!hasItem) return oldData;

    return {
      ...oldData,
      pagination: {
        ...oldData.pagination,
        total: newTotal,
        totalPages: Math.ceil(newTotal / oldData.pagination.limit),
      },
      documentShares: hasItem
        ? oldData.documentShares.filter((d) => d._id !== deletedId)
        : oldData.documentShares,
    };
  });
};
