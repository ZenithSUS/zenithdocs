import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { Folder } from "@/types/folder";
import { ResponseWithPagedData } from "@/types/api";
import { useFolderCreate } from "./useFolderCreate";
import { useFolderUpdate } from "./useFolderUpdate";
import { useFolderDelete } from "./useFolderDelete";
import fetchLimits from "@/constants/fetch-limits";

export type FolderPage = ResponseWithPagedData<Folder, "folders">["data"];
export type FoldersInfiniteData = InfiniteData<FolderPage>;
export type UpdateVariables = {
  id: string;
  data: Partial<Folder>;
};
export type MutateContext = {
  previousFolder: FoldersInfiniteData | undefined;
};

const useFolder = (userId: string) => {
  const queryClient = useQueryClient();

  return {
    createFolderMutation: useFolderCreate(
      queryClient,
      userId,
      fetchLimits.folder,
    ),
    updateFolderMutation: useFolderUpdate(
      queryClient,
      userId,
      fetchLimits.folder,
    ),
    deleteFolderMutation: useFolderDelete(
      queryClient,
      userId,
      fetchLimits.folder,
    ),
  };
};

export default useFolder;
