import { api } from "@/lib/axios";
import { ResponseWithData } from "@/types/api";
import { Usage } from "@/types/usage";

export const fetchUsageByUserAndMonth = async (
  userId: string,
  month: string,
) => {
  const { data: res } = await api.get<ResponseWithData<Usage>>(
    `/api/usages/user/${userId}/${month}`,
  );
  return res.data;
};

export const fetchLastSixMonthsUsageByUser = async (userId: string) => {
  const { data: res } = await api.get<ResponseWithData<Usage[]>>(
    `/api/usages/user/${userId}/last-six-months`,
  );
  return res.data;
};
