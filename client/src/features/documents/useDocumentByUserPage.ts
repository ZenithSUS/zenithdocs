import { useInfiniteQuery } from "@tanstack/react-query";
import { DocumentPage, DocumentsInfiniteData } from "./useDocument";
import { AxiosError } from "@/types/api";
import documentKeys from "./document.keys";
import { fetchDocumentByUserPaginated } from "./document.api";

export const useDocumentByUserPage = (userId: string) => {
  const documentLimit = 10;

  return useInfiniteQuery<
    DocumentPage,
    AxiosError,
    DocumentsInfiniteData,
    ReturnType<typeof documentKeys.byUserPage>,
    number
  >({
    queryKey: documentKeys.byUserPage(userId, documentLimit),
    queryFn: ({ pageParam = 1 }) =>
      fetchDocumentByUserPaginated(userId, pageParam, documentLimit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!userId,
  });
};
