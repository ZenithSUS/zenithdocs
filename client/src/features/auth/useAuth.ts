import { useQueryClient } from "@tanstack/react-query";
import { useAuthLogin } from "./useAuthLogin";
import { useAuthRegister } from "./useAuthRegister";
import { useAuthLogout } from "./useAuthLogout";

const useAuth = () => {
  const queryClient = useQueryClient();

  return {
    loginMutation: useAuthLogin(),
    logoutMutation: useAuthLogout(queryClient),
    registerMutation: useAuthRegister(queryClient),
  };
};

export default useAuth;
