import { ResponseWithPagedData } from "@/types/api";
import { LearningSet } from "@/types/learning-set";
import { InfiniteData, QueryClient } from "@tanstack/react-query";

type LearningSetPage = ResponseWithPagedData<
  LearningSet,
  "learningSets"
>["data"];

type LearningSetsInfiniteData = InfiniteData<LearningSetPage>;

export const addInfiniteLearningSet = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  newLearningSet: LearningSet,
) => {
  queryClient.setQueryData<LearningSetsInfiniteData>(querykey, (oldData) => {
    if (!oldData) return undefined;

    const firstPage = oldData.pages[0];

    return {
      ...oldData,
      pages: [
        {
          ...firstPage,
          learningSets: [newLearningSet, ...firstPage.learningSets],
        },
        ...oldData.pages.slice(1),
      ],
    };
  });
};

export const updateInfiniteLearningSet = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  updatedLearningSet: Partial<LearningSet>,
) => {
  queryClient.setQueryData<LearningSetsInfiniteData>(querykey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        learningSets: page.learningSets.map((learningSet) =>
          learningSet._id === updatedLearningSet._id
            ? { ...learningSet, ...updatedLearningSet }
            : learningSet,
        ),
      })),
    };
  });
};

export const removeInfiniteLearningSet = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  deletedLearningSetId: string,
) => {
  queryClient.setQueryData<LearningSetsInfiniteData>(querykey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        learningSets: page.learningSets.filter(
          (learningSet) => learningSet._id !== deletedLearningSetId,
        ),
      })),
    };
  });
};
