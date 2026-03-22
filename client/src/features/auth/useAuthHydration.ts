import { useEffect } from "react";
import useAuthStore from "@/features/auth/auth.store";
import useAuth from "@/features/auth/useAuth";

/**
 * Hydrates the auth store once at layout level.
 * - Reads accessToken from localStorage into the store
 * - Syncs userId once the user query resolves
 */
const useAuthHydration = () => {
  const { setAccessToken, setUserId, setEmail, email, userId, accessToken } =
    useAuthStore();
  const { me } = useAuth();
  const { data: user } = me;

  // Restore token from localStorage on mount
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    setAccessToken(token ?? null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync userId and email
  useEffect(() => {
    if (user?._id) setUserId(user._id);
    if (user?.email) setEmail(user.email);
  }, [user?._id, user?.email, setUserId, setEmail]);
};

export default useAuthHydration;
