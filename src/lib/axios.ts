import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Kẹp Access Token vào mỗi request gửi đi
axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Biến cờ để tránh vòng lặp vô hạn
let isRefreshing = false;

// 2. Chặn Response trả về để kiểm tra lỗi 401
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Hết token) và url không phải là login/refresh
    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/refresh" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return Promise.reject(error); // Nếu đang làm mới thì bỏ qua các request khác
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          throw new Error("Không có refresh token");
        }

        // Gọi API làm mới token (dùng axios thuần để không bị kẹt vào interceptor này)
        const res = await axios.post("http://localhost:8080/api/auth/refresh", {
          refreshToken: refreshToken,
        });

        const newAccessToken = res.data.data.accessToken;

        // Lưu Access Token mới vào Cookie
        Cookies.set("accessToken", newAccessToken, { expires: 1 / 24 });

        // Cập nhật lại header của request bị lỗi và GỌI LẠI nó
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        isRefreshing = false;
        
        return axiosClient(originalRequest); // Thực hiện lại API bị lỗi trước đó
        
      } catch (err) {
        // Nếu Refresh Token cũng hết hạn nốt -> Bắt buộc Logout
        isRefreshing = false;
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;