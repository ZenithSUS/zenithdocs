import { AxiosError } from "@/types/api";
import { DocumentShare } from "@/types/document-share";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { DocumentSharePage, MutateContext } from "./useDocumentShare";
import documentShareKeys from "./document-share.keys";
import { deleteDocumentShare } from "./document-share.api";
import { removeDocumentShareCache } from "./document-share.cache";
import { changeIsSharedInfiniteDocument } from "../documents/document.cache";
import documentKeys from "../documents/document.keys";
import fetchLimits from "@/constants/fetch-limits";
import { decrementTotalDocumentSharedCache } from "../dashboard/dashboard.cache";
import { dashboardKeys } from "../dashboard/dashboard.keys";

export const useDocumentShareDelete = (
  queryClient: QueryClient,
  userId: string,
  page: number,
) =>
  useMutation<DocumentShare, AxiosError, string, MutateContext>({
    mutationKey: documentShareKeys.delete(),
    mutationFn: (id) => deleteDocumentShare(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({
        queryKey: documentShareKeys.byUser(userId),
      });

      // Snapshot BEFORE removal for rollback
      const previousDocumentShares =
        queryClient.getQueryData<DocumentSharePage>(
          documentShareKeys.byUserPage(userId, page),
        );
      removeDocumentShareCache(
        queryClient,
        documentShareKeys.byUser(userId),
        deletedId,
      );

      return { previousDocumentShares };
    },
    onError: (_, __, context) => {
      if (context?.previousDocumentShares) {
        // Invalidate all pages so they refetch clean data
        queryClient.invalidateQueries({
          queryKey: documentShareKeys.byUser(userId),
        });
      }
    },
    onSuccess: (documentShare) => {
      const documentId =
        typeof documentShare.documentId === "string"
          ? documentShare.documentId
          : documentShare.documentId._id;

      // Change is Shared to false
      changeIsSharedInfiniteDocument(
        queryClient,
        documentKeys.byUserPage(userId, fetchLimits.document),
        {
          _id: documentId,
          isShared: false,
        },
      );

      decrementTotalDocumentSharedCache(queryClient, dashboardKeys.overview());

      // Invalidate all pages to correct any pagination gaps (e.g. page 2 losing an item)
      queryClient.invalidateQueries({
        queryKey: documentShareKeys.byUser(userId),
      });

      // Remove individual cache entry
      queryClient.removeQueries({
        queryKey: documentShareKeys.byId(documentShare._id),
      });
    },
  });
