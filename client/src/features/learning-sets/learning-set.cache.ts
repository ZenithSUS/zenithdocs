import { LearningSet } from "@/types/learning-set";
import { QueryClient } from "@tanstack/react-query";
import { LearningSetPage } from "./useLearningSet";

export const addLearningSetCache = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  newLearningSet: LearningSet,
) => {
  queryClient.setQueriesData<LearningSetPage>(
    { queryKey: querykey },
    (oldData) => {
      if (!oldData) return undefined;

      const isPageOne = oldData.pagination.page === 1;
      const newTotal = isPageOne ? 1 : oldData.pagination.total + 1;
      const newTotalPages = isPageOne
        ? 1
        : Math.ceil(newTotal / oldData.pagination.limit);

      return {
        ...oldData,
        // Add pagination if the current page or learningSets is empty
        pagination: {
          ...oldData.pagination,
          total: newTotal,
          totalPages: newTotalPages,
        },
        learningSets: isPageOne
          ? [newLearningSet, ...oldData.learningSets]
          : oldData.learningSets,
      };
    },
  );
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
