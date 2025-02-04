import axios from "axios";

const token = sessionStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  }
});

axiosInstance.interceptors.request.use((config) => {
  const newToken = sessionStorage.getItem("token");
  if (newToken) {
    config.headers["Authorization"] = `Bearer ${newToken}`;
  }
  return config;
});

export default axiosInstance;