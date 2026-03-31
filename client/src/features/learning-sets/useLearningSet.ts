import { useCreateLearningSet } from "./useLearningSetCreate";
import { useUpdateLearningSet } from "./useLearningSetUpdate";
import { useDeleteLearningSet } from "./useLearningSetDelete";

const useLearningSet = (userId: string) => ({
  createLearningSetMutation: useCreateLearningSet(userId),
  updateLearningSetMutation: useUpdateLearningSet(userId),
  deleteLearningSetMutation: useDeleteLearningSet(userId),
});

export default useLearningSet;
