import { AxiosError } from "@/types/api";
import { Folder } from "@/types/folder";
import { QueryClient, useMutation } from "@tanstack/react-query";
import {
  FoldersInfiniteData,
  MutateContext,
  UpdateVariables,
} from "./useFolder";
import folderKeys from "./folder.keys";
import { updateFolderById } from "./folder.api";
import { updateInfiniteFolder } from "./folder.cache";

export const useFolderUpdate = (
  queryClient: QueryClient,
  userId: string,
  folderLimit: number,
) =>
  useMutation<Folder, AxiosError, UpdateVariables, MutateContext>({
    mutationKey: folderKeys.update(),
    mutationFn: ({ id, data }: UpdateVariables) => updateFolderById(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: folderKeys.byId(id),
      });

      const previousFolder = queryClient.getQueryData<FoldersInfiniteData>(
        folderKeys.byUserPage(userId, folderLimit),
      );

      if (previousFolder) {
        queryClient.setQueryData<FoldersInfiniteData>(
          folderKeys.byUserPage(userId, folderLimit),
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                folders: page.folders.map((folder) =>
                  folder._id === id ? { ...folder, ...data } : folder,
                ),
              })),
            };
          },
        );
      }

      return { previousFolder };
    },
    onError: (_, __, context) => {
      if (context?.previousFolder) {
        queryClient.setQueryData(
          folderKeys.byUserPage(userId, folderLimit),
          context.previousFolder,
        );
      }
    },
    onSuccess: (updatedFolder) => {
      updateInfiniteFolder(
        queryClient,
        folderKeys.byUserPage(userId, folderLimit),
        updatedFolder,
      );

      queryClient.setQueryData(
        folderKeys.byId(updatedFolder._id),
        updatedFolder,
      );
    },
  });
