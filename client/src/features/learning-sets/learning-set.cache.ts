import { LearningSet } from "@/types/learning-set";
import { QueryClient } from "@tanstack/react-query";
import { LearningSetPage } from "./useLearningSet";

export const addLearningSetCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  newLearningSet: LearningSet,
  limit: number,
) => {
  const existingData = queryClient.getQueryData<LearningSetPage>(queryKey);

  if (!existingData) {
    queryClient.invalidateQueries({ queryKey });
    return;
  }

  const { total } = existingData.pagination;
  const newTotal = total + 1;
  const newTotalPages = Math.ceil(newTotal / limit);
  const currentPageIsFull = existingData.learningSets.length >= limit;

  const updatedLearningSets = currentPageIsFull
    ? [newLearningSet, ...existingData.learningSets.slice(0, limit - 1)]
    : [newLearningSet, ...existingData.learningSets];

  queryClient.setQueryData<LearningSetPage>(queryKey, {
    ...existingData,
    pagination: {
      ...existingData.pagination,
      total: newTotal,
      totalPages: newTotalPages,
    },
    learningSets: updatedLearningSets,
  });

  if (currentPageIsFull) {
    const baseKey = queryKey.slice(0, -1);
    queryClient.invalidateQueries({
      queryKey: baseKey,
      predicate: (query) => query.queryKey !== queryKey,
    });
  }
};

export const updateLearningSetCache = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  updatedLearningSet: Partial<LearningSet>,
) => {
  queryClient.setQueryData<LearningSetPage>(querykey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      learningSets: oldData.learningSets.map((learningSet) =>
        learningSet._id === updatedLearningSet._id
          ? {
              ...learningSet,
              ...updatedLearningSet,
            }
          : learningSet,
      ),
    };
  });
};

export const removeLearningSetCache = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  deletedLearningSetId: string,
) => {
  queryClient.setQueryData<LearningSetPage>(querykey, (oldData) => {
    if (!oldData) return oldData;

    const hasItem = oldData.learningSets.some(
      (d) => d._id === deletedLearningSetId,
    );
    const newTotal = oldData.pagination.total - 1;

    if (!hasItem) return oldData;

    return {
      ...oldData,
      pagination: {
        ...oldData.pagination,
        total: newTotal,
        totalPages: Math.ceil(newTotal / oldData.pagination.limit),
      },
      learningSets: hasItem
        ? oldData.learningSets.filter((d) => d._id !== deletedLearningSetId)
        : oldData.learningSets,
    };
  });
};

export const removeRelatedLearningSetByDocumentIdCache = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  deletedDocumentId: string,
) => {
  queryClient.setQueriesData<LearningSetPage>(
    { queryKey: querykey },
    (oldData) => {
      if (!oldData) return oldData;

      const removedCount = oldData.learningSets.filter(
        (d) => d.documentId === deletedDocumentId,
      ).length;

      if (removedCount === 0) return oldData;

      const newTotal = Math.max(oldData.pagination.total - removedCount, 0);

      return {
        ...oldData,
        pagination: {
          ...oldData.pagination,
          total: newTotal,
          totalPages: Math.ceil(newTotal / oldData.pagination.limit),
        },
        learningSets: oldData.learningSets.filter(
          (d) => d.documentId !== deletedDocumentId,
        ),
      };
    },
  );
};
