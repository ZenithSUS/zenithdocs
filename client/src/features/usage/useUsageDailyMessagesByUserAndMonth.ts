import { AxiosError } from "@/types/api";
import { DailyMessagesUsage } from "@/types/usage";
import { useQuery } from "@tanstack/react-query";
import usageKeys from "./usage.keys";
import { fetchDailyMessagesUsageByUserAndMonth } from "./usage.api";

export const useUsageDailyMessagesByUserAndMonth = (
  userId: string,
  month: string,
) =>
  useQuery<DailyMessagesUsage, AxiosError>({
    queryKey: usageKeys.dailyMessagesByUserAndMonth(userId, month),
    queryFn: () => fetchDailyMessagesUsageByUserAndMonth(userId, month),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
