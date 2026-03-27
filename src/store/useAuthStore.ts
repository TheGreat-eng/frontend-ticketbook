// src/store/useAuthStore.ts
import { create } from "zustand";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/auth";

interface AuthState {
  user: DecodedToken | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // ĐÃ SỬA THÀNH 2 THAM SỐ
  login: (accessToken: string, refreshToken: string) => void; 
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,

  login: (accessToken: string, refreshToken: string) => {
    Cookies.set("accessToken", accessToken, { expires: 1/24 }); // Access token sống 1 tiếng ở Cookie
    Cookies.set("refreshToken", refreshToken, { expires: 7 }); // Refresh token sống 7 ngày

    const decoded = jwtDecode<DecodedToken>(accessToken);
    set({
      user: decoded,
      isAuthenticated: true,
      isAdmin: decoded.roles.includes("ROLE_ADMIN"),
    });
  },

  logout: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken"); // XÓA CẢ REFRESH TOKEN
    set({ user: null, isAuthenticated: false, isAdmin: false });
    window.location.href = "/login";
  },

  checkAuth: () => {
    const token = Cookies.get("accessToken");
    if (token && token !== "undefined") {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        set({
          user: decoded,
          isAuthenticated: true,
          isAdmin: decoded.roles.includes("ROLE_ADMIN"),
        });
      } catch (error) {
        Cookies.remove("accessToken");
        set({ user: null, isAuthenticated: false, isAdmin: false });
      }
    }
  },
}));