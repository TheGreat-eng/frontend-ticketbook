"use client"; // Bắt buộc vì có dùng useState và onClick

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await authService.login({ email, password });
      // Lưu Token vào Cookie để Middleware Server đọc được
      Cookies.set("accessToken", res.accessToken, { expires: 1 }); 
      alert("Đăng nhập thành công!");
      router.push("/dashboard"); // Chuyển hướng
    } catch (error) {
      alert("Đăng nhập thất bại. Kiểm tra lại email/mật khẩu!");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">TicketPro Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            type="password" 
            placeholder="Mật khẩu" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button onClick={handleLogin} className="w-full">Vào hệ thống</Button>
          <p className="text-center text-sm text-gray-500 mt-4">
  Chưa có tài khoản? <Link href="/register" className="text-blue-600 hover:underline">Đăng ký ngay</Link>
</p>
        </CardContent>
      </Card>
    </div>
  );
}