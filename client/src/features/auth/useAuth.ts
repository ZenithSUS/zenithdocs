import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  login,
  LoginResponse,
  register,
  RegisterResponse,
} from "@/features/auth/auth.api";
import { authKeys } from "@/features/auth/auth.keys";
import { AxiosError } from "@/types/api";
import { AuthInput } from "@/types/input";

const useAuth = () => {
  const queryClient = useQueryClient();

  // Login
  const loginMutation = useMutation<LoginResponse, AxiosError, AuthInput>({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data);
    },
  });

  // Register
  const registerMutation = useMutation<RegisterResponse, AxiosError, AuthInput>(
    {
      mutationFn: register,
      onSuccess: (data) => {
        queryClient.setQueryData(authKeys.user(), data);
      },
    },
  );

  return {
    loginMutation,
    registerMutation,
    loginLoading: loginMutation.isPending,
  };
};

export default useAuth;
