import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import documentKeys from "./document.keys";
import {
  fetchDocumentById,
  fetchDocumentByUserPaginated,
  deleteDocumentById,
  updateDocumentById,
  createDocument,
} from "./document.api";
import { AxiosError } from "axios";
import { ResponseWithPagedData } from "@/types/api";
import Doc from "@/types/doc";
import {
  removeInfiniteDocument,
  updateInfiniteDocument,
} from "./document.cache";

type DocumentPage = ResponseWithPagedData<Doc, "documents">["data"];
type DocumentsInfiniteData = InfiniteData<DocumentPage>;
type UpdateVariables = {
  id: string;
  data: Partial<Doc>;
};

type MutationContext = {
  previousDoc?: DocumentsInfiniteData;
};

const useDocument = (userId: string, id: string = "") => {
  const queryClient = useQueryClient();
  const documentLimit = 10;

  // Create document
  const createDocumentMutation = useMutation<Doc, AxiosError, Partial<Doc>>({
    mutationKey: documentKeys.create(),
    mutationFn: (data) => createDocument(data),
    onSuccess: (newDocs) =>
      queryClient.setQueryData<DocumentsInfiniteData>(
        documentKeys.byUserPage(userId, documentLimit),
        (oldData) => {
          if (!oldData) return oldData;

          const firstPage = oldData.pages[0];

          // Add the new document to the first page of the cache then append the rest of the pages
          return {
            ...oldData,
            pages: [
              {
                ...firstPage,
                documents: [newDocs, ...firstPage.documents],
              },
              ...oldData.pages.slice(1),
            ],
          };
        },
      ),
  });

  // Get documents by user ID paginated
  const documentsByUserPage = useInfiniteQuery<
    DocumentPage,
    AxiosError,
    InfiniteData<DocumentPage>,
    ReturnType<typeof documentKeys.byUserPage>,
    number
  >({
    queryKey: documentKeys.byUserPage(userId, documentLimit),
    queryFn: ({ pageParam = 1 }) =>
      fetchDocumentByUserPaginated(userId, pageParam, documentLimit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!userId,
  });

  // Get document by ID
  const documentById = useQuery<Doc, AxiosError>({
    queryKey: documentKeys.byId(id),
    queryFn: () => fetchDocumentById(id),
    enabled: !!id,
  });

  // Update document
  const updateDocumentMutation = useMutation<
    Doc,
    AxiosError,
    UpdateVariables,
    MutationContext
  >({
    mutationKey: documentKeys.update(),
    mutationFn: ({ id, data }: { id: string; data: Partial<Doc> }) =>
      updateDocumentById(id, data),
    onMutate: ({ id, data }) => {
      queryClient.cancelQueries({
        queryKey: documentKeys.byUserPage(userId, documentLimit),
      });

      const previousDoc = queryClient.getQueryData<DocumentsInfiniteData>(
        documentKeys.byUserPage(userId, documentLimit),
      );

      if (previousDoc) {
        queryClient.setQueryData<DocumentsInfiniteData>(
          documentKeys.byUserPage(userId, documentLimit),
          (oldData) => {
            if (!oldData) return oldData;

            // Update the document in the cache then append the rest of the pages
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                documents: page.documents.map((doc) =>
                  doc._id === id ? { ...doc, ...data } : doc,
                ),
              })),
            };
          },
        );
      }

      return { previousDoc };
    },
    onError: (_, __, context) => {
      if (context?.previousDoc) {
        queryClient.setQueryData(
          documentKeys.byUserPage(userId, documentLimit),
          context.previousDoc,
        );
      }
    },
    onSuccess: (updatedDoc: Doc) => {
      updateInfiniteDocument(
        queryClient,
        documentKeys.byUserPage(userId, documentLimit),
        updatedDoc,
      );

      queryClient.setQueryData(documentKeys.byId(updatedDoc._id), updatedDoc);
    },
  });

  // Delete document
  const deleteDocumentMutation = useMutation<
    Doc,
    AxiosError,
    string,
    MutationContext
  >({
    mutationKey: documentKeys.delete(id),
    mutationFn: (id) => deleteDocumentById(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: documentKeys.byUserPage(userId, documentLimit),
      });

      const previousDoc = queryClient.getQueryData<DocumentsInfiniteData>(
        documentKeys.byUserPage(userId, documentLimit),
      );

      removeInfiniteDocument(
        queryClient,
        documentKeys.byUserPage(userId, documentLimit),
        id,
      );

      return { previousDoc };
    },
    onSuccess: (_, deletedId: string) => {
      queryClient.removeQueries({
        queryKey: documentKeys.byId(deletedId),
      });
    },
  });

  return {
    createDocumentMutation,
    documentsByUserPage,
    documentById,
    updateDocumentMutation,
    deleteDocumentMutation,
  };
};

export default useDocument;
