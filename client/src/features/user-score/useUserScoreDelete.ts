import { AxiosError } from "@/types/api";
import { UserScore } from "@/types/user-score";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { deleteUserScore } from "./user-score.api";
import { removeUserScoreCache } from "./user-score.cache";

export const useUserScoreDelete = (
  queryClient: QueryClient,
  userId: string,
  learningSetId: string,
) =>
  useMutation<UserScore, AxiosError, string>({
    mutationKey: userScoreKeys.delete(),
    mutationFn: (id) => deleteUserScore(id),
    onSuccess: (_, deletedId) => {
      removeUserScoreCache(queryClient, userScoreKeys.byId(deletedId));
      removeUserScoreCache(
        queryClient,
        userScoreKeys.byUserAndLearningSet(userId, learningSetId),
      );
    },
  });
