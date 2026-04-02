import { LearningSet, LearningSetInput } from "@/types/learning-set";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { createLearningSet } from "./learning-set.api";
import { toast } from "sonner";
import { handleApiError } from "@/helpers/api-error";
import { addInfiniteLearningSet } from "./learning-set.cache";
import learningSetKeys from "./learning-set.keys";
import { AxiosError } from "@/types/api";

export const useCreateLearningSet = (
  queryClient: QueryClient,
  userId: string,
  learningSetLimit: number,
) =>
  useMutation<LearningSet, AxiosError, LearningSetInput>({
    mutationKey: learningSetKeys.create(),
    mutationFn: (data) => createLearningSet(data),
    onSuccess: (newLearningSet) => {
      addInfiniteLearningSet(
        queryClient,
        learningSetKeys.byUserPage(userId, learningSetLimit),
        newLearningSet,
      );
      toast.success("Learning set created successfully!");
    },
    onError: (err) => handleApiError(err, "Error creating learning set"),
  });
