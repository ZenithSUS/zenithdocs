import api from "@/lib/axios";
import { DashboardOverview } from "@/types/dashboard";

interface DashboardOverviewResponse {
  success: boolean;
  message: string;
  data: DashboardOverview;
}

export const getDashboardOverview = async (userId: string) => {
  const { data } = await api.get<DashboardOverviewResponse>(
    `/api/dashboard/${userId}`,
  );
  return data.data;
};
