import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import documentShareKeys from "./document-share.keys";
import {
  createDocumentShare,
  deleteDocumentShare,
  fetchDocumentSharesByUserPaginated,
  updateDocumentShare,
} from "./document-share.api";
import { DocumentShare, DocumentShareInput } from "@/types/document-share";
import { AxiosError, ResponseWithPagedData } from "@/types/api";
import {
  removeInfiniteDocumentShare,
  updateInfiniteDocumentShare,
} from "./document-share.cache";

type DocumentSharePage = ResponseWithPagedData<
  DocumentShare,
  "documentShares"
>["data"];
type DocumentShareInfiniteData = InfiniteData<DocumentSharePage>;

type UpdateVariables = {
  id: string;
  data: Partial<DocumentShare>;
};

type MutateContext = {
  previousDocumentShare: DocumentShareInfiniteData | undefined;
};

const useDocumentShare = (userId: string) => {
  const queryClient = useQueryClient();
  const documentSharelimit = 10;

  const createDocumentShareMutation = useMutation<
    DocumentShare,
    AxiosError,
    DocumentShareInput
  >({
    mutationKey: documentShareKeys.create(),
    mutationFn: (data) => createDocumentShare(data),
    onSuccess: (newDocumentShare) => {
      queryClient.setQueryData<DocumentShareInfiniteData>(
        documentShareKeys.byUserPage(userId),
        (oldData) => {
          if (!oldData) return oldData;

          const firstPage = oldData.pages[0];

          // Add the new document share to the first page of the cache then append the rest of the pages
          return {
            ...oldData,
            pages: [
              {
                ...firstPage,
                documentShares: [newDocumentShare, ...firstPage.documentShares],
              },
              ...oldData.pages.slice(1),
            ],
          };
        },
      );
    },
  });

  const getDocumentSharesByUserPageMutation = useInfiniteQuery<
    DocumentSharePage,
    AxiosError,
    DocumentShareInfiniteData,
    ReturnType<typeof documentShareKeys.byUserPage>,
    number
  >({
    queryKey: documentShareKeys.byUserPage(userId),
    queryFn: ({ pageParam = 1 }) =>
      fetchDocumentSharesByUserPaginated(userId, pageParam, documentSharelimit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!userId,
  });

  const updateDocumentShareMutation = useMutation<
    DocumentShare,
    AxiosError,
    UpdateVariables,
    MutateContext
  >({
    mutationKey: documentShareKeys.update(),
    mutationFn: ({ id, data }) => updateDocumentShare(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: documentShareKeys.byId(id),
      });

      const previousDocumentShare =
        queryClient.getQueryData<DocumentShareInfiniteData>(
          documentShareKeys.byId(id),
        );

      if (previousDocumentShare) {
        queryClient.setQueryData<DocumentShareInfiniteData>(
          documentShareKeys.byUserPage(userId),
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                documentShares: page.documentShares.map((documentShare) =>
                  documentShare._id === id
                    ? { ...documentShare, ...data }
                    : documentShare,
                ),
              })),
            };
          },
        );
      }

      return { previousDocumentShare };
    },
    onError: (_, __, context) => {
      if (context?.previousDocumentShare) {
        queryClient.setQueryData<DocumentShareInfiniteData>(
          documentShareKeys.byUserPage(userId),
          context.previousDocumentShare,
        );
      }
    },
    onSuccess: (updatedDocumentShare) => {
      updateInfiniteDocumentShare(
        queryClient,
        documentShareKeys.byUserPage(userId),
        updatedDocumentShare,
      );

      queryClient.setQueryData(
        documentShareKeys.byId(updatedDocumentShare._id),
        updatedDocumentShare,
      );
    },
  });

  const deleteDocumentShareMutation = useMutation<
    DocumentShare,
    AxiosError,
    string,
    MutateContext
  >({
    mutationKey: documentShareKeys.delete(),
    mutationFn: (id) => deleteDocumentShare(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({
        queryKey: documentShareKeys.byId(deletedId),
      });

      removeInfiniteDocumentShare(
        queryClient,
        documentShareKeys.byUserPage(userId),
        deletedId,
      );

      const previousDocumentShare =
        queryClient.getQueryData<DocumentShareInfiniteData>(
          documentShareKeys.byUserPage(userId),
        );

      return { previousDocumentShare };
    },
    onError: (_, __, context) => {
      if (context?.previousDocumentShare) {
        queryClient.setQueryData<DocumentShareInfiniteData>(
          documentShareKeys.byUserPage(userId),
          context.previousDocumentShare,
        );
      }
    },

    onSuccess: (deletedDocumentShare) => {
      queryClient.removeQueries({
        queryKey: documentShareKeys.byId(deletedDocumentShare._id),
      });
    },
  });

  return {
    createDocumentShareMutation,
    getDocumentSharesByUserPageMutation,
    updateDocumentShareMutation,
    deleteDocumentShareMutation,
  };
};

export default useDocumentShare;
