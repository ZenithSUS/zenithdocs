import { AxiosError } from "@/types/api";
import { DocumentShare } from "@/types/document-share";
import { QueryClient, useMutation } from "@tanstack/react-query";
import {
  DocumentSharePage,
  MutateContext,
  UpdateVariables,
} from "./useDocumentShare";
import documentShareKeys from "./document-share.keys";
import { updateDocumentShare } from "./document-share.api";
import { updateDocumentShareCache } from "./document-share.cache";

export const useDocumentShareUpdate = (
  queryClient: QueryClient,
  userId: string,
  email: string | null,
  page: number,
) =>
  useMutation<DocumentShare, AxiosError, UpdateVariables, MutateContext>({
    mutationKey: documentShareKeys.update(),
    mutationFn: ({ id, data }) => updateDocumentShare(id, data),
    onMutate: async ({ id, data, document }) => {
      await queryClient.cancelQueries({
        queryKey: documentShareKeys.byUserPage(userId, page),
      });

      const previousDocumentShares =
        queryClient.getQueryData<DocumentSharePage>(
          documentShareKeys.byUserPage(userId, page),
        );

      const existing = previousDocumentShares?.documentShares.find(
        (d) => d._id === id,
      );
      if (!existing) return { previousDocumentShares };

      const resolveAllowedUsers = (
        incoming: { userId: string; permission: "read" }[],
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

      updateDocumentShareCache(
        queryClient,
        documentShareKeys.byUserPage(userId, page),
        updatedDocumentShare,
      );

      return { previousDocumentShares };
    },
    onError: (_, __, context) => {
      if (context?.previousDocumentShares) {
        queryClient.setQueryData<DocumentSharePage>(
          documentShareKeys.byUserPage(userId, page),
          context.previousDocumentShares,
        );
      }
    },
    onSuccess: (updatedDocumentShare) => {
      // Sync confirmed server data into cache
      updateDocumentShareCache(
        queryClient,
        documentShareKeys.byUserPage(userId, page),
        updatedDocumentShare,
      );

      // Also update the individual document share cache
      queryClient.setQueryData(
        documentShareKeys.byId(updatedDocumentShare._id),
        updatedDocumentShare,
      );
    },
  });
