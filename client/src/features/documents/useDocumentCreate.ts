import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
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
      addInfiniteDocument(
        queryClient,
        documentKeys.byUserPage(userId, documentLimit),
        newDocs,
      );
    },
  });
};
