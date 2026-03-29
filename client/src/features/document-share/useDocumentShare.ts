import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import documentShareKeys from "./document-share.keys";
import {
  createDocumentShare,
  deleteDocumentShare,
  fetchDocumentShareById,
  fetchDocumentShareByToken,
  fetchDocumentSharesByUserPaginated,
  updateDocumentShare,
} from "./document-share.api";
import {
  DocumentShare,
  DocumentShareInput,
  UpdateDocumentShareInput,
} from "@/types/document-share";
import { AxiosError, ResponseWithPagedData } from "@/types/api";
import {
  updateDocumentShareCache,
  removeDocumentShareCache,
  addDocumentShareCache,
} from "./document-share.cache";
import { DocumentShareInfo } from "@/types/doc";
import useAuthStore from "../auth/auth.store";

type DocumentSharePage = ResponseWithPagedData<
  DocumentShare,
  "documentShares"
>["data"];

type UpdateVariables = {
  id: string;
  data: UpdateDocumentShareInput;
  document?: DocumentShareInfo;
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
  const userKey = documentShareKeys.byUser(userId);

  const getCurrentPageData = () =>
    queryClient.getQueryData<DocumentSharePage>(pageQueryKey);

  // ─── Query ────────────────────────────────────────────────────────────────

  const getDocumentSharesByUserQuery = useQuery<DocumentSharePage, AxiosError>({
    queryKey: pageQueryKey,
    queryFn: () =>
      fetchDocumentSharesByUserPaginated(userId, page, documentShareLimit),
    enabled: !!userId,
  });

  const getDocumentShareById = (id: string) =>
    useQuery<DocumentShare, AxiosError>({
      queryKey: documentShareKeys.byUser(id),
      queryFn: () => fetchDocumentShareById(id),
      enabled: !!id,
    });

  const getDocumentSharedByToken = (token: string) =>
    useQuery<DocumentShare, AxiosError>({
      queryKey: documentShareKeys.byToken(token),
      queryFn: () => fetchDocumentShareByToken(token),
      enabled: !!token,
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
      addDocumentShareCache(queryClient, userKey, finalDocumentShare);
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
    onMutate: async ({ id, data, document }) => {
      await queryClient.cancelQueries({ queryKey: pageQueryKey });

      const previousDocumentShares = getCurrentPageData();

      const existing = previousDocumentShares?.documentShares.find(
        (d) => d._id === id,
      );
      if (!existing) return { previousDocumentShares };

      const resolveAllowedUsers = (
        incoming: { userId: string; permission: "read" | "write" }[],
        existing: DocumentShare["allowedUsers"],
      ): NonNullable<DocumentShare["allowedUsers"]> =>
        incoming.map((u) => ({
          permission: u.permission,
          userId: existing?.find((eu) => eu.userId._id === u.userId)
            ?.userId ?? {
            _id: u.userId,
            email: "",
          },
        }));

      const updatedDocumentShare: DocumentShare = {
        ...existing,
        // Spread only the safe fields from data (excludes documentId which is a string in UpdateDocumentShareInput)
        ...(data.type && { type: data.type }),
        ...(data.publicPermission !== undefined && {
          publicPermission: data.publicPermission,
        }),
        ...(data.allowedUsers !== undefined && {
          allowedUsers: resolveAllowedUsers(
            data.allowedUsers,
            existing.allowedUsers,
          ),
        }),
        ...(data.allowDownload !== undefined && {
          allowDownload: data.allowDownload,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.expiresAt !== undefined && {
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        }),
        // Override documentId and ownerId with proper object shapes only if document is provided
        ...(document && {
          documentId: {
            ...document,
            _id: document.id,
          },
          ownerId: {
            _id: userId,
            email: email || "",
          },
        }),
      };

      updateDocumentShareCache(queryClient, pageQueryKey, updatedDocumentShare);

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
    onSuccess: (updatedDocumentShare, { document }) => {
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
      await queryClient.cancelQueries({ queryKey: userKey });

      // Snapshot BEFORE removal for rollback
      const previousDocumentShares = getCurrentPageData();
      removeDocumentShareCache(queryClient, userKey, deletedId);

      return { previousDocumentShares };
    },
    onError: (_, __, context) => {
      if (context?.previousDocumentShares) {
        // Invalidate all pages so they refetch clean data
        queryClient.invalidateQueries({ queryKey: userKey });
      }
    },
    onSuccess: (deletedDocumentShare) => {
      // Invalidate all pages to correct any pagination gaps (e.g. page 2 losing an item)
      queryClient.invalidateQueries({ queryKey: userKey });

      // Remove individual cache entry
      queryClient.removeQueries({
        queryKey: documentShareKeys.byId(deletedDocumentShare._id),
      });
    },
  });

  return {
    createDocumentShareMutation,
    getDocumentShareById,
    getDocumentSharedByToken,
    getDocumentSharesByUserQuery,
    updateDocumentShareMutation,
    deleteDocumentShareMutation,
  };
};

export default useDocumentShare;
