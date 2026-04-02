import { useInfiniteQuery } from "@tanstack/react-query";
import {
  GlobalMessageInfiniteData,
  GlobalMessagePage,
} from "./useGlobalMessage";
import { AxiosError } from "@/types/api";
import globalMessageKeys from "./global-message.keys";
import { fetchGlobalMessagesByChatIdPaginated } from "./global-message.api";
import fetchLimits from "@/constants/fetch-limits";

export const useGlobalMessageByChatPage = (chatId: string) =>
  useInfiniteQuery<
    GlobalMessagePage,
    AxiosError,
    GlobalMessageInfiniteData,
    ReturnType<typeof globalMessageKeys.byChatPage>,
    number
  >({
    queryKey: globalMessageKeys.byChatPage(chatId),
    queryFn: ({ pageParam = 1 }) =>
      fetchGlobalMessagesByChatIdPaginated(
        chatId,
        pageParam,
        fetchLimits.globalMessage,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        globalMessages: [...page.globalMessages].reverse(),
      })),
    }),
    enabled: !!chatId,
  });
