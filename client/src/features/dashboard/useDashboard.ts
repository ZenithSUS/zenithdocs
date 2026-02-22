import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "./dashboard.keys";
import { getDashboardOverview } from "./dashboard.api";
import { AxiosError } from "@/types/api";
import { DashboardOverview } from "@/types/dashboard";

const useDashboard = (userId: string) => {
  // Get dashboard overview
  const dashboardOverview = useQuery<DashboardOverview, AxiosError>({
    queryKey: dashboardKeys.overview(),
    queryFn: () => getDashboardOverview(userId),
    enabled: !!userId,
  });

  return { dashboardOverview };
};

export default useDashboard;
