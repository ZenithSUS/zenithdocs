"use client";

import useAuthStore from "@/features/auth/auth.store";
import { useEffect } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setAccessToken } = useAuthStore();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setAccessToken(accessToken ?? null);
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
