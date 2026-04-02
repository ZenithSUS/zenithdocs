import { LearningSet } from "@/types/learning-set";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "@/types/api";
import { LearningSetsInfiniteData } from "./useLearningSetByUserPage";
import learningSetKeys from "./learning-set.keys";
import { updateLearningSet } from "./learning-set.api";
import { updateInfiniteLearningSet } from "./learning-set.cache";

type UpdateVariables = {
  id: string;
  data: Partial<LearningSet>;
};

type MutationContext = {
  previousLearningSets?: LearningSetsInfiniteData;
};

export const useUpdateLearningSet = (
  queryClient: QueryClient,
  userId: string,
  learningSetLimit: number,
) =>
  useMutation<LearningSet, AxiosError, UpdateVariables, MutationContext>({
    mutationKey: learningSetKeys.update(),
    mutationFn: ({ id, data }) => updateLearningSet(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: learningSetKeys.byUserPage(userId, learningSetLimit),
      });

      const previousLearningSets =
        queryClient.getQueryData<LearningSetsInfiniteData>(
          learningSetKeys.byUserPage(userId, learningSetLimit),
        );

      updateInfiniteLearningSet(
        queryClient,
        learningSetKeys.byUserPage(userId, learningSetLimit),
        { _id: id, ...data },
      );

      return { previousLearningSets };
    },
    onError: (_, __, context) => {
      if (context?.previousLearningSets) {
        queryClient.setQueryData(
          learningSetKeys.byUserPage(userId, learningSetLimit),
          context.previousLearningSets,
        );
      }
    },
    onSuccess: (updatedLearningSet) => {
      updateInfiniteLearningSet(
        queryClient,
        learningSetKeys.byUserPage(userId, learningSetLimit),
        updatedLearningSet,
      );

      queryClient.invalidateQueries({
        queryKey: learningSetKeys.byId(updatedLearningSet._id),
      });
    },
  });
