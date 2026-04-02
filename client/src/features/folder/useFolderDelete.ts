import { AxiosError } from "@/types/api";
import { Folder } from "@/types/folder";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { FoldersInfiniteData, MutateContext } from "./useFolder";
import folderKeys from "./folder.keys";
import { deleteFolderById } from "./folder.api";
import { removeInfiniteFolder } from "./folder.cache";
import { removeDocumentFolderInfiniteDocument } from "../documents/document.cache";
import documentKeys from "../documents/document.keys";

export const useFolderDelete = (
  queryClient: QueryClient,
  userId: string,
  folderLimit: number,
) =>
  useMutation<Folder, AxiosError, string, MutateContext>({
    mutationKey: folderKeys.delete(),
    mutationFn: (id) => deleteFolderById(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({
        queryKey: folderKeys.byId(deletedId),
      });

      removeInfiniteFolder(
        queryClient,
        folderKeys.byUserPage(userId, folderLimit),
        deletedId,
      );

      removeDocumentFolderInfiniteDocument(
        queryClient,
        documentKeys.byUserPage(userId, folderLimit),
        deletedId,
      );

      const previousFolder = queryClient.getQueryData<FoldersInfiniteData>(
        folderKeys.byUserPage(userId, folderLimit),
      );

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
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: folderKeys.byId(deletedId),
      });
    },
  });
