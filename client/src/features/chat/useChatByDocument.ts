import { AxiosError } from "@/types/api";
import { Chat } from "@/types/chat";
import { useQuery } from "@tanstack/react-query";
import chatKeys from "./chat.keys";
import { fetchChatByDocumentId } from "./chat.api";

export const useChatByDocument = (userId: string, documentId: string) => {
  return useQuery<Chat, AxiosError>({
    queryKey: chatKeys.byDocumentUser(documentId, userId),
    queryFn: () => fetchChatByDocumentId(documentId),
    enabled: !!documentId && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
