import { useQuery } from "@tanstack/react-query";
import usageKeys from "./usage.key";
import {
  fetchLastSixMonthsUsageByUser,
  fetchUsageByUserAndMonth,
} from "./usage.api";
import { Usage } from "@/types/usage";
import { AxiosError } from "@/types/api";

const useUsage = (userId: string, month: string) => {
  // Fetch usage by user ID and month
  const usageByUserAndMonth = useQuery<Usage, AxiosError>({
    queryKey: usageKeys.byUserAndMonth(userId, month),
    queryFn: () => fetchUsageByUserAndMonth(userId, month),
    enabled: !!userId && !!month,
  });

  // Fetch last six months usage by user ID
  const usageByUserSixMonths = useQuery<Usage[], AxiosError>({
    queryKey: usageKeys.byUserSixMonths(userId),
    queryFn: () => fetchLastSixMonthsUsageByUser(userId),
    enabled: !!userId && !!month,
  });

  return { usageByUserAndMonth, usageByUserSixMonths };
};

export default useUsage;
