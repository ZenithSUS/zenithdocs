import { QueryClient, useMutation } from "@tanstack/react-query";
import { register, RegisterResponse } from "./auth.api";
import { AxiosError } from "@/types/api";
import { AuthInput } from "@/types/input";
import { authKeys } from "./auth.keys";

export const useAuthRegister = (queryClient: QueryClient) =>
  useMutation<RegisterResponse, AxiosError, AuthInput>({
    mutationFn: register,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: authKeys.user() }),
  });
