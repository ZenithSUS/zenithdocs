import { AxiosError } from "@/types/api";
import { UnifiedDoc } from "@/types/doc";
import { useQuery } from "@tanstack/react-query";
import documentKeys from "./document.keys";
import { fetchUnifiedDocumentsByUser } from "./document.api";

export const useDocumentUnifiedByUser = (userId: string) =>
  useQuery<UnifiedDoc, AxiosError>({
    queryKey: documentKeys.byUnifiedByUser(userId),
    queryFn: () => fetchUnifiedDocumentsByUser(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
