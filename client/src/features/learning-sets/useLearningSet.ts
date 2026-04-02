import fetchLimits from "@/constants/fetch-limits";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateLearningSet } from "./useLearningSetCreate";
import { useUpdateLearningSet } from "./useLearningSetUpdate";
import { useDeleteLearningSet } from "./useLearningSetDelete";
import { ResponseWithPagedData } from "@/types/api";
import { LearningSet } from "@/types/learning-set";

export type LearningSetPage = ResponseWithPagedData<
  LearningSet,
  "learningSets"
>["data"];

export type MutationContext = {
  previousLearningSets?: LearningSetPage | undefined;
};

export type UpdateVariables = {
  id: string;
  data: Partial<LearningSet>;
};

const useLearningSet = (userId: string) => {
  const queryClient = useQueryClient();

  return {
    createLearningSetMutation: useCreateLearningSet(queryClient, userId),
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
