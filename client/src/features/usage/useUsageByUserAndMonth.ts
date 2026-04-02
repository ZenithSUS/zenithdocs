import { AxiosError } from "@/types/api";
import { Usage } from "@/types/usage";
import { useQuery } from "@tanstack/react-query";
import usageKeys from "./usage.key";
import { fetchUsageByUserAndMonth } from "./usage.api";

export const useUsageByUserAndMonth = (userId: string, month: string) =>
  useQuery<Usage, AxiosError>({
    queryKey: usageKeys.byUserAndMonth(userId, month),
    queryFn: () => fetchUsageByUserAndMonth(userId, month),
    enabled: !!userId && !!month,
  });
