import { useQueryClient } from "@tanstack/react-query";
import { useUserScoreCreate } from "./useUserScoreCreate";
import { useUserScoreDelete } from "./useUserScoreDelete";
import { useUserScoreUpdate } from "./useUserScoreUpdate";
import { UserScoreInput } from "@/types/user-score";

export interface UpdateVariables {
  id: string;
  data: Partial<UserScoreInput>;
}

const useUserScore = (userId: string, learningSetId: string) => {
  const queryClient = useQueryClient();

  return {
    createUserScoreMutation: useUserScoreCreate(
      queryClient,
      userId,
      learningSetId,
    ),
    updateUserScoreMutation: useUserScoreUpdate(
      queryClient,
      userId,
      learningSetId,
    ),
    deleteUserScoreMutation: useUserScoreDelete(
      queryClient,
      userId,
      learningSetId,
    ),
  };
};

export default useUserScore;
