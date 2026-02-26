import { authApi } from "./axios";

const initAuth = async () => {
  const token = localStorage.getItem("token");

  if (token) return true;

  try {
    const res = await authApi.post<{ data: { accessToken: string } }>(
      "/api/auth/refresh",
    );

    const newToken = res.data.data.accessToken;

    localStorage.setItem("accessToken", newToken);
    return true;
  } catch {
    localStorage.removeItem("accessToken");
    return false;
  }
};

export default initAuth;
