import { AxiosError } from "@/types/api";
import Doc from "@/types/doc";
import { QueryClient, useMutation } from "@tanstack/react-query";
import {
  DocumentsInfiniteData,
  MutationContext,
  UpdateVariables,
} from "./useDocument";
import documentKeys from "./document.keys";
import { updateDocumentById } from "./document.api";
import {
  updateInfiniteDocument,
  updateUnifiedDocumentsData,
} from "./document.cache";
import folderKeys from "../folder/folder.keys";
import fetchLimits from "@/constants/fetch-limits";

export const useDocumentUpdate = (
  queryClient: QueryClient,
  userId: string,
  documentLimit: number,
) =>
  useMutation<Doc, AxiosError, UpdateVariables, MutationContext>({
    mutationKey: documentKeys.update(),
    mutationFn: ({ id, data }: { id: string; data: Partial<Doc> }) => {
      const { folder } = data;
      const finalData: Partial<Doc> = {
        ...data,
        folder: typeof folder === "object" ? (folder?._id ?? null) : null,
      };

      return updateDocumentById(id, finalData);
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: documentKeys.byUserPage(userId, documentLimit),
      });

      const previousDoc = queryClient.getQueryData<DocumentsInfiniteData>(
        documentKeys.byUserPage(userId, documentLimit),
      );

      const newFolder =
        typeof data.folder === "string"
          ? data.folder
          : data.folder?._id && data.folder?.name
            ? { _id: data.folder._id, name: data.folder.name }
            : null;

      const finalData: Partial<Doc> = { ...data, folder: newFolder };

      updateInfiniteDocument(
        queryClient,
        documentKeys.byUserPage(userId, documentLimit),
        { _id: id, ...finalData },
      );

      return { previousDoc };
    },
    onError: (_, __, context) => {
      if (context?.previousDoc) {
        queryClient.setQueryData(
          documentKeys.byUserPage(userId, documentLimit),
          context.previousDoc,
        );
      }
    },
    onSuccess: (updatedDoc: Doc) => {
      updateInfiniteDocument(
        queryClient,
        documentKeys.byUserPage(userId, documentLimit),
        updatedDoc,
      );

      updateUnifiedDocumentsData(
        queryClient,
        documentKeys.byUnifiedByUser(userId),
        updatedDoc,
      );

      queryClient.setQueryData(documentKeys.byId(updatedDoc._id), updatedDoc);

      // Invalidate folder queries to update document counts and folder info
      queryClient.invalidateQueries({
        queryKey: folderKeys.byUserPage(userId, fetchLimits.folder),
      });
    },
  });
