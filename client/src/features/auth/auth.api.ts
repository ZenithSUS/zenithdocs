import api from "@/lib/axios";
import { Response, ResponseWithUser } from "@/types/api";
import { AuthInput } from "@/types/input";

export type LoginResponse = {
  data: {
    accessToken: string;
  };
} & Response;

export type RegisterResponse = ResponseWithUser;

export const login = async ({ email, password }: AuthInput) => {
  const { data } = await api.post<LoginResponse>("/api/auth/login", {
    email,
    password,
  });
  return data;
};

export const register = async ({ email, password }: AuthInput) => {
  const { data } = await api.post<RegisterResponse>("/api/auth/register", {
    email,
    password,
  });
  return data;
};

export const getMe = async () => {
  const { data } =
    await api.get<Omit<ResponseWithUser, "message">>("/api/auth/me");
  return data.data;
};

export const logout = async () => {
  const { data } = await api.post("/api/auth/logout");
  return data;
};
