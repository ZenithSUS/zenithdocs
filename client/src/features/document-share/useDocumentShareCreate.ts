import { AxiosError } from "@/types/api";
import { DocumentShare } from "@/types/document-share";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { CreateDocumentShareVariables } from "./useDocumentShare";
import documentShareKeys from "./document-share.keys";
import { createDocumentShare } from "./document-share.api";
import { addDocumentShareCache } from "./document-share.cache";
import { changeIsSharedInfiniteDocument } from "../documents/document.cache";
import documentKeys from "../documents/document.keys";
import fetchLimits from "@/constants/fetch-limits";
import { incrementTotalDocumentSharedCache } from "../dashboard/dashboard.cache";
import { dashboardKeys } from "../dashboard/dashboard.keys";

export const useDocumentShareCreate = (
  queryClient: QueryClient,
  userId: string,
  email: string | null,
) =>
  useMutation<DocumentShare, AxiosError, CreateDocumentShareVariables>({
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
      addDocumentShareCache(
        queryClient,
        documentShareKeys.byUserPage(userId, 1),
        finalDocumentShare,
        fetchLimits.documentShare,
      );

      // Increment Document Share Dashboard
      incrementTotalDocumentSharedCache(queryClient, dashboardKeys.overview());

      // Optimistically mark document as shared
      changeIsSharedInfiniteDocument(
        queryClient,
        documentKeys.byUserPage(userId, fetchLimits.document),
        {
          _id: document.id,
          isShared: true,
        },
      );
    },
  });
