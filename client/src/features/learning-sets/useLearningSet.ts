import fetchLimits from "@/constants/fetch-limits";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateLearningSet } from "./useLearningSetCreate";
import { useUpdateLearningSet } from "./useLearningSetUpdate";
import { useDeleteLearningSet } from "./useLearningSetDelete";

const useLearningSet = (userId: string) => {
  const queryClient = useQueryClient();

  return {
    createLearningSetMutation: useCreateLearningSet(
      queryClient,
      userId,
      fetchLimits.learningSets,
    ),
    updateLearningSetMutation: useUpdateLearningSet(
      queryClient,
      userId,
      fetchLimits.learningSets,
    ),
    deleteLearningSetMutation: useDeleteLearningSet(
      queryClient,
      userId,
      fetchLimits.learningSets,
    ),
  };
};

export default useLearningSet;
