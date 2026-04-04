import { AxiosError } from "@/types/api";
import { LearningSet } from "@/types/learning-set";
import { QueryClient, useMutation } from "@tanstack/react-query";
import learningSetKeys from "./learning-set.keys";
import { deleteLearningSet } from "./learning-set.api";
import { LearningSetPage, MutationContext } from "./useLearningSet";
import { removeLearningSetCache } from "./learning-set.cache";

export const useDeleteLearningSet = (
  queryClient: QueryClient,
  userId: string,
  page: number,
) =>
  useMutation<LearningSet, AxiosError, string, MutationContext>({
    mutationKey: learningSetKeys.delete(),
    mutationFn: (id) => deleteLearningSet(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({
        queryKey: learningSetKeys.byUserPage(userId, page),
      });

      const previousLearningSets = queryClient.getQueryData<LearningSetPage>(
        learningSetKeys.byUserPage(userId, page),
      );

      removeLearningSetCache(
        queryClient,
        learningSetKeys.byUser(userId),
        deletedId,
      );

      return { previousLearningSets };
    },
    onError: (_, __, context) => {
      if (context?.previousLearningSets) {
        queryClient.invalidateQueries({
          queryKey: learningSetKeys.byUser(userId),
        });
      }
    },
    onSuccess: (deletedLearningSet) => {
      removeLearningSetCache(
        queryClient,
        learningSetKeys.byUserPage(userId, page),
        deletedLearningSet._id,
      );

      queryClient.removeQueries({
        queryKey: learningSetKeys.byId(deletedLearningSet._id),
      });
    },
  });
