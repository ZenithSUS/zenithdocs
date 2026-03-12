import { QueryClient } from "@tanstack/react-query";

// Wipe all global chat data across all pages
export const removeGlobalChatData = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) => {
  queryClient.removeQueries({ queryKey });
};
