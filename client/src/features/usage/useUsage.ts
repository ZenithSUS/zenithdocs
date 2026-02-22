import { useQuery } from "@tanstack/react-query";
import usageKeys from "./usage.key";
import { getUsageByUserAndMonth } from "./usage.api";

const useUsage = (userId: string, month: string) => {
  const usageByUserAndMonth = useQuery({
    queryKey: usageKeys.byUserAndMonth(userId, month),
    queryFn: () => getUsageByUserAndMonth(userId, month),
    enabled: !!userId && !!month,
  });

  return { usageByUserAndMonth };
};

export default useUsage;
