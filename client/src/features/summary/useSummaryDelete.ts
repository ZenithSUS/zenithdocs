import { AxiosError } from "@/types/api";
import { Summary } from "@/types/summary";
import { QueryClient, useMutation } from "@tanstack/react-query";
import {
  MutationContext,
  SummaryByDocumentInfiniteData,
  SummaryByUserInfiniteData,
} from "./useSummary";
import summaryKeys from "./summary.keys";
import { deleteSummaryById } from "./summary.api";
import { removeInfiniteSummary } from "./summary.cache";

export const useSummaryDelete = (
  queryClient: QueryClient,
  userId: string,
  documentId: string,
  summaryLimit: number,
) =>
  useMutation<Summary, AxiosError, string, MutationContext>({
    mutationKey: summaryKeys.delete(),
    mutationFn: (id) => deleteSummaryById(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({
        queryKey: summaryKeys.byUserPage(userId, summaryLimit),
      });

      removeInfiniteSummary(
        queryClient,
        summaryKeys.byUserPage(userId, summaryLimit),
        deletedId,
      );

      removeInfiniteSummary(
        queryClient,
        summaryKeys.byDocumentPage(documentId, summaryLimit),
        deletedId,
      );

      const previousSummaryByUser =
        queryClient.getQueryData<SummaryByUserInfiniteData>(
          summaryKeys.byUserPage(userId, summaryLimit),
        );

      const previousSummaryByDocument =
        queryClient.getQueryData<SummaryByDocumentInfiniteData>(
          summaryKeys.byDocumentPage(documentId, summaryLimit),
        );

      return { previousSummaryByUser, previousSummaryByDocument };
    },
    onError: (_, __, context) => {
      if (context?.previousSummaryByUser) {
        queryClient.setQueryData(
          summaryKeys.byUserPage(userId, summaryLimit),
          context.previousSummaryByUser,
        );
      }

      if (context?.previousSummaryByDocument) {
        queryClient.setQueryData(
          summaryKeys.byDocumentPage(documentId, summaryLimit),
          context.previousSummaryByDocument,
        );
      }
    },
    onSuccess: (_, deletedId: string) => {
      queryClient.removeQueries({
        queryKey: summaryKeys.byId(deletedId),
      });
    },
  });
