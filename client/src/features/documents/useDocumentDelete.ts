import { AxiosError } from "@/types/api";
import Doc from "@/types/doc";
import { QueryClient, useMutation } from "@tanstack/react-query";
import documentKeys from "./document.keys";
import { deleteDocumentById } from "./document.api";
import { removeInfiniteDocument } from "./document.cache";
import { DocumentsInfiniteData, MutationContext } from "./useDocument";
import { removeRelatedLearningSetByDocumentIdCache } from "../learning-sets/learning-set.cache";
import learningSetKeys from "../learning-sets/learning-set.keys";
import { removeRelatedChatByDocumentIdFromCache } from "./document.cache";
import { removeRelatedInfiniteSummaryByDocumentIdFromCache } from "../summary/summary.cache";
import summaryKeys from "../summary/summary.keys";
import fetchLimits from "@/constants/fetch-limits";

export const useDocumentDelete = (
  queryClient: QueryClient,
  userId: string,
  documentLimit: number,
) =>
  useMutation<Doc, AxiosError, string, MutationContext>({
    mutationKey: documentKeys.delete(),
    mutationFn: (id) => deleteDocumentById(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: documentKeys.byUserPage(userId, documentLimit),
      });

      const previousDoc = queryClient.getQueryData<DocumentsInfiniteData>(
        documentKeys.byUserPage(userId, documentLimit),
      );

      removeInfiniteDocument(
        queryClient,
        documentKeys.byUserPage(userId, documentLimit),
        id,
      );

      removeRelatedInfiniteSummaryByDocumentIdFromCache(
        queryClient,
        summaryKeys.byUserPage(userId, fetchLimits.summary),
        id,
      );

      removeRelatedLearningSetByDocumentIdCache(
        queryClient,
        learningSetKeys.byUser(userId),
        id,
      );

      removeRelatedChatByDocumentIdFromCache(
        queryClient,
        documentKeys.byUserWithChatPage(userId),
        id,
      );

      return { previousDoc };
    },
    onError: (_, __, context) => {
      if (context?.previousDoc) {
        queryClient.setQueryData(
          documentKeys.byUserPage(userId, documentLimit),
          context.previousDoc,
        );
      }
    },
    onSuccess: (_, deletedId: string) => {
      queryClient.removeQueries({
        queryKey: documentKeys.byId(deletedId),
      });
    },
  });
