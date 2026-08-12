import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
});

// Attach token automatically if present
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auto logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("userInfo");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const getUploadsUrl = () => import.meta.env.VITE_UPLOADS_URL || "";

export default api;
