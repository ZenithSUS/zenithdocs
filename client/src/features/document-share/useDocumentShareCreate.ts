import { AxiosError } from "@/types/api";
import { DocumentShare } from "@/types/document-share";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { CreateDocumentShareVariables } from "./useDocumentShare";
import documentShareKeys from "./document-share.keys";
import { createDocumentShare } from "./document-share.api";
import { addDocumentShareCache } from "./document-share.cache";

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
        documentShareKeys.byUser(userId),
        finalDocumentShare,
      );
    },
  });
