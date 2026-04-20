import { GlobalChat } from "@/types/global-chat";
import { useQueryClient } from "@tanstack/react-query";
import { createGlobalChatStream } from "./global-chat.api";
import { useGlobalChatDelete } from "./useGlobalChatDelete";

export type MutationContext = {
  previousGlobalChat?: GlobalChat;
};

const useGlobalChat = (userId: string) => {
  const queryClient = useQueryClient();

  // Send global chat message
  const sendGlobalMessageStream = async (
    input: string,
    onChunk: (chunk: string) => void,
    onDone: () => void,
    setConfidence: (confidence: number) => void,
    signal?: AbortSignal,
  ) =>
    await createGlobalChatStream(input, onChunk, onDone, setConfidence, signal);

  return {
    sendGlobalMessageStream,
    deleteGlobalChatByUserMutation: useGlobalChatDelete(queryClient, userId),
  };
};

export default useGlobalChat;
