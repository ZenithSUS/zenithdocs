import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import learningSetKeys from "./learning-set.keys";
import { AxiosError, ResponseWithPagedData } from "@/types/api";
import { LearningSet } from "@/types/learning-set";
import { fetchLearningSetsByUserPaginated } from "./learning-set.api";
import fetchLimits from "@/constants/fetch-limits";

export type LearningSetPage = ResponseWithPagedData<
  LearningSet,
  "learningSets"
>["data"];

export type LearningSetsInfiniteData = InfiniteData<LearningSetPage>;

export const useLearningSetByUserPage = (userId: string) =>
  useInfiniteQuery<
    LearningSetPage,
    AxiosError,
    LearningSetsInfiniteData,
    ReturnType<typeof learningSetKeys.byUserPage>,
    number
  >({
    queryKey: learningSetKeys.byUserPage(userId, fetchLimits.learningSets),
    queryFn: ({ pageParam = 1 }) =>
      fetchLearningSetsByUserPaginated(
        userId,
        pageParam,
        fetchLimits.learningSets,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!userId,
  });
