import { AxiosError } from "@/types/api";
import { GlobalChat } from "@/types/global-chat";
import { useQuery } from "@tanstack/react-query";
import globalChatKeys from "./global-chat.keys";
import { initGlobalChatForUser } from "./global-chat.api";

export const useGlobalChatInit = (userId: string) =>
  useQuery<GlobalChat, AxiosError>({
    queryKey: globalChatKeys.init(),
    queryFn: initGlobalChatForUser,
    enabled: !!userId,
  });
