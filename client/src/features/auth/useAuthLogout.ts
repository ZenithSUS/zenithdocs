import { QueryClient, useMutation } from "@tanstack/react-query";
import { authKeys } from "./auth.keys";
import { logout } from "./auth.api";

export const useAuthLogout = (queryClient: QueryClient) =>
  useMutation({
    mutationKey: authKeys.logout(),
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.user() });
    },
  });
