import { useQueryClient } from "@tanstack/react-query";
import { useUserScoreCreate } from "./useuserScoreCreate";
import { useUserScoreDelete } from "./useUserScoreDelete";

const useUserScore = (userId: string, learningSetId: string) => {
  const queryClient = useQueryClient();

  return {
    createUserScoreMutation: useUserScoreCreate(
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
