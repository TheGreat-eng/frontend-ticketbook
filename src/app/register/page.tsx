"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await authService.register({ email, password });
      alert("Đăng ký thành công! Hãy đăng nhập nhé.");
      router.push("/login");
    } catch (error: any) {
      alert(error.response?.data || "Đăng ký thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Tạo Tài Khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={isLoading}
          />
          <Input 
            type="password" 
            placeholder="Mật khẩu" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            disabled={isLoading}
          />
          <Button onClick={handleRegister} className="w-full" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng Ký"}
          </Button>
          <p className="text-center text-sm text-gray-500">
            Đã có tài khoản? <Link href="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}