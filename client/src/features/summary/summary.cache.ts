import { Summary } from "@/types/summary";
import { QueryClient } from "@tanstack/react-query";
import { SummaryByUserInfiniteData } from "./useSummary";

export const addInfiniteSummary = (
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  newSummary: Summary,
) => {
  queryClient.setQueryData<SummaryByUserInfiniteData>(queryKey, (oldData) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: [
        {
          ...oldData.pages[0],
          summaries: [newSummary, ...oldData.pages[0].summaries],
        },
        ...oldData.pages.slice(1),
      ],
    };
  });
};

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

export const removeRelatedInfiniteSummaryByDocumentIdFromCache = (
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
        summaries: page.summaries.filter((summary) => {
          const documentId =
            typeof summary.document === "object"
              ? summary.document._id
              : summary.document;
          return documentId !== deletedId;
        }),
      })),
    };
  });
};
