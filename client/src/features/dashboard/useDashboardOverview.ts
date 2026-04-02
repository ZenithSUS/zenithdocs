import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "./dashboard.keys";
import { getDashboardOverview } from "./dashboard.api";
import { AxiosError } from "@/types/api";
import { DashboardOverview } from "@/types/dashboard";

export const useDashboardOverview = (userId: string) =>
  useQuery<DashboardOverview, AxiosError>({
    queryKey: dashboardKeys.overview(),
    queryFn: () => getDashboardOverview(userId),
    enabled: !!userId,
  });
