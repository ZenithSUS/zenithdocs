import { QueryClient, useMutation } from "@tanstack/react-query";
import documentKeys from "./document.keys";
import Doc from "@/types/doc";
import { AxiosError } from "@/types/api";
import { createDocument } from "./document.api";
import { addInfiniteDocument } from "./document.cache";

export const useDocumentCreate = (
  queryClient: QueryClient,
  userId: string,
  documentLimit: number,
) => {
  return useMutation<Doc, AxiosError, Partial<Doc>>({
    mutationKey: documentKeys.create(),
    mutationFn: (data) => createDocument(data),
    onSuccess: (newDocs) => {
      const newFolder =
        typeof newDocs.folder === "string"
          ? newDocs.folder
          : newDocs.folder?._id && newDocs.folder?.name
            ? { _id: newDocs.folder._id, name: newDocs.folder.name }
            : null;

      const finalData = {
        ...newDocs,
        folder: newFolder,
      };

      addInfiniteDocument(
        queryClient,
        documentKeys.byUserPage(userId, documentLimit),
        finalData,
      );
    },
  });
};
