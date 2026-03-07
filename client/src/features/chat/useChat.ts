import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Chat, MessageInput } from "@/types/chat";
import {
  createChat,
  createChatStream,
  deleteChatMessages,
  fetchChatByDocumentId,
} from "./chat.api";
import chatKeys from "./chat.keys";
import { useCallback } from "react";
import { AxiosError } from "axios";
import { ResponseWithData } from "@/types/api";
import { removeAllMessagesData } from "./chat.cache";

type MutationContext = {
  previousChat?: ResponseWithData<Chat>["data"];
};

const useChat = (userId: string) => {
  const queryClient = useQueryClient();

  // Get chat by document ID
  const chatByDocument = (documentId: string) => {
    return useQuery<Chat, AxiosError>({
      queryKey: chatKeys.byDocumentUser(documentId, userId),
      queryFn: () => fetchChatByDocumentId(documentId),
      enabled: !!documentId && !!userId,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Send message mutation
  const sendMessage = useMutation<Chat, AxiosError, MessageInput>({
    mutationFn: (input: MessageInput) => createChat(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.byDocumentUser(variables.documentId, userId),
      });
      queryClient.invalidateQueries({
        queryKey: chatKeys.byId(userId),
      });
    },
  });

  const sendMessageStream = useCallback(
    (
      input: MessageInput,
      onChunk: (chunk: string) => void,
      onDone: () => void,
    ) => {
      return createChatStream(input, onChunk, () => {
        queryClient.invalidateQueries({
          queryKey: chatKeys.byDocumentUser(input.documentId, userId),
        });
        queryClient.invalidateQueries({
          queryKey: chatKeys.byId(userId),
        });
        onDone();
      });
    },
    [],
  );

  const deleteChatMessagesMutation = useMutation<
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

  return {
    sendMessage,
    deleteChatMessagesMutation,
    chatByDocument,
    sendMessageStream,
  };
};

export default useChat;
