"use client";

import DashboardLoading from "@/components/dashboard/DashboardLoading";
import { refreshToken } from "@/features/auth/auth.api";
import useAuthStore from "@/features/auth/auth.store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const [isReady, setIsReady] = useState(false);
  const { setToken } = useAuthStore();
  const router = useRouter();

  const isRootRoute = pathName === "/";
  const isProtectedRoute = pathName.startsWith("/dashboard");
  const isAuthRoute =
    pathName.startsWith("/login") || pathName.startsWith("/register");

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("refreshToken");

      if (!token && isProtectedRoute) {
        router.replace("/login");
        return;
      }

      if (token && (isAuthRoute || isRootRoute)) {
        router.replace("/dashboard");
        return;
      }

      if (token) {
        try {
          const res = await refreshToken(token);
          setToken(res.accessToken);
        } catch (error) {
          localStorage.removeItem("refreshToken");
          router.replace("/login");
          return;
        }
      }

      setIsReady(true);
    };

    initAuth();
  }, [isAuthRoute, isProtectedRoute, isRootRoute, router]);

  if (!isReady) return <DashboardLoading />;

  return <>{children}</>;
};

export default AuthProvider;
