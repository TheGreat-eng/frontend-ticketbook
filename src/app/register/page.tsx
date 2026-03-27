"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner"; // Import thư viện thông báo
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 1. Định nghĩa Schema kiểm tra lỗi ngay tại Frontend
const registerSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

// Tạo type từ schema
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 2. Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "" }
  });

  // 3. Hàm Submit
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      // Backend giờ trả về JSON: { status: 200, message: "...", data: null }
      toast.success(response.message || "Đăng ký thành công!");
      router.push("/login");
    } catch (error: any) {
      // Bắt lỗi từ Backend (từ class ApiResponse)
      const errorMsg = error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!";
      toast.error(errorMsg);
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
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Input Email */}
            <div>
              <Input 
                placeholder="Email" 
                disabled={isLoading}
                {...register("email")} // Gắn hook form vào input
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Input Password */}
            <div>
              <Input 
                type="password" 
                placeholder="Mật khẩu" 
                disabled={isLoading}
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đăng Ký"}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Đã có tài khoản? <Link href="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}