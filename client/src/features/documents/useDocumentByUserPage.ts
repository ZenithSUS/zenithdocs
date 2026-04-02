import { useInfiniteQuery } from "@tanstack/react-query";
import { DocumentPage, DocumentsInfiniteData } from "./useDocument";
import { AxiosError } from "@/types/api";
import documentKeys from "./document.keys";
import { fetchDocumentByUserPaginated } from "./document.api";
import fetchLimits from "@/constants/fetch-limits";

export const useDocumentByUserPage = (userId: string) =>
  useInfiniteQuery<
    DocumentPage,
    AxiosError,
    DocumentsInfiniteData,
    ReturnType<typeof documentKeys.byUserPage>,
    number
  >({
    queryKey: documentKeys.byUserPage(userId, fetchLimits.document),
    queryFn: ({ pageParam = 1 }) =>
      fetchDocumentByUserPaginated(userId, pageParam, fetchLimits.document),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!userId,
  });
