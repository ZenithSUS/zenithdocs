import { AxiosError } from "@/types/api";
import { UserScore } from "@/types/user-score";
import { useQuery } from "@tanstack/react-query";
import { getUserScoreByUserAndLearningSetId } from "./user-score.api";
import userScoreKeys from "./user-score.keys";

export const useUserScoreByUserAndLearningSet = (
  userId: string,
  learningSetId: string,
) =>
  useQuery<UserScore, AxiosError>({
    queryKey: userScoreKeys.byUserAndLearningSet(userId, learningSetId),
    queryFn: () => getUserScoreByUserAndLearningSetId(userId, learningSetId),
    enabled: !!userId && !!learningSetId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
