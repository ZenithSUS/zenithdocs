import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { FolderPage } from "./useFolder";
import { AxiosError } from "@/types/api";
import folderKeys from "./folder.keys";
import { fetchFoldersByUserWithDocumentsPaginated } from "./folder.api";
import fetchLimits from "@/constants/fetch-limits";

export const useFolderByUserPage = (userId: string) =>
  useInfiniteQuery<
    FolderPage,
    AxiosError,
    InfiniteData<FolderPage>,
    ReturnType<typeof folderKeys.byUserPage>,
    number
  >({
    queryKey: folderKeys.byUserPage(userId, fetchLimits.folder),
    queryFn: ({ pageParam = 1 }) =>
      fetchFoldersByUserWithDocumentsPaginated(
        userId,
        pageParam,
        fetchLimits.folder,
      ),
    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!userId,
  });
