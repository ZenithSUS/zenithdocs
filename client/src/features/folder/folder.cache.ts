import { ResponseWithPagedData } from "@/types/api";
import { Folder } from "@/types/folder";
import { InfiniteData, QueryClient } from "@tanstack/react-query";

type FolderPage = ResponseWithPagedData<Folder, "folders">["data"];
type FolderInfiniteData = InfiniteData<FolderPage>;

export const updateInfiniteFolder = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  updatedFolder: Folder,
) => {
  queryClient.setQueryData<FolderInfiniteData>(querykey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        folders: page.folders.map((folder) =>
          folder._id === updatedFolder._id ? updatedFolder : folder,
        ),
      })),
    };
  });
};

export const removeInfiniteFolder = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  deletedId: string,
) => {
  queryClient.setQueryData<FolderInfiniteData>(querykey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        folders: page.folders.filter((folder) => folder._id !== deletedId),
      })),
    };
  });
};
