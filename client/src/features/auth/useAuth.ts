import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  login,
  LoginResponse,
  register,
  RegisterResponse,
} from "@/features/auth/auth.api";
import { authKeys } from "@/features/auth/auth.keys";
import { AxiosError } from "@/types/api";
import { AuthInput } from "@/types/input";
import { User } from "@/types/user";

const useAuth = () => {
  const queryClient = useQueryClient();

  // Login
  const loginMutation = useMutation<LoginResponse, AxiosError, AuthInput>({
    mutationFn: login,
  });

  // Register
  const registerMutation = useMutation<RegisterResponse, AxiosError, AuthInput>(
    {
      mutationFn: register,
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: authKeys.user() }),
    },
  );

  // Me
  const me = useQuery<User | null, AxiosError>({
    queryKey: authKeys.user(),
    queryFn: getMe,
  });

  return {
    me,
    loginMutation,
    registerMutation,
    loginLoading: loginMutation.isPending,
  };
};

export default useAuth;
