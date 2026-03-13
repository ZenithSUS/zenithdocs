import { AxiosError } from "@/types/api";
import { GlobalChat } from "@/types/global-chat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import globalChatKeys from "./global-chat.keys";
import {
  createGlobalChatStream,
  deleteGlobalChatByUser,
  fetchGlobalChatByUser,
  initGlobalChatForUser,
} from "./global-chat.api";
import { useCallback } from "react";
import { removeGlobalChatData } from "./global-chat.cache";

type MutationContext = {
  previousGlobalChat?: GlobalChat;
};

const useGlobalChat = (userId: string) => {
  const queryClient = useQueryClient();

  // Initialize global chat
  const initGlobalChat = useQuery<GlobalChat, AxiosError>({
    queryKey: globalChatKeys.init(),
    queryFn: initGlobalChatForUser,
    enabled: !!userId,
  });

  // Get global chat by user ID
  const globalChatByUser = useQuery<GlobalChat, AxiosError>({
    queryKey: globalChatKeys.byUserId(userId),
    queryFn: () => fetchGlobalChatByUser(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Send global chat message
  const sendGlobalMessageStream = useCallback(
    async (
      input: string,
      onChunk: (chunk: string) => void,
      onDone: () => void,
      setConfidence: (confidence: number) => void,
    ) => {
      return await createGlobalChatStream(
        input,
        onChunk,
        onDone,
        setConfidence,
      );
    },
    [],
  );

  const deleteGlobalChatByUserMutation = useMutation<
    GlobalChat,
    AxiosError,
    string,
    MutationContext
  >({
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

  return {
    initGlobalChat,
    globalChatByUser,
    sendGlobalMessageStream,
    deleteGlobalChatByUserMutation,
  };
};

export default useGlobalChat;
