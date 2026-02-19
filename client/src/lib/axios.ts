import axios, { InternalAxiosRequestConfig } from "axios";
import config from "@/config/env";

const api = axios.create({
  baseURL: config.api.baseUrl,
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

    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        return Promise.reject(refreshError);
      }
    }

    if (err.response?.status === 401) {
      localStorage.removeItem("token");
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
