// src/axiosConfig.js
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
// Tạo một instance của axios
const axiosInstance = axios.create({
  baseURL: BASE_URL+"/api/", // URL của API
  timeout: 10000, // Thời gian timeout (ms)
  headers: {
    "Content-Type": "application/json", // Loại dữ liệu mặc định
  },
});
  
// Thêm interceptor cho request
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm token nếu có
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Xử lý lỗi trước khi request được gửi
    return Promise.reject(error);
  }
);

// Thêm interceptor cho response
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("Error: ", error);

    // Check if the error is a 401 and the request is not for login
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login")
    ) {
      window.location.href = "/signin";
    }
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry  
    ) {
      originalRequest._retry = true; // Mark the request as retried
      const refreshToken = localStorage.getItem("refreshToken"); // Get refreshToken

      try {
        // Send request to refresh token
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {
            refreshToken,
          }
        );

        // Save new accessToken
        localStorage.setItem("accessToken", data.accessToken);

        // Update Authorization header
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, handle logout or notify
        console.error("Refresh token failed, logging out...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
