import { LearningSet } from "@/types/learning-set";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "@/types/api";
import learningSetKeys from "./learning-set.keys";
import { updateLearningSet } from "./learning-set.api";
import {
  LearningSetPage,
  MutationContext,
  UpdateVariables,
} from "./useLearningSet";
import { updateLearningSetCache } from "./learning-set.cache";

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

      const previousLearningSets = queryClient.getQueryData<LearningSetPage>(
        learningSetKeys.byUserPage(userId, learningSetLimit),
      );

      updateLearningSetCache(queryClient, learningSetKeys.byUser(userId), {
        _id: id,
        ...data,
      });

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
      updateLearningSetCache(
        queryClient,
        learningSetKeys.byUser(userId),
        updatedLearningSet,
      );

      queryClient.invalidateQueries({
        queryKey: learningSetKeys.byId(updatedLearningSet._id),
      });
    },
  });
