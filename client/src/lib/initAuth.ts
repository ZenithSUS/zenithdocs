import api from "./axios";

const initAuth = async () => {
  const token = localStorage.getItem("token");

  if (token) return true;

  try {
    const res = await api.post<{ data: { accessToken: string } }>(
      "/api/auth/refresh",
    );

    const newToken = res.data.data.accessToken;

    localStorage.setItem("token", newToken);
    return true;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
};

export default initAuth;
