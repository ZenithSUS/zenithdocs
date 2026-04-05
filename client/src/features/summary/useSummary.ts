import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { Summary } from "@/types/summary";
import { ResponseWithPagedData } from "@/types/api";

import { useSummaryCreate } from "./useSummaryCreate";
import fetchLimits from "@/constants/fetch-limits";
import { useSummaryDelete } from "./useSummaryDelete";
import { useSummaryUpdate } from "./useSummaryUpdate";

export type SummaryPage = ResponseWithPagedData<Summary, "summaries">["data"];
export type SummaryByUserInfiniteData = InfiniteData<SummaryPage>;
export type SummaryByDocumentInfiniteData = InfiniteData<SummaryPage>;
export type UpdateVariables = {
  id: string;
  data: Partial<Summary>;
};
export type MutationContext = {
  previousSummaryByUser?: SummaryByUserInfiniteData;
  previousSummaryByDocument?: SummaryByDocumentInfiniteData;
};

const useSummary = (userId: string, documentId: string = "") => {
  const queryClient = useQueryClient();

  return {
    createSummaryMutation: useSummaryCreate(
      queryClient,
      userId,
      documentId,
      fetchLimits.summary,
    ),
    updateSummaryMutation: useSummaryUpdate(
      queryClient,
      userId,
      documentId,
      fetchLimits.summary,
    ),
    deleteSummaryMutation: useSummaryDelete(
      queryClient,
      userId,
      documentId,
      fetchLimits.summary,
    ),
  };
};

export default useSummary;
