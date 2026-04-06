import { AxiosError } from "@/types/api";
import { UserScore } from "@/types/user-score";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { deleteUserScore } from "./user-score.api";
import { removeUserScoreCache } from "./user-score.cache";
import userScoreKeys from "./user-score.keys";
import { MutationContext } from "./useUserScore";

export const useUserScoreDelete = (
  queryClient: QueryClient,
  userId: string,
  learningSetId: string,
) =>
  useMutation<UserScore, AxiosError, string, MutationContext>({
    mutationKey: userScoreKeys.delete(),
    mutationFn: (id) => deleteUserScore(id),
    onMutate: async (deletedId) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: userScoreKeys.byUserAndLearningSet(userId, learningSetId),
        }),
        queryClient.cancelQueries({ queryKey: userScoreKeys.byId(deletedId) }),
      ]);

      const previousUserScore = queryClient.getQueryData<UserScore>(
        userScoreKeys.byUserAndLearningSet(userId, learningSetId),
      );

      return { previousUserScore };
    },
    onError: (_, __, context) => {
      if (context?.previousUserScore) {
        queryClient.setQueryData<UserScore>(
          userScoreKeys.byUserAndLearningSet(userId, learningSetId),
          context.previousUserScore,
        );
      }
    },
    onSuccess: (_, deletedId) => {
      removeUserScoreCache(
        queryClient,
        userScoreKeys.byId(deletedId),
        userScoreKeys.byUserAndLearningSet(userId, learningSetId),
      );
    },
  });
