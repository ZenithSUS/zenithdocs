import { useMutation } from "@tanstack/react-query";
import { login, LoginResponse } from "./auth.api";
import { AxiosError } from "@/types/api";
import { AuthInput } from "@/types/input";

export const useAuthLogin = () =>
  useMutation<LoginResponse, AxiosError, AuthInput>({
    mutationFn: login,
  });
