import { AxiosError } from "@/types/api";
import { GlobalChat } from "@/types/global-chat";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { MutationContext } from "./useGlobalChat";
import { deleteGlobalChatByUser } from "./global-chat.api";
import { removeGlobalChatData } from "./global-chat.cache";
import globalChatKeys from "./global-chat.keys";

export const useGlobalChatDelete = (queryClient: QueryClient, userId: string) =>
  useMutation<GlobalChat, AxiosError, string, MutationContext>({
    mutationKey: globalChatKeys.delete(),
    mutationFn: (id) => deleteGlobalChatByUser(id),
    onMutate: async (id) => {
      const previousGlobalChat = queryClient.getQueryData<GlobalChat>(
        globalChatKeys.byUserId(id),
      );

      await queryClient.cancelQueries({
        queryKey: globalChatKeys.byUserId(id),
      });
      removeGlobalChatData(queryClient, globalChatKeys.byUserId(userId));

      return { previousGlobalChat };
    },
    onError: (_, __, context) => {
      if (context?.previousGlobalChat) {
        queryClient.setQueryData<GlobalChat>(
          globalChatKeys.byUserId(userId),
          context.previousGlobalChat,
        );
      }
    },
    onSuccess: ({ userId }) => {
      queryClient.invalidateQueries({
        queryKey: globalChatKeys.byUserId(userId),
      });
    },
  });
