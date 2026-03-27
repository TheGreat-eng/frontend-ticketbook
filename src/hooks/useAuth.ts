import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/auth";

export const useAuth = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    
    // Kiểm tra thêm xem token có phải là chuỗi 'undefined' do code cũ lưu nhầm không
    if (token && token !== "undefined") {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token không hợp lệ:", error);
        setUser(null);
        // QUAN TRỌNG: Nếu token lỗi, tự động xóa cookie rác đi để lần sau không bị crash
        Cookies.remove("accessToken");
      }
    }
  }, []);

  const logout = () => {
    Cookies.remove("accessToken");
    window.location.href = "/login";
  };

  return { user, logout, isAdmin: user?.roles.includes("ROLE_ADMIN") };
};