import { AxiosError } from "@/types/api";
import { Summary } from "@/types/summary";
import { useQuery } from "@tanstack/react-query";
import summaryKeys from "./summary.keys";
import { fetchSummaryById } from "./summary.api";

export const useSummaryById = (summaryId: string) =>
  useQuery<Summary, AxiosError>({
    queryKey: summaryKeys.byId(summaryId),
    queryFn: () => fetchSummaryById(summaryId),
    enabled: !!summaryId,
  });
