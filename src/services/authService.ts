import axiosClient from "@/lib/axios";
import { LoginRequest, AuthResponse } from "@/types/auth";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post("/auth/login", data);
    // TRƯỚC ĐÂY: return response.data;
    // BÂY GIỜ: response.data của axios chính là class ApiResponse của Spring Boot
    // Nên token thực sự nằm ở response.data.data
    return response.data.data; 
  },

  register: async (data: LoginRequest) => {
    const response = await axiosClient.post("/auth/register", data);
    return response.data;
  },
};