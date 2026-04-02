import { AxiosError } from "@/types/api";
import { GlobalMessage } from "@/types/global-message";
import { QueryClient, useMutation } from "@tanstack/react-query";
import globalMessageKeys from "./global-message.keys";
import { deleteGlobalMessagesByChatId } from "./global-message.api";
import { clearGlobalMessages } from "./global-message.cache";

export const useGlobalMessageDelete = (
  queryClient: QueryClient,
  chatId: string,
) =>
  useMutation<GlobalMessage, AxiosError, string>({
    mutationKey: globalMessageKeys.delete(),
    mutationFn: deleteGlobalMessagesByChatId,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({
        queryKey: globalMessageKeys.byChatPage(deletedId),
      });

      clearGlobalMessages(queryClient, globalMessageKeys.byChatPage(chatId));
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: globalMessageKeys.byChatPage(chatId),
      }),
  });
