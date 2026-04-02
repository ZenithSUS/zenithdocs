import { AxiosError } from "@/types/api";
import { GlobalChat } from "@/types/global-chat";
import { useQuery } from "@tanstack/react-query";
import globalChatKeys from "./global-chat.keys";
import { fetchGlobalChatByUser } from "./global-chat.api";

export const useGlobalChatByUser = (userId: string) =>
  useQuery<GlobalChat, AxiosError>({
    queryKey: globalChatKeys.byUserId(userId),
    queryFn: () => fetchGlobalChatByUser(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
