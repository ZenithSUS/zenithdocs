import { AxiosError } from "@/types/api";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "./auth.api";
import { authKeys } from "./auth.keys";

export const useAuthMe = () =>
  useQuery<User | null, AxiosError>({
    queryKey: authKeys.user(),
    queryFn: getMe,
  });
