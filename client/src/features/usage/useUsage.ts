import { useQuery } from "@tanstack/react-query";
import usageKeys from "./usage.key";
import { fetchUsageByUserAndMonth } from "./usage.api";

const useUsage = (userId: string, month: string) => {
  const usageByUserAndMonth = useQuery({
    queryKey: usageKeys.byUserAndMonth(userId, month),
    queryFn: () => fetchUsageByUserAndMonth(userId, month),
    enabled: !!userId && !!month,
  });

  return { usageByUserAndMonth };
};

export default useUsage;
