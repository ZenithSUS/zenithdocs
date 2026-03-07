import { Chat } from "@/types/chat";
import { QueryClient } from "@tanstack/react-query";

export const removeAllMessagesData = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) => {
  queryClient.setQueryData<Chat>(queryKey, (oldData) => {
    if (!oldData) return oldData;
    return { ...oldData, messages: [] };
  });
};
