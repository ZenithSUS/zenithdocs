import { useQuery } from "@tanstack/react-query";
import learningSetKeys from "./learning-set.keys";
import { AxiosError, ResponseWithPagedData } from "@/types/api";
import { fetchLearningSetsByUserPaginated } from "./learning-set.api";
import fetchLimits from "@/constants/fetch-limits";
import { LearningSetPage } from "./useLearningSet";

export const useLearningSetByUserPage = (userId: string, page: number = 1) =>
  useQuery<LearningSetPage, AxiosError>({
    queryKey: learningSetKeys.byUserPage(userId, page),
    queryFn: () =>
      fetchLearningSetsByUserPaginated(userId, page, fetchLimits.learningSets),

    enabled: !!userId,
  });
