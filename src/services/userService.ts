import axiosClient from "@/lib/axios";

export const userService = {
  getMyProfile: async () => {
    const response = await axiosClient.get("/users/me");
    return response.data;
  },
};