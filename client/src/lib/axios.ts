import axios, { InternalAxiosRequestConfig } from "axios";
import config from "@/config/env";
import handleLogout from "@/utils/logout";

const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    "x-api-key": config.api.key,
  },
  withCredentials: true,
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  // If token exists, add it to the request headers
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isRefreshRequest = originalRequest.url?.includes("/api/auth/refresh");
    const isMeRequest = originalRequest.url?.includes("/api/auth/me");
    const isAuthPage =
      window.location.pathname.startsWith("/login") ||
      window.location.pathname.startsWith("/register");

    // 403: token expired or invalid — try to refresh
    if (
      err.response?.status === 403 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      !isMeRequest
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        // If refresh token fails, hard redirect
        handleLogout();
        return Promise.reject(err);
      }
    }

    // 401: no token was sent or user doesn't exist — hard redirect
    if (err.response?.status === 401 && !isRefreshRequest && !isAuthPage) {
      handleLogout();
    }

    return Promise.reject(err);
  },
);

async function refreshToken(): Promise<string> {
  const res = await api.post<{ data: { accessToken: string } }>(
    "/api/auth/refresh",
  );

  const newToken = res.data.data.accessToken;

  localStorage.setItem("token", newToken);

  return newToken;
}

export default api;
