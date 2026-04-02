import { AxiosError } from "@/types/api";
import Doc from "@/types/doc";
import { useMutation } from "@tanstack/react-query";
import { reprocessUploadedDocument } from "./document.api";
import documentKeys from "./document.keys";

export const useDocumentReprocess = () =>
  useMutation<Doc, AxiosError, string>({
    mutationKey: documentKeys.reprocess(),
    mutationFn: (id) => reprocessUploadedDocument(id),
  });
