import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 100000,
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