import { GlobalChat } from "@/types/global-chat";
import { useQueryClient } from "@tanstack/react-query";
import { createGlobalChatStream } from "./global-chat.api";
import { useCallback } from "react";
import { useGlobalChatDelete } from "./useGlobalChatDelete";

export type MutationContext = {
  previousGlobalChat?: GlobalChat;
};

const useGlobalChat = (userId: string) => {
  const queryClient = useQueryClient();

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

  return {
    sendGlobalMessageStream,
    deleteGlobalChatByUserMutation: useGlobalChatDelete(queryClient, userId),
  };
};

export default useGlobalChat;
