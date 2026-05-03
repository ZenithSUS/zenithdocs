import { DocumentShare } from "@/types/document-share";
import { QueryClient } from "@tanstack/react-query";
import { DocumentSharePage } from "./useDocumentShare";

export const addDocumentShareCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  newDocumentShare: DocumentShare,
  limit: number,
) => {
  const existingData = queryClient.getQueryData<DocumentSharePage>(queryKey);

  if (!existingData) {
    queryClient.invalidateQueries({ queryKey });
    return;
  }

  const { total } = existingData.pagination;
  const newTotal = total + 1;
  const newTotalPages = Math.ceil(newTotal / limit);
  const currentPageIsFull = existingData.documentShares.length >= limit;

  const updatedShares = currentPageIsFull
    ? [newDocumentShare, ...existingData.documentShares.slice(0, limit - 1)]
    : [newDocumentShare, ...existingData.documentShares];

  queryClient.setQueryData<DocumentSharePage>(queryKey, {
    ...existingData,
    pagination: {
      ...existingData.pagination,
      total: newTotal,
      totalPages: newTotalPages,
    },
    documentShares: updatedShares,
  });

  // Invalidate all other pages so they refetch fresh
  if (currentPageIsFull) {
    const baseKey = queryKey.slice(0, -1);
    queryClient.invalidateQueries({
      queryKey: baseKey,
      predicate: (query) => query.queryKey !== queryKey, // skip page 1, already updated
    });
  }
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
