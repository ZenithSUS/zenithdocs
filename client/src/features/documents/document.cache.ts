import queryClient from "@/lib/tanstack";
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

export const updateInfiniteDocumentStatus = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  updatedDoc: {
    documentId: string;
    status: "uploaded" | "processing" | "completed" | "failed";
  },
) => {
  queryClient.setQueryData<DocumentsInfiniteData>(querykey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        documents: page.documents.map((doc) =>
          doc._id === updatedDoc.documentId
            ? { ...doc, status: updatedDoc.status }
            : doc,
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

export const removeDocumentFolderInfiniteDocument = (
  queryClient: QueryClient,
  querkey: readonly unknown[],
  deletedId: string,
) => {
  queryClient.setQueryData<DocumentsInfiniteData>(querkey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => {
        return {
          ...page,
          documents: page.documents.map((doc) => {
            // Update the folder of the document in the cache
            const folderId =
              doc.folder && typeof doc.folder === "object"
                ? doc.folder._id
                : doc.folder || null;

            if (folderId === deletedId) return { ...doc, folder: null };
            return doc;
          }),
        };
      }),
    };
  });
};
