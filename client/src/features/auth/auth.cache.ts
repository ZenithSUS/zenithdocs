import { QueryClient } from "@tanstack/react-query";

export const removeAuth = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) => {
  queryClient.removeQueries({ queryKey });
};
