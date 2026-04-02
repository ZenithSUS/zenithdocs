import { AxiosError } from "@/types/api";
import { Folder } from "@/types/folder";
import { QueryClient, useMutation } from "@tanstack/react-query";
import folderKeys from "./folder.keys";
import { createFolder } from "./folder.api";
import { addInfiniteFolder } from "./folder.cache";

export const useFolderCreate = (
  queryClient: QueryClient,
  userId: string,
  folderLimit: number,
) =>
  useMutation<Folder, AxiosError, Partial<Folder>>({
    mutationKey: folderKeys.create(),
    mutationFn: (data) => createFolder(data),
    onSuccess: (newFolder) => {
      addInfiniteFolder(
        queryClient,
        folderKeys.byUserPage(userId, folderLimit),
        newFolder,
      );
    },
  });
