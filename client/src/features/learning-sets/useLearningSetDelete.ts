import { AxiosError } from "@/types/api";
import { LearningSet } from "@/types/learning-set";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { LearningSetsInfiniteData } from "./useLearningSetByUserPage";
import learningSetKeys from "./learning-set.keys";
import { deleteLearningSet } from "./learning-set.api";
import { removeInfiniteLearningSet } from "./learning-set.cache";

type MutationContext = {
  previousLearningSets?: LearningSetsInfiniteData;
};

export const useDeleteLearningSet = (
  queryClient: QueryClient,
  userId: string,
  learningSetLimit: number,
) =>
  useMutation<LearningSet, AxiosError, string, MutationContext>({
    mutationKey: learningSetKeys.delete(),
    mutationFn: (id) => deleteLearningSet(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: learningSetKeys.byUserPage(userId, learningSetLimit),
      });

      const previousLearningSets =
        queryClient.getQueryData<LearningSetsInfiniteData>(
          learningSetKeys.byUserPage(userId, learningSetLimit),
        );

      removeInfiniteLearningSet(
        queryClient,
        learningSetKeys.byUserPage(userId, learningSetLimit),
        id,
      );

      return { previousLearningSets };
    },
    onError: (_, __, context) => {
      if (context?.previousLearningSets) {
        queryClient.setQueryData<LearningSetsInfiniteData>(
          learningSetKeys.byUserPage(userId, learningSetLimit),
          context.previousLearningSets,
        );
      }
    },
    onSuccess: (deletedLearningSet) => {
      removeInfiniteLearningSet(
        queryClient,
        learningSetKeys.byUserPage(userId, learningSetLimit),
        deletedLearningSet._id,
      );

      queryClient.removeQueries({
        queryKey: learningSetKeys.byId(deletedLearningSet._id),
      });
    },
  });
