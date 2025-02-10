import axios from "axios";

// Instância padrão para requisições JSON
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const newToken = sessionStorage.getItem("token");
  if (newToken) {
    config.headers["Authorization"] = `Bearer ${newToken}`;
  }
  return config;
});

const axiosMultipart = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 100000,
  headers: {
    "Content-Type": "multipart/form-data",
  }
});

axiosMultipart.interceptors.request.use((config) => {
  const newToken = sessionStorage.getItem("token");
  if (newToken) {
    config.headers["Authorization"] = `Bearer ${newToken}`;
  }
  return config;
});

export { axiosInstance, axiosMultipart };