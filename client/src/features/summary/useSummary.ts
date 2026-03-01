import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import summaryKeys from "./summary.keys";
import {
  createSummary,
  fetchSummaryById,
  fetchSummaryByUserPaginated,
  updateSummaryById,
  deleteSummaryById,
  fetchSummaryByDocumentPaginated,
} from "./summary.api";
import { Summary } from "@/types/summary";
import { AxiosError, ResponseWithPagedData } from "@/types/api";
import { removeInfiniteSummary, updateInfiniteSummary } from "./summary.cache";

type SummaryPage = ResponseWithPagedData<Summary, "summaries">["data"];
type SummaryByUserInfiniteData = InfiniteData<SummaryPage>;
type SummaryByDocumentInfiniteData = InfiniteData<SummaryPage>;
type UpdateVariables = {
  id: string;
  data: Partial<Summary>;
};
type MutationContext = {
  previousSummaryByUser?: SummaryByUserInfiniteData;
  previousSummaryByDocument?: SummaryByDocumentInfiniteData;
};

/**
 * A hook that provides the functionality to create, read, update and delete summaries.
 *
 * @param {string} userId - The ID of the user who owns the summaries.
 * @param {string} summaryId - The ID of the summary to be read or updated.
 * @returns An object containing the following properties:
 *   summariesByUserPage: A hook that provides the functionality to get summaries by user paginated.
 *   summaryById: A hook that provides the functionality to get a summary by its ID.
 *   createSummaryMutation: A hook that provides the functionality to create a new summary.
 *   updateSummaryMutation: A hook that provides the functionality to update a summary.
 *   deleteSummaryMutation: A hook that provides the functionality to delete a summary.
 */
const useSummary = (
  userId: string,
  documentId: string = "",
  summaryId: string = "",
) => {
  const queryClient = useQueryClient();
  const summaryLimit = 10;

  // Create summary
  const createSummaryMutation = useMutation<
    Summary,
    AxiosError,
    Partial<Summary>
  >({
    mutationKey: summaryKeys.create(),
    mutationFn: (data: Partial<Summary>) => createSummary(data),
    onSuccess: (newSummary: Summary) => {
      queryClient.setQueryData<SummaryByUserInfiniteData>(
        summaryKeys.byUserPage(userId, summaryLimit),
        (oldData) => {
          if (!oldData) return oldData;

          const firstPage = oldData.pages[0];

          return {
            ...oldData,
            pages: [
              {
                ...firstPage,
                summaries: [newSummary, ...firstPage.summaries],
              },
              ...oldData.pages.slice(1),
            ],
          };
        },
      );

      queryClient.setQueryData<SummaryByUserInfiniteData>(
        summaryKeys.byDocumentPage(documentId, summaryLimit),
        (oldData) => {
          if (!oldData) return oldData;

          const firstPage = oldData.pages[0];

          return {
            ...oldData,
            pages: [
              {
                ...firstPage,
                summaries: [newSummary, ...firstPage.summaries],
              },
              ...oldData.pages.slice(1),
            ],
          };
        },
      );
    },
  });

  // Get summary by id
  const summaryById = useQuery<Summary, AxiosError>({
    queryKey: summaryKeys.byId(summaryId),
    queryFn: () => fetchSummaryById(summaryId),
    enabled: !!summaryId,
  });

  // Get summaries by user paginated
  const summariesByUserPage = useInfiniteQuery<
    SummaryPage,
    AxiosError,
    InfiniteData<SummaryPage>,
    ReturnType<typeof summaryKeys.byUserPage>,
    number
  >({
    queryKey: summaryKeys.byUserPage(userId, summaryLimit),
    queryFn: ({ pageParam = 1 }) =>
      fetchSummaryByUserPaginated(userId, pageParam, summaryLimit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!userId,
  });

  // Get summaries by document paginated
  const summariesByDocumentPage = useInfiniteQuery<
    SummaryPage,
    AxiosError,
    InfiniteData<SummaryPage>,
    ReturnType<typeof summaryKeys.byDocumentPage>,
    number
  >({
    queryKey: summaryKeys.byDocumentPage(documentId, summaryLimit),
    queryFn: ({ pageParam = 1 }) =>
      fetchSummaryByDocumentPaginated(documentId, pageParam, summaryLimit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!documentId,
  });

  // Update Summary
  const updateSummaryMutation = useMutation<
    Summary,
    AxiosError,
    UpdateVariables,
    MutationContext
  >({
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

  const deleteSummaryMutation = useMutation<
    Summary,
    AxiosError,
    string,
    MutationContext
  >({
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

  return {
    summariesByUserPage,
    summariesByDocumentPage,
    summaryById,
    createSummaryMutation,
    updateSummaryMutation,
    deleteSummaryMutation,
  };
};

export default useSummary;
