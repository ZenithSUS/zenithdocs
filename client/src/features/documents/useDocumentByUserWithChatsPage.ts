import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import {
  DocumentsWithChatInfiniteData,
  DocumentWithChatPage,
} from "./useDocument";
import { AxiosError } from "@/types/api";
import documentKeys from "./document.keys";
import { fetchDocumentByUserWithChatsPaginated } from "./document.api";
import fetchLimits from "@/constants/fetch-limits";

export const useDocumentByUserWithChatsPage = (userId: string) =>
  useInfiniteQuery<
    DocumentWithChatPage,
    AxiosError,
    DocumentsWithChatInfiniteData,
    ReturnType<typeof documentKeys.byUserWithChatPage>,
    number
  >({
    queryKey: documentKeys.byUserWithChatPage(userId),
    queryFn: ({ pageParam = 1 }) =>
      fetchDocumentByUserWithChatsPaginated(
        userId,
        pageParam,
        fetchLimits.document,
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
        documents: page.documents.sort((a, b) => {
          const dateA = new Date(a.chat?.lastMessage?.createdAt || a.createdAt);
          const dateB = new Date(b.chat?.lastMessage?.createdAt || b.createdAt);
          return dateB.getTime() - dateA.getTime();
        }),
      })),
    }),
    enabled: !!userId,
  });
