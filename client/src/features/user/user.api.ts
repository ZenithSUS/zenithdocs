import { api } from "@/lib/axios";
import { ResponseWithData } from "@/types/api";
import { User } from "@/types/user";

export const matchUserByEmail = async (email: string) => {
  const { data: res } = await api.post<
    ResponseWithData<Pick<User, "_id" | "email">>
  >(`/api/users/match-email`, { email });
  return res.data;
};
