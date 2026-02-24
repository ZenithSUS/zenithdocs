import { ResponseWithPagedData } from "@/types/api";
import { Summary } from "@/types/summary";
import { InfiniteData, QueryClient } from "@tanstack/react-query";

type SummaryPage = ResponseWithPagedData<Summary, "summaries">["data"];
type SummaryByUserInfiniteData = InfiniteData<SummaryPage>;

export const updateInfiniteSummary = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  updatedSummary: Summary,
) => {
  queryClient.setQueryData<SummaryByUserInfiniteData>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        summaries: page.summaries.map((summary) =>
          summary._id === updatedSummary._id ? updatedSummary : summary,
        ),
      })),
    };
  });
};

export const removeInfiniteSummary = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  deletedId: string,
) => {
  queryClient.setQueryData<SummaryByUserInfiniteData>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page) => ({
        ...page,
        summaries: page.summaries.filter(
          (summary) => summary._id !== deletedId,
        ),
      })),
    };
  });
};
