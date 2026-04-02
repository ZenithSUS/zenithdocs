import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { SummaryPage } from "./useSummary";
import { AxiosError } from "axios";
import summaryKeys from "./summary.keys";
import { fetchSummaryByUserPaginated } from "./summary.api";
import fetchLimits from "@/constants/fetch-limits";

export const useSummaryByUserPage = (userId: string) =>
  useInfiniteQuery<
    SummaryPage,
    AxiosError,
    InfiniteData<SummaryPage>,
    ReturnType<typeof summaryKeys.byUserPage>,
    number
  >({
    queryKey: summaryKeys.byUserPage(userId, fetchLimits.summary),
    queryFn: ({ pageParam = 1 }) =>
      fetchSummaryByUserPaginated(userId, pageParam, fetchLimits.summary),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!userId,
  });
