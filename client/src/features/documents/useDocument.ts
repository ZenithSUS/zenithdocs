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
  fetchDocumentByUserWithChatsPaginated,
  reprocessUploadedDocument,
} from "./document.api";
import { ResponseWithPagedData, AxiosError } from "@/types/api";
import Doc, { DocWithChat } from "@/types/doc";
import {
  addInfiniteDocument,
  removeInfiniteDocument,
  updateInfiniteDocument,
} from "./document.cache";
import { UseFormOptions } from "@/types/form";
import { toast } from "sonner";

type DocumentPage = ResponseWithPagedData<Doc, "documents">["data"];
type DocumentWithChatPage = ResponseWithPagedData<
  DocWithChat,
  "documents"
>["data"];

type DocumentsInfiniteData = InfiniteData<DocumentPage>;

type UpdateVariables = {
  id: string;
  data: Partial<Doc>;
};

type MutationContext = {
  previousDoc?: DocumentsInfiniteData;
};

/**
 * A hook that provides mutations and queries related to documents.
 * @param {string} userId - The ID of the user that owns the documents.
 * @param {string} documentId - The ID of the document to query by ID.
 * @returns An object with the following properties:
 *   - createDocumentMutation: A mutation that creates a new document.
 *   - documentsByUserPage: An infinite query that fetches documents by the user ID with pagination.
 *   - documentById: A query that fetches a document by its ID.
 *   - updateDocumentMutation: A mutation that updates a document by its ID.
 *   - deleteDocumentMutation: A mutation that deletes a document by its ID.
 */
const useDocument = (userId: string, documentId: string = "") => {
  const queryClient = useQueryClient();
  const documentLimit = 10;

  // Create document
  const createDocumentMutation = useMutation<Doc, AxiosError, Partial<Doc>>({
    mutationKey: documentKeys.create(),
    mutationFn: (data) => createDocument(data),
    onSuccess: (newDocs) => {
      addInfiniteDocument(
        queryClient,
        documentKeys.byUserPage(userId, documentLimit),
        newDocs,
      );
    },
  });

  // Reprocess Uploaded or Failed Document
  const reprocessDocumentMutation = useMutation<Doc, AxiosError, string>({
    mutationKey: documentKeys.reprocess(),
    mutationFn: (id) => reprocessUploadedDocument(id),
  });

  // Get documents by user ID paginated
  const documentsByUserPage = useInfiniteQuery<
    DocumentPage,
    AxiosError,
    DocumentsInfiniteData,
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

  // Get documents by user ID with chats paginated
  const documentsByUserWithChatsPage = useInfiniteQuery<
    DocumentWithChatPage,
    AxiosError,
    InfiniteData<DocumentWithChatPage>,
    ReturnType<typeof documentKeys.byUserWithChatPage>,
    number
  >({
    queryKey: documentKeys.byUserWithChatPage(userId),
    queryFn: ({ pageParam = 1 }) =>
      fetchDocumentByUserWithChatsPaginated(userId, pageParam, documentLimit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        documents: page.documents.sort((a, b) => {
          const dateA = new Date(a.chat?.lastMessage?.createdAt || a.createdAt);
          const dateB = new Date(b.chat?.lastMessage?.createdAt || b.createdAt);
          return dateB.getTime() - dateA.getTime();
        }),
      })),
    }),
    enabled: !!userId,
  });

  // Get document by ID
  const documentById = useQuery<Doc, AxiosError>({
    queryKey: documentKeys.byId(documentId),
    queryFn: () => fetchDocumentById(documentId),
    enabled: !!documentId,
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
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: documentKeys.byUserPage(userId, documentLimit),
      });

      const previousDoc = queryClient.getQueryData<DocumentsInfiniteData>(
        documentKeys.byUserPage(userId, documentLimit),
      );

      updateInfiniteDocument(
        queryClient,
        documentKeys.byUserPage(userId, documentLimit),
        { _id: id, ...data },
      );

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
    mutationKey: documentKeys.delete(),
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
    onError: (_, __, context) => {
      if (context?.previousDoc) {
        queryClient.setQueryData(
          documentKeys.byUserPage(userId, documentLimit),
          context.previousDoc,
        );
      }
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
    documentsByUserWithChatsPage,
    documentById,
    reprocessDocumentMutation,
    updateDocumentMutation,
    deleteDocumentMutation,
  };
};

export default useDocument;
