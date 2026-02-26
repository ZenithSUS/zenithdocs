"use client";

import DashboardLoading from "@/components/dashboard/DashboardLoading";
import useAuthStore from "@/features/auth/auth.store";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const [isReady, setIsReady] = useState(false);
  const { setAccessToken } = useAuthStore();

  const isProtectedRoute = pathName.startsWith("/dashboard");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      setAccessToken(accessToken);
    } else if (isProtectedRoute) {
      // Middleware should have caught this, but clear store just in case
      setAccessToken(null);
    }

    setIsReady(true); // always ready — middleware handles redirects
  }, [pathName]);

  if (!isReady) return <DashboardLoading />;

  return <>{children}</>;
};

export default AuthProvider;
