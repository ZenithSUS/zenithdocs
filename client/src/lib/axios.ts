import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import config from "@/config/env";
import handleLogout from "@/utils/logout";
import useAuthStore from "@/features/auth/auth.store";

export const authApi = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": config.api.key,
  },
  withCredentials: true,
});

export const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": config.api.key,
  },
  withCredentials: false,
});

const attachToken = (req: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`;
  }
  return req;
};

const handleNewToken = (res: AxiosResponse) => {
  const newToken = res.headers["x-access-token"];
  if (newToken) {
    localStorage.setItem("accessToken", newToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    authApi.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    useAuthStore.getState().setAccessToken(newToken);
  }
  return res;
};

// Add a request interceptor
authApi.interceptors.request.use(attachToken);
api.interceptors.request.use(attachToken);

authApi.interceptors.response.use(handleNewToken, (err) => {
  const isAuthPage =
    window.location.pathname.startsWith("/login") ||
    window.location.pathname.startsWith("/register");

  // 401 means route handler tried to refresh and failed — session is dead
  if (err.response?.status === 401 && !isAuthPage) {
    handleLogout();
  }

  return Promise.reject(err);
});

// Add a response interceptor
api.interceptors.response.use(handleNewToken, (err) => {
  const isAuthPage =
    window.location.pathname.startsWith("/login") ||
    window.location.pathname.startsWith("/register");

  if (err.response?.status === 401 && !isAuthPage) {
    handleLogout();
  }
  return Promise.reject(err);
});
