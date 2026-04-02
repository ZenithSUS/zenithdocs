import { AxiosError } from "@/types/api";
import { Summary } from "@/types/summary";
import { QueryClient, useMutation } from "@tanstack/react-query";
import summaryKeys from "./summary.keys";
import { createSummary } from "./summary.api";
import { addInfiniteSummary } from "./summary.cache";

export const useSummaryCreate = (
  queryClient: QueryClient,
  userId: string,
  documentId: string,
  summaryLimit: number,
) =>
  useMutation<Summary, AxiosError, Partial<Summary>>({
    mutationKey: summaryKeys.create(),
    mutationFn: (data: Partial<Summary>) => createSummary(data),
    onSuccess: (newSummary: Summary) => {
      addInfiniteSummary(
        queryClient,
        summaryKeys.byUserPage(userId, summaryLimit),
        newSummary,
      );

      if (documentId) {
        addInfiniteSummary(
          queryClient,
          summaryKeys.byDocumentPage(documentId, summaryLimit),
          newSummary,
        );
      }
    },
  });
