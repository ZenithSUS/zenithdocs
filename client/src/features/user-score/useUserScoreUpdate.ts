import { AxiosError } from "@/types/api";
import { UserScore, UserScoreInput } from "@/types/user-score";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { updateUserScoreCache } from "./user-score.cache";
import { updateUserScore } from "./user-score.api";
import userScoreKeys from "./user-score.keys";

export const useUserScoreUpdate = (
  queryClient: QueryClient,
  userId: string,
  learningSetId: string,
) =>
  useMutation<UserScore, AxiosError, Partial<UserScoreInput>>({
    mutationKey: userScoreKeys.update(),
    mutationFn: (data) => updateUserScore(userId, data),
    onSuccess: (updatedUserScore) => {
      updateUserScoreCache(
        queryClient,
        userScoreKeys.byId(userId),
        updatedUserScore,
      );
      updateUserScoreCache(
        queryClient,
        userScoreKeys.byUserAndLearningSet(userId, learningSetId),
        updatedUserScore,
      );
    },
  });
