import { ResponseWithPagedData } from "@/types/api";
import Doc from "@/types/doc";
import { InfiniteData, QueryClient } from "@tanstack/react-query";

type DocumentPage = ResponseWithPagedData<Doc, "documents">["data"];
type DocumentsInfiniteData = InfiniteData<DocumentPage>;

export const updateInfiniteDocument = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  updatedDoc: Doc,
) => {
  queryClient.setQueryData<DocumentsInfiniteData>(querykey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        documents: page.documents.map((doc) =>
          doc._id === updatedDoc._id ? updatedDoc : doc,
        ),
      })),
    };
  });
};

export const removeInfiniteDocument = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  deletedId: string,
) => {
  queryClient.setQueryData<DocumentsInfiniteData>(querykey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        documents: page.documents.filter((doc) => doc._id !== deletedId),
      })),
    };
  });
};
