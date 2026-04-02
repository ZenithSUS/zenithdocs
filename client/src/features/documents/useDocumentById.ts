import Doc from "@/types/doc";
import documentKeys from "./document.keys";
import { AxiosError } from "@/types/api";
import { fetchDocumentById } from "./document.api";
import { useQuery } from "@tanstack/react-query";

export const useDocumentById = (documentId: string) =>
  useQuery<Doc, AxiosError>({
    queryKey: documentKeys.byId(documentId),
    queryFn: () => fetchDocumentById(documentId),
    enabled: !!documentId,
  });
