import { ResponseWithPagedData } from "@/types/api";
import { DocumentShare } from "@/types/document-share";
import { InfiniteData, QueryClient } from "@tanstack/react-query";

type DocumentSharePage = ResponseWithPagedData<
  DocumentShare,
  "documentShares"
>["data"];
type DocumentShareInfiniteData = InfiniteData<DocumentSharePage>;

export const updateInfiniteDocumentShare = (
  queryClient: QueryClient,
  querkey: readonly unknown[],
  updatedDocumentShare: DocumentShare,
) => {
  queryClient.setQueryData<DocumentShareInfiniteData>(querkey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        documentShares: page.documentShares.map((documentShare) =>
          documentShare._id === updatedDocumentShare._id
            ? updatedDocumentShare
            : documentShare,
        ),
      })),
    };
  });
};

export const removeInfiniteDocumentShare = (
  queryClient: QueryClient,
  querkey: readonly unknown[],
  deletedId: string,
) => {
  queryClient.setQueryData<DocumentShareInfiniteData>(querkey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        documentShares: page.documentShares.filter(
          (documentShare) => documentShare._id !== deletedId,
        ),
      })),
    };
  });
};
