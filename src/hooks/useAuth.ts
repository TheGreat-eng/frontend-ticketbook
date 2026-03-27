import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/auth";

export const useAuth = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token không hợp lệ:", error);
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    Cookies.remove("accessToken");
    window.location.href = "/login";
  };

  return { user, logout, isAdmin: user?.roles.includes("ROLE_ADMIN") };
};