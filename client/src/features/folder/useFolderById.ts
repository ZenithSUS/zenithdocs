import { useQuery } from "@tanstack/react-query";
import folderKeys from "./folder.keys";
import { fetchFolderById } from "./folder.api";

export const useFolderById = (folderId: string) =>
  useQuery({
    queryKey: folderKeys.byId(folderId),
    queryFn: () => fetchFolderById(folderId),
    enabled: !!folderId,
  });
