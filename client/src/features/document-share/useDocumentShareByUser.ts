import { useQuery } from "@tanstack/react-query";
import { DocumentSharePage } from "./useDocumentShare";
import { AxiosError } from "@/types/api";
import documentShareKeys from "./document-share.keys";
import { fetchDocumentSharesByUserPaginated } from "./document-share.api";
import fetchLimits from "@/constants/fetch-limits";

export const useDocumentShareByUser = (userId: string, page: number = 1) =>
  useQuery<DocumentSharePage, AxiosError>({
    queryKey: documentShareKeys.byUserPage(userId, page),
    queryFn: () =>
      fetchDocumentSharesByUserPaginated(
        userId,
        page,
        fetchLimits.documentShare,
      ),
    enabled: !!userId,
  });
