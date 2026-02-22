import api from "@/lib/axios";
import { ResponseWithData } from "@/types/api";
import { Usage } from "@/types/usage";

export const getUsageByUserAndMonth = async (userId: string, month: string) => {
  const { data } = await api.get<ResponseWithData<Usage>>(
    `/api/usages/user/${userId}/${month}`,
  );
  return data.data;
};
