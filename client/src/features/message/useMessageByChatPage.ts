import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { MessagePage } from "./useMessage";
import { AxiosError } from "@/types/api";
import messageKeys from "./message.keys";
import { fetchMessagesByChatIdPaginated } from "./message.api";
import fetchLimits from "@/constants/fetch-limits";

export const useMessageByChatPage = (chatId: string) =>
  useInfiniteQuery<
    MessagePage,
    AxiosError,
    InfiniteData<MessagePage>,
    ReturnType<typeof messageKeys.byChat>,
    number
  >({
    queryKey: messageKeys.byChat(chatId),
    queryFn: ({ pageParam = 1 }) =>
      fetchMessagesByChatIdPaginated(chatId, pageParam, fetchLimits.message),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        messages: [...page.messages].reverse(),
      })),
    }),
    enabled: !!chatId,
  });
