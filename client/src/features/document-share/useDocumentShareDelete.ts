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
      // Cancel only the current page query
      await queryClient.cancelQueries({
        queryKey: documentShareKeys.byUserPage(userId, page),
      });

      // Snapshot for rollback
      const previousDocumentShares =
        queryClient.getQueryData<DocumentSharePage>(
          documentShareKeys.byUserPage(userId, page),
        );

      removeDocumentShareCache(
        queryClient,
        documentShareKeys.byUserPage(userId, page),
        deletedId,
        fetchLimits.documentShare,
      );

      return { previousDocumentShares };
    },
    onError: (_, __, context) => {
      // Restore snapshot on error
      if (context?.previousDocumentShares) {
        queryClient.setQueryData(
          documentShareKeys.byUserPage(userId, page),
          context.previousDocumentShares,
        );
      }
    },
    onSuccess: (documentShare) => {
      const documentId =
        typeof documentShare.documentId === "string"
          ? documentShare.documentId
          : documentShare.documentId._id;

      changeIsSharedInfiniteDocument(
        queryClient,
        documentKeys.byUserPage(userId, fetchLimits.document),
        { _id: documentId, isShared: false },
      );

      decrementTotalDocumentSharedCache(queryClient, dashboardKeys.overview());

      // Invalidate all pages to correct pagination gaps
      queryClient.invalidateQueries({
        queryKey: documentShareKeys.byUser(userId),
      });

      queryClient.removeQueries({
        queryKey: documentShareKeys.byId(documentShare._id),
      });
    },
  });
