// Trong file src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/userService";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    userService.getMyProfile()
      .then(res => setData(res))
      .catch(err => setError("Không thể lấy dữ liệu mật. Có vẻ Token đã hỏng!"));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Kiểm tra API Bảo mật</h1>
      
      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      {data ? (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <p><strong>Server xác nhận:</strong> {data.message}</p>
          <p><strong>Email của bạn:</strong> {data.username}</p>
          <p><strong>Quyền hạn (từ Server):</strong> {JSON.stringify(data.authorities)}</p>
        </div>
      ) : (
        <p className="mt-4">Đang xác thực với Server...</p>
      )}
    </div>
  );
}