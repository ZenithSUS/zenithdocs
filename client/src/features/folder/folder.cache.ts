import { Folder, FolderWithDocuments } from "@/types/folder";
import { QueryClient } from "@tanstack/react-query";
import { FoldersInfiniteData } from "./useFolder";

export const addInfiniteFolder = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  newFolder: Folder,
) => {
  queryClient.setQueryData<FoldersInfiniteData>(querykey, (oldData) => {
    if (!oldData) return oldData;

    const firstPage = oldData.pages[0];

    // Initialize the new folder with empty documents and counts
    const initialFolderWithDocs: FolderWithDocuments = {
      ...newFolder,
      documents: [],
      documentCount: 0,
      completedCount: 0,
      uploadedCount: 0,
      processingCount: 0,
      failedCount: 0,
    };

    return {
      ...oldData,
      pages: [
        {
          ...firstPage,
          folders: [initialFolderWithDocs, ...firstPage.folders],
        },
        ...oldData.pages.slice(1),
      ],
    };
  });
};

export const updateInfiniteFolder = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  updatedFolder: Folder,
) => {
  queryClient.setQueryData<FoldersInfiniteData>(querykey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        folders: page.folders.map((folder) =>
          folder._id === updatedFolder._id
            ? { ...folder, ...updatedFolder }
            : folder,
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
  queryClient.setQueryData<FoldersInfiniteData>(querykey, (oldData) => {
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
