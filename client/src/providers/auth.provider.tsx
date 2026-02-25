"use client";

import DashboardLoading from "@/components/dashboard/DashboardLoading";
import initAuth from "@/lib/initAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    initAuth().then((isAuthenticated) => {
      const isProctectedRoute = pathName.startsWith("/dashboard");

      if (!isAuthenticated && isProctectedRoute) {
        router.push("/login");
      } else {
        setIsReady(true);
      }
    });
  }, []);

  if (!isReady) return <DashboardLoading />;

  return <>{children}</>;
};

export default AuthProvider;
