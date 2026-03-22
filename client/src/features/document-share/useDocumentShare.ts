import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  updateDocumentShareCache,
  removeDocumentShareCache,
} from "./document-share.cache";
import { DocumentShareInfo } from "@/types/doc";
import useAuthStore from "../auth/auth.store";

type DocumentSharePage = ResponseWithPagedData<
  DocumentShare,
  "documentShares"
>["data"];

type UpdateVariables = {
  id: string;
  data: Partial<DocumentShare>;
};

type MutateContext = {
  previousDocumentShares: DocumentSharePage | undefined;
};

type CreateDocumentShareVariables = {
  data: DocumentShareInput;
  document: DocumentShareInfo;
};

const useDocumentShare = (userId: string, page: number = 1) => {
  const queryClient = useQueryClient();
  const documentShareLimit = 10;
  const { email } = useAuthStore();

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const pageQueryKey = documentShareKeys.byUserPage(userId, page);

  const getCurrentPageData = () =>
    queryClient.getQueryData<DocumentSharePage>(pageQueryKey);

  // ─── Query ────────────────────────────────────────────────────────────────

  const getDocumentSharesByUserQuery = useQuery<DocumentSharePage, AxiosError>({
    queryKey: pageQueryKey,
    queryFn: () =>
      fetchDocumentSharesByUserPaginated(userId, page, documentShareLimit),
    enabled: !!userId,
  });

  // ─── Create ───────────────────────────────────────────────────────────────

  const createDocumentShareMutation = useMutation<
    DocumentShare,
    AxiosError,
    CreateDocumentShareVariables
  >({
    mutationKey: documentShareKeys.create(),
    mutationFn: ({ data }) => createDocumentShare(data),
    onSuccess: (newDocumentShare, { document }) => {
      const finalDocumentShare: DocumentShare = {
        ...newDocumentShare,
        documentId: {
          ...document,
          _id: document.id,
        },
        ownerId: {
          _id: userId,
          email: email || "",
        },
      };

      // Optimistically prepend new share to current page cache
      queryClient.setQueryData<DocumentSharePage>(pageQueryKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          documentShares: [finalDocumentShare, ...oldData.documentShares],
        };
      });
    },
  });

  // ─── Update ───────────────────────────────────────────────────────────────

  const updateDocumentShareMutation = useMutation<
    DocumentShare,
    AxiosError,
    UpdateVariables,
    MutateContext
  >({
    mutationKey: documentShareKeys.update(),
    mutationFn: ({ id, data }) => updateDocumentShare(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: pageQueryKey });

      // Snapshot for rollback
      const previousDocumentShares = getCurrentPageData();

      // Optimistically apply partial update
      updateDocumentShareCache(queryClient, pageQueryKey, {
        ...previousDocumentShares?.documentShares.find((d) => d._id === id),
        ...data,
      } as DocumentShare);

      return { previousDocumentShares };
    },
    onError: (_, __, context) => {
      if (context?.previousDocumentShares) {
        queryClient.setQueryData<DocumentSharePage>(
          pageQueryKey,
          context.previousDocumentShares,
        );
      }
    },
    onSuccess: (updatedDocumentShare) => {
      // Sync confirmed server data into cache
      updateDocumentShareCache(queryClient, pageQueryKey, updatedDocumentShare);

      // Also update the individual document share cache
      queryClient.setQueryData(
        documentShareKeys.byId(updatedDocumentShare._id),
        updatedDocumentShare,
      );
    },
  });

  // ─── Delete ───────────────────────────────────────────────────────────────

  const deleteDocumentShareMutation = useMutation<
    DocumentShare,
    AxiosError,
    string,
    MutateContext
  >({
    mutationKey: documentShareKeys.delete(),
    mutationFn: (id) => deleteDocumentShare(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: pageQueryKey });

      // Snapshot BEFORE removal for rollback
      const previousDocumentShares = getCurrentPageData();

      // Optimistically remove from cache
      removeDocumentShareCache(queryClient, pageQueryKey, deletedId);

      return { previousDocumentShares };
    },
    onError: (_, __, context) => {
      if (context?.previousDocumentShares) {
        queryClient.setQueryData<DocumentSharePage>(
          pageQueryKey,
          context.previousDocumentShares,
        );
      }
    },
    onSuccess: (deletedDocumentShare) => {
      // Refetch to correct pagination counts after deletion
      queryClient.invalidateQueries({ queryKey: pageQueryKey });

      // Remove individual cache entry
      queryClient.removeQueries({
        queryKey: documentShareKeys.byId(deletedDocumentShare._id),
      });
    },
  });

  return {
    createDocumentShareMutation,
    getDocumentSharesByUserQuery,
    updateDocumentShareMutation,
    deleteDocumentShareMutation,
  };
};

export default useDocumentShare;
