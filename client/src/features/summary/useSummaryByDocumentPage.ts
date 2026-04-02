import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { SummaryPage } from "./useSummary";
import { AxiosError } from "@/types/api";
import summaryKeys from "./summary.keys";
import fetchLimits from "@/constants/fetch-limits";
import { fetchSummaryByDocumentPaginated } from "./summary.api";

export const useSummaryByDocumentPage = (documentId: string) =>
  useInfiniteQuery<
    SummaryPage,
    AxiosError,
    InfiniteData<SummaryPage>,
    ReturnType<typeof summaryKeys.byDocumentPage>,
    number
  >({
    queryKey: summaryKeys.byDocumentPage(documentId, fetchLimits.summary),
    queryFn: ({ pageParam = 1 }) =>
      fetchSummaryByDocumentPaginated(
        documentId,
        pageParam,
        fetchLimits.summary,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!documentId,
  });
