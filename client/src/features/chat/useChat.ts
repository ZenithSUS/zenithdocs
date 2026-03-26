import {
  useQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Chat, MessageInput, PublicMessageInput } from "@/types/chat";
import {
  createChat,
  createChatStream,
  createPublicChatStream,
  deleteChatMessages,
  fetchChatByDocumentId,
  fetchChatByUserPaginated,
  initChatForDocument,
} from "./chat.api";
import chatKeys from "./chat.keys";
import { useCallback } from "react";
import { AxiosError } from "axios";
import { ResponseWithData, ResponseWithPagedData } from "@/types/api";
import { removeAllMessagesData } from "./chat.cache";

type ChatPage = ResponseWithPagedData<Chat, "chats">["data"];
type ChatInfiniteData = InfiniteData<ChatPage>;

type MutationContext = {
  previousChat?: ResponseWithData<Chat>["data"];
};

const useChat = (userId: string) => {
  const queryClient = useQueryClient();
  const chatLimit = 10;

  // Initialize Chat for document
  const initChatDocument = (documentId: string) => {
    return useQuery<Chat, AxiosError>({
      queryKey: chatKeys.initChatDocument(documentId),
      queryFn: () => initChatForDocument(documentId),
      enabled: !!documentId && !!userId,
    });
  };

  // Get chat by document ID
  const chatByDocument = (documentId: string) => {
    return useQuery<Chat, AxiosError>({
      queryKey: chatKeys.byDocumentUser(documentId, userId),
      queryFn: () => fetchChatByDocumentId(documentId),
      enabled: !!documentId && !!userId,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  const chatByUserPage = useInfiniteQuery<
    ChatPage,
    AxiosError,
    ChatInfiniteData,
    ReturnType<typeof chatKeys.byUserPage>,
    number
  >({
    queryKey: chatKeys.byUserPage(userId),
    queryFn: ({ pageParam = 1 }) =>
      fetchChatByUserPaginated(userId, pageParam, chatLimit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!userId,
  });

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
    chatByUserPage,
    initChatDocument,
    chatByDocument,
    sendMessageStream,
    sendPublicMessageStream,
  };
};

export default useChat;
