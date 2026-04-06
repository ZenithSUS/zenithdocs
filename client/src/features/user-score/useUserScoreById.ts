import { AxiosError } from "@/types/api";
import { UserScore } from "@/types/user-score";
import { useQuery } from "@tanstack/react-query";
import { getUserScoreById } from "./user-score.api";
import userScoreKeys from "./user-score.keys";

export const useUserScoreById = (id: string) =>
  useQuery<UserScore, AxiosError>({
    queryKey: userScoreKeys.byId(id),
    queryFn: () => getUserScoreById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
