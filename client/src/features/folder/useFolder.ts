import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import folderKeys from "./folder.keys";
import {
  createFolder,
  deleteFolderById,
  fetchFolderById,
  fetchFoldersByUserPaginated,
  updateFolderById,
} from "./folder.api";
import { Folder } from "@/types/folder";
import { ResponseWithPagedData } from "@/types/api";
import { AxiosError } from "@/types/api";
import { removeInfiniteFolder, updateInfiniteFolder } from "./folder.cache";

type FolderPage = ResponseWithPagedData<Folder, "folders">["data"];
type FoldersInfiniteData = InfiniteData<FolderPage>;
type UpdateVariables = {
  id: string;
  data: Partial<Folder>;
};
type MutateContext = {
  previousFolder: FoldersInfiniteData | undefined;
};

/**
 * A hook that provides mutations and queries related to folders.
 * @returns An object with the following properties:
 *   - createFolderMutation: A mutation that creates a new folder.
 *   - foldersByUserPage: An infinite query that fetches folders by the user ID with pagination.
 *   - folderById: A query that fetches a folder by its ID.
 *   - updateFolderMutation: A mutation that updates a folder by its ID.
 *   - deletFolderMutation: A mutation that deletes a folder by its ID.
 */
const useFolder = () => {
  const queryClient = useQueryClient();
  const folderLimit = 10;

  const createFolderMutation = (userId: string) =>
    useMutation<Folder, AxiosError, Partial<Folder>>({
      mutationKey: folderKeys.create(),
      mutationFn: (data) => createFolder(data),
      onSuccess: (newFolder) => {
        queryClient.setQueryData<FoldersInfiniteData>(
          folderKeys.byUserPage(userId, folderLimit),
          (oldData) => {
            if (!oldData) return oldData;

            const firstPage = oldData.pages[0];

            // Add the new folder to the first page of the cache then append the rest of the pages
            return {
              ...oldData,
              pages: [
                {
                  ...firstPage,
                  folders: [newFolder, ...firstPage.folders],
                },
                ...oldData.pages.slice(1),
              ],
            };
          },
        );
      },
    });

  const foldersByUserPage = (userId: string) =>
    useInfiniteQuery<
      FolderPage,
      AxiosError,
      InfiniteData<FolderPage>,
      ReturnType<typeof folderKeys.byUserPage>,
      number
    >({
      queryKey: folderKeys.byUserPage(userId, folderLimit),
      queryFn: ({ pageParam = 1 }) =>
        fetchFoldersByUserPaginated(userId, pageParam, folderLimit),
      initialPageParam: 1,

      getNextPageParam: (lastPage) => {
        const { page, totalPages } = lastPage.pagination;
        return page < totalPages ? page + 1 : undefined;
      },
      enabled: !!userId,
    });

  const folderById = (folderId: string) =>
    useQuery({
      queryKey: folderKeys.byId(folderId),
      queryFn: () => fetchFolderById(folderId),
      enabled: !!folderId,
    });

  const updateFolderMutation = (userId: string) =>
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

  const deletFolderMutation = (userId: string) =>
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

  return {
    createFolderMutation,
    foldersByUserPage,
    folderById,
    updateFolderMutation,
    deletFolderMutation,
  };
};

export default useFolder;
