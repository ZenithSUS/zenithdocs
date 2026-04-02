import { AxiosError } from "@/types/api";
import { Usage } from "@/types/usage";
import { useQuery } from "@tanstack/react-query";
import usageKeys from "./usage.key";
import { fetchLastSixMonthsUsageByUser } from "./usage.api";

export const useUsageByUserSixMonths = (userId: string, month: string) =>
  useQuery<Usage[], AxiosError>({
    queryKey: usageKeys.byUserSixMonths(userId),
    queryFn: () => fetchLastSixMonthsUsageByUser(userId),
    enabled: !!userId && !!month,
  });
