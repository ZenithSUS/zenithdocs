import { AxiosError } from "@/types/api";
import { Summary } from "@/types/summary";
import { QueryClient, useMutation } from "@tanstack/react-query";
import {
  MutationContext,
  SummaryByDocumentInfiniteData,
  SummaryByUserInfiniteData,
  UpdateVariables,
} from "./useSummary";
import summaryKeys from "./summary.keys";
import { updateSummaryById } from "./summary.api";
import { updateInfiniteSummary } from "./summary.cache";

export const useSummaryUpdate = (
  queryClient: QueryClient,
  userId: string,
  documentId: string,
  summaryLimit: number,
) =>
  useMutation<Summary, AxiosError, UpdateVariables, MutationContext>({
    mutationKey: summaryKeys.update(),
    mutationFn: ({ id, data }: { id: string; data: Partial<Summary> }) =>
      updateSummaryById(id, data),
    onMutate: ({ id, data }) => {
      queryClient.cancelQueries({
        queryKey: summaryKeys.byUserPage(userId, summaryLimit),
      });

      const previousSummaryByUser =
        queryClient.getQueryData<SummaryByUserInfiniteData>(
          summaryKeys.byUserPage(userId, summaryLimit),
        );

      if (previousSummaryByUser) {
        queryClient.setQueryData<SummaryByUserInfiniteData>(
          summaryKeys.byUserPage(userId, summaryLimit),
          (oldData) => {
            if (!oldData) return oldData;

            // Update the summary in the cache then append the rest of the pages
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                summaries: page.summaries.map((summary) =>
                  summary._id === id ? { ...summary, ...data } : summary,
                ),
              })),
            };
          },
        );
      }

      const previousSummaryByDocument =
        queryClient.getQueryData<SummaryByDocumentInfiniteData>(
          summaryKeys.byDocumentPage(documentId, summaryLimit),
        );

      if (previousSummaryByDocument) {
        queryClient.setQueryData<SummaryByDocumentInfiniteData>(
          summaryKeys.byDocumentPage(documentId, summaryLimit),
          (oldData) => {
            if (!oldData) return oldData;

            // Update the summary in the cache then append the rest of the pages
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                summaries: page.summaries.map((summary) =>
                  summary._id === id ? { ...summary, ...data } : summary,
                ),
              })),
            };
          },
        );
      }

      return { previousSummaryByUser, previousSummaryByDocument };
    },
    onError: (_, __, context) => {
      if (context?.previousSummaryByUser) {
        queryClient.setQueryData<SummaryByUserInfiniteData>(
          summaryKeys.byUserPage(userId, summaryLimit),
          context.previousSummaryByUser,
        );
      }

      if (context?.previousSummaryByDocument) {
        queryClient.setQueryData<SummaryByDocumentInfiniteData>(
          summaryKeys.byDocumentPage(documentId, summaryLimit),
          context.previousSummaryByDocument,
        );
      }
    },
    onSuccess: (updatedSummary) => {
      updateInfiniteSummary(
        queryClient,
        summaryKeys.byUserPage(userId, summaryLimit),
        updatedSummary,
      );

      queryClient.setQueryData(
        summaryKeys.byId(updatedSummary._id),
        updatedSummary,
      );
    },
  });
