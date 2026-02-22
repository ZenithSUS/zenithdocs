import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import documentKeys from "./document.keys";
import { getDocumentById, getDocumentByUserPaginated } from "./document.api";
import { AxiosError } from "axios";
import { ResponseWithPagedData } from "@/types/api";
import Doc from "@/types/doc";

type DocumentPage = ResponseWithPagedData<Doc, "documents">["data"];

const useDocument = (userId: string, id: string) => {
  // Get documents by user ID paginated
  const documentsByUserPage = useInfiniteQuery<
    DocumentPage,
    AxiosError,
    DocumentPage,
    ReturnType<typeof documentKeys.byUserPage>,
    number
  >({
    queryKey: documentKeys.byUserPage(userId, 10),
    queryFn: ({ pageParam = 1 }) =>
      getDocumentByUserPaginated(userId, pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!userId,
  });

  // Get document by ID
  const documentById = useQuery<Doc, AxiosError>({
    queryKey: documentKeys.byId(id),
    queryFn: () => getDocumentById(id),
    enabled: !!id,
  });

  return { documentsByUserPage, documentById };
};

export default useDocument;
