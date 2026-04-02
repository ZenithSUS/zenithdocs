import { AxiosError } from "@/types/api";
import { Message } from "@/types/message";
import messageKeys from "./message.keys";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { deleteMessagesByChatId } from "./message.api";
import { clearMessagesCache } from "./message.cache";
import { useMessageByChatPage } from "./useMessageByChatPage";

export const useMessageDelete = (queryClient: QueryClient, chatId: string) =>
  useMutation<Message, AxiosError, string>({
    mutationKey: messageKeys.deleteByChatId(chatId),
    mutationFn: () => deleteMessagesByChatId(chatId),
    onMutate: () => {
      // Optimistically wipe cache immediately on delete
      clearMessagesCache(queryClient, messageKeys.byChat(chatId));
    },
    onError: () => {
      useMessageByChatPage(chatId).refetch();
    },
  });
