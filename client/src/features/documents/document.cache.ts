import Doc from "@/types/doc";
import { QueryClient } from "@tanstack/react-query";
import {
  DocumentsInfiniteData,
  DocumentsWithChatInfiniteData,
} from "./useDocument";

interface IsSharedData {
  _id: string;
  isShared: boolean;
}

export const addInfiniteDocument = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  newDoc: Doc,
) => {
  queryClient.setQueryData<DocumentsInfiniteData>(querykey, (oldData) => {
    if (!oldData) return oldData;

    const firstPage = oldData.pages[0];

    // Remove any existing entry with the same _id before prepending
    const dedupedDocuments = firstPage.documents.filter(
      (doc) => doc._id !== newDoc._id,
    );

    // Add the new document to the first page of the cache then append the rest of the pages
    return {
      ...oldData,
      pages: [
        {
          ...firstPage,
          documents: [newDoc, ...dedupedDocuments],
        },
        ...oldData.pages.slice(1),
      ],
    };
  });
};

export const changeIsSharedInfiniteDocument = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  data: IsSharedData,
) => {
  queryClient.setQueryData<DocumentsInfiniteData>(querykey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        documents: page.documents.map((doc) => ({
          ...doc,
          isShared: doc._id === data._id ? data.isShared : doc.isShared,
        })),
      })),
    };
  });
};

export const updateInfiniteDocument = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  updatedDoc: Partial<Doc>,
) => {
  queryClient.setQueryData<DocumentsInfiniteData>(querykey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        documents: page.documents.map((doc) =>
          doc._id === updatedDoc._id ? { ...doc, ...updatedDoc } : doc,
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

export const updateDocumentStatus = (
  queryClient: QueryClient,
  querykey: readonly unknown[],
  updatedDoc: {
    documentId: string;
    status: "uploaded" | "processing" | "completed" | "failed";
  },
) =>
  queryClient.setQueryData<Doc>(querykey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      status: updatedDoc.status,
    };
  });

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

export const removeRelatedChatByDocumentIdFromCache = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  deletedId: string,
) => {
  queryClient.setQueryData<DocumentsWithChatInfiniteData>(
    queryKey,
    (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          documents: page.documents.filter((doc) => doc._id !== deletedId),
        })),
      };
    },
  );
};
