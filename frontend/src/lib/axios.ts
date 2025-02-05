import axiosLib from "axios";
import Cookies from "js-cookie";

const BACKEND_URL = import.meta.env.VITE_API_URL;

export const axios = axiosLib.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access

      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
