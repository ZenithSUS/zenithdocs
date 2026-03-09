import { useEffect } from "react";
import useAuthStore from "@/features/auth/auth.store";
import useAuth from "@/features/auth/useAuth";

/**
 * Hydrates the auth store once at layout level.
 * - Reads accessToken from localStorage into the store
 * - Syncs userId once the user query resolves
 */
const useAuthHydration = () => {
  const { setAccessToken, setUserId } = useAuthStore();
  const { me } = useAuth();
  const { data: user } = me;

  // Restore token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setAccessToken(token);
  }, [setAccessToken]);

  // Sync userId once user data resolves
  useEffect(() => {
    if (user?._id) setUserId(user._id);
  }, [user?._id, setUserId]);
};

export default useAuthHydration;
