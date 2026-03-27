import axiosClient from "@/lib/axios";
import { LoginRequest, AuthResponse } from "@/types/auth";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post("/auth/login", data);
    return response.data;
  },


  register: async (data: LoginRequest) => {
    const response = await axiosClient.post("/auth/register", data);
    return response.data;
  },
  
  // Bạn có thể thêm register, logout ở đây sau
};


