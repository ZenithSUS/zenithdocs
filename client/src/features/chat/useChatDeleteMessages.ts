import { AxiosError } from "@/types/api";
import { Chat } from "@/types/chat";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { MutationContext } from "./useChat";
import chatKeys from "./chat.keys";
import { removeAllMessagesData } from "./chat.cache";
import { deleteChatMessages } from "./chat.api";

export const useChatDeleteMessages = (
  queryClient: QueryClient,
  userId: string,
) =>
  useMutation<
    Chat,
    AxiosError,
    { id: string; documentId: string },
    MutationContext
  >({
    mutationKey: chatKeys.delete(),
    mutationFn: ({ id }: { id: string }) => deleteChatMessages(id),
    onMutate: async ({ documentId }) => {
      const previousChat = queryClient.getQueryData<Chat>(
        chatKeys.byDocumentUser(documentId, userId),
      );

      await queryClient.cancelQueries({
        queryKey: chatKeys.byDocumentUser(documentId, userId),
      });

      removeAllMessagesData(
        queryClient,
        chatKeys.byDocumentUser(documentId, userId),
      );
      return { previousChat };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.byDocumentUser(variables.documentId, userId),
      });
      queryClient.invalidateQueries({
        queryKey: chatKeys.byId(userId),
      });
    },
  });
