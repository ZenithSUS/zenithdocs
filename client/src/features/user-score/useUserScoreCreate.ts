import { AxiosError } from "@/types/api";
import { UserScore, UserScoreInput } from "@/types/user-score";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { createUserScore } from "./user-score.api";
import { addUserScoreCache } from "./user-score.cache";
import userScoreKeys from "./user-score.keys";

export const useUserScoreCreate = (
  queryClient: QueryClient,
  userId: string,
  learningSetId: string,
) =>
  useMutation<UserScore, AxiosError, UserScoreInput>({
    mutationKey: userScoreKeys.create(),
    mutationFn: (data) => createUserScore(data),
    onSuccess: (newUserScore) => {
      addUserScoreCache(
        queryClient,
        userScoreKeys.byUserAndLearningSet(userId, learningSetId),
        newUserScore,
      );
    },
  });
