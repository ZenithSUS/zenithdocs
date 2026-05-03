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

  if (currentPageIsFull) {
    const baseKey = queryKey.slice(0, -1);
    queryClient.invalidateQueries({
      queryKey: baseKey,
      predicate: (query) => query.queryKey !== queryKey,
    });
  }
};

export const updateDocumentShareCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  updatedDocumentShare: DocumentShare,
) => {
  const baseKey = queryKey.slice(0, -1);
  queryClient.setQueriesData<DocumentSharePage>(
    { queryKey: baseKey },
    (oldData) => {
      if (!oldData) return oldData;

      const exists = oldData.documentShares.some(
        (d) => d._id === updatedDocumentShare._id,
      );
      if (!exists) return oldData;

      return {
        ...oldData,
        documentShares: oldData.documentShares.map((d) =>
          d._id === updatedDocumentShare._id ? updatedDocumentShare : d,
        ),
      };
    },
  );
};

export const removeDocumentShareCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  deletedId: string,
  limit: number,
) => {
  const existingData = queryClient.getQueryData<DocumentSharePage>(queryKey);

  if (!existingData) {
    queryClient.invalidateQueries({ queryKey });
    return;
  }

  const hasItem = existingData.documentShares.some((d) => d._id === deletedId);

  if (!hasItem) return;

  const newTotal = existingData.pagination.total - 1;
  const newTotalPages = Math.ceil(newTotal / limit);

  queryClient.setQueryData<DocumentSharePage>(queryKey, {
    ...existingData,
    pagination: {
      ...existingData.pagination,
      total: newTotal,
      totalPages: newTotalPages,
    },
    documentShares: existingData.documentShares.filter(
      (d) => d._id !== deletedId,
    ),
  });

  const baseKey = queryKey.slice(0, -1);
  queryClient.invalidateQueries({
    queryKey: baseKey,
    predicate: (query) => query.queryKey !== queryKey,
  });
};
