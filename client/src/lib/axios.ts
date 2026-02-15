import axios from "axios";
import config from "@/src/config/env";

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
  (err) => {
    if (err.response.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  },
);

export default api;
