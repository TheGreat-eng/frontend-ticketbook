// src/components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth(); // Mỗi lần load lại trang web, tự động lấy token từ Cookie nạp vào Store
  }, [checkAuth]);

  return <>{children}</>;
}