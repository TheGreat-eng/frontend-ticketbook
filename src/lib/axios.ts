import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api", // Cổng của Spring Boot
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động đính kèm Token RSA vào Header nếu đã đăng nhập
axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;