// lib/axios.ts
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const message =
      error?.response?.data?.message || error.message || "Có lỗi xảy ra";

    // gán lại message cho error
    error.message = message;


    if (error.response?.status !== 403 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const res = await api.post("/auth/refresh");
      const newToken = res.data.accessToken;

      useAuthStore.getState().setAccessToken(newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (err) {
      useAuthStore.getState().clearState();
      return Promise.reject(err);
    }
  }
);

export default api;
