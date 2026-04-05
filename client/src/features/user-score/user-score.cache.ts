import { UserScore } from "@/types/user-score";
import { QueryClient } from "@tanstack/react-query";

export const addUserScoreCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  data: UserScore,
) => {
  queryClient.setQueryData<UserScore>(queryKey, (oldData) => {
    if (!oldData) return data;
    return data;
  });
};

export const updateUserScoreCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  data: UserScore,
) => {
  queryClient.setQueryData<UserScore>(queryKey, (oldData) => {
    if (!oldData) return data;

    return { ...oldData, ...data };
  });
};

export const removeUserScoreCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) => {
  queryClient.removeQueries({ queryKey });
};
