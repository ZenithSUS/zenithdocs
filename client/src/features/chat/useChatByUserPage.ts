import { useInfiniteQuery } from "@tanstack/react-query";
import { ChatInfiniteData, ChatPage } from "./useChat";
import { AxiosError } from "@/types/api";
import chatKeys from "./chat.keys";
import { fetchChatByUserPaginated } from "./chat.api";

export const useChatByUserPage = (userId: string, chatLimit: number) =>
  useInfiniteQuery<
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
