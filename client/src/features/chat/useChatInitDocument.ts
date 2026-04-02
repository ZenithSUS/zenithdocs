import { AxiosError } from "@/types/api";
import { Chat } from "@/types/chat";
import { useQuery } from "@tanstack/react-query";
import { initChatForDocument } from "./chat.api";
import chatKeys from "./chat.keys";

export const useChatInitDocument = (userId: string, documentId: string) => {
  return useQuery<Chat, AxiosError>({
    queryKey: chatKeys.initChatDocument(documentId),
    queryFn: () => initChatForDocument(documentId),
    enabled: !!documentId && !!userId,
  });
};
