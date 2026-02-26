import axios from "axios";
import config from "@/config/env";
import handleLogout from "@/utils/logout";
import useAuthStore from "@/features/auth/auth.store";

const api = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": config.api.key,
  },
  withCredentials: true,
});

api.interceptors.request.use((req) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`;
  }
  return req;
});

api.interceptors.response.use(
  (res) => {
    // Route handler silently refreshed the token — update localStorage
    const newToken = res.headers["x-access-token"];
    if (newToken) {
      localStorage.setItem("accessToken", newToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      useAuthStore.getState().setAccessToken(newToken);
    }
    return res;
  },
  (err) => {
    const isAuthPage =
      window.location.pathname.startsWith("/login") ||
      window.location.pathname.startsWith("/register");

    // 401 means route handler tried to refresh and failed — session is dead
    if (err.response?.status === 401 && !isAuthPage) {
      handleLogout();
    }

    return Promise.reject(err);
  },
);

export default api;
