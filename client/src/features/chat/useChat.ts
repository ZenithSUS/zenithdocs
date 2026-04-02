import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { Chat, MessageInput, PublicMessageInput } from "@/types/chat";
import {
  createChat,
  createChatStream,
  createPublicChatStream,
} from "./chat.api";
import chatKeys from "./chat.keys";
import { useCallback } from "react";
import { AxiosError } from "@/types/api";
import { ResponseWithData, ResponseWithPagedData } from "@/types/api";
import { useChatDeleteMessages } from "./useChatDeleteMessages";

export type ChatPage = ResponseWithPagedData<Chat, "chats">["data"];
export type ChatInfiniteData = InfiniteData<ChatPage>;

export type MutationContext = {
  previousChat?: ResponseWithData<Chat>["data"];
};

const useChat = (userId: string) => {
  const queryClient = useQueryClient();

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
      setConfidence: (confidence: number) => void,
    ) => {
      return createChatStream(
        input,
        onChunk,
        () => {
          queryClient.invalidateQueries({
            queryKey: chatKeys.byDocumentUser(input.documentId, userId),
          });
          queryClient.invalidateQueries({
            queryKey: chatKeys.byId(userId),
          });
          onDone();
        },
        setConfidence,
      );
    },
    [],
  );

  const sendPublicMessageStream = useCallback(
    (
      input: PublicMessageInput,
      onChunk: (chunk: string) => void,
      onDone: () => void,
      setConfidence: (confidence: number) => void,
    ) => createPublicChatStream(input, onChunk, onDone, setConfidence),
    [],
  );

  return {
    deleteChatMessagesMutation: useChatDeleteMessages(queryClient, userId),
    sendMessage,
    sendMessageStream,
    sendPublicMessageStream,
  };
};

export default useChat;
