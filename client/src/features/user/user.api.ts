import { api } from "@/lib/axios";
import { ResponseWithData } from "@/types/api";
import { User } from "@/types/user";

export const searchUsersByEmail = async (searchQuery: string) => {
  const { data: res } = await api.get<ResponseWithData<User[]>>(
    `/api/users/search`,
    {
      params: {
        q: searchQuery,
      },
    },
  );
  return res.data;
};
