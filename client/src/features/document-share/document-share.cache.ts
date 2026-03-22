import { ResponseWithPagedData } from "@/types/api";
import { DocumentShare } from "@/types/document-share";
import { QueryClient } from "@tanstack/react-query";

type DocumentSharePage = ResponseWithPagedData<
  DocumentShare,
  "documentShares"
>["data"];

export const updateDocumentShareCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  updatedDocumentShare: DocumentShare,
) => {
  queryClient.setQueryData<DocumentSharePage>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      documentShares: oldData.documentShares.map((documentShare) =>
        documentShare._id === updatedDocumentShare._id
          ? updatedDocumentShare
          : documentShare,
      ),
    };
  });
};

export const removeDocumentShareCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  deletedId: string,
) => {
  queryClient.setQueryData<DocumentSharePage>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      documentShares: oldData.documentShares.filter(
        (documentShare) => documentShare._id !== deletedId,
      ),
    };
  });
};
