import { AxiosError } from "@/types/api";
import { DocumentShare } from "@/types/document-share";
import { useQuery } from "@tanstack/react-query";
import documentShareKeys from "./document-share.keys";
import { fetchDocumentShareByToken } from "./document-share.api";

export const useDocumentShareByToken = (token: string) =>
  useQuery<DocumentShare, AxiosError>({
    queryKey: documentShareKeys.byToken(token),
    queryFn: () => fetchDocumentShareByToken(token),
    enabled: !!token,
  });
