import { AxiosError } from "@/types/api";
import { DocumentShare } from "@/types/document-share";
import { useQuery } from "@tanstack/react-query";
import documentShareKeys from "./document-share.keys";
import { fetchDocumentShareById } from "./document-share.api";

export const useDocumentShareById = (id: string) =>
  useQuery<DocumentShare, AxiosError>({
    queryKey: documentShareKeys.byUser(id),
    queryFn: () => fetchDocumentShareById(id),
    enabled: !!id,
  });
