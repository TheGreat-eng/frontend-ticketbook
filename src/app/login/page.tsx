"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
// Nhớ import UI components của bạn (Input, Button...)

// 1. Zod schema để check lỗi người dùng nhập chưa đủ (bắt trước khi gọi API)
const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // 2. Hàm gọi API Login
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Gọi API lên Spring Boot
      const response = await authService.login(data);
      
      // Lúc này Backend đã trả về JSON: { status: 200, message: "...", data: { accessToken: "..." } }
      // Và authService đã return response.data.data
      const token = response.accessToken;

      // Lưu token vào Cookie
      Cookies.set("accessToken", token, { expires: 1 }); // expires: 1 ngày

      toast.success("Đăng nhập thành công!");
      
      // Đẩy vào trang dashboard
      router.push("/dashboard");
      
    } catch (error: any) {
      // IN RA CONSOLE ĐỂ TÌM ĐÚNG BỆNH
      console.error("Lỗi thật sự từ Axios:", error);
      
      if (!error.response) {
         toast.error("Không thể kết nối đến Backend. Hãy kiểm tra xem Server đã chạy chưa!");
      } else {
         toast.error(error.response?.data?.message || "Email hoặc mật khẩu không đúng!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Dưới này bạn bỏ phần giao diện của bạn vào
    // Nhớ đổi thẻ <form> bao bọc các input và có: onSubmit={handleSubmit(onSubmit)}
    // Ví dụ cơ bản để bạn ráp vào UI của bạn:
    <div className="flex h-screen items-center justify-center bg-slate-50">
      {/* ... UI GIAO DIỆN CỦA BẠN ... */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div>
          <input 
            {...register("email")}
            placeholder="test@gmail.com" 
            disabled={isLoading}
            className="border p-2 w-full rounded"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <input 
            type="password"
            {...register("password")}
            placeholder="......" 
            disabled={isLoading}
            className="border p-2 w-full rounded"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="bg-black text-white p-2 w-full rounded">
          {isLoading ? "Đang xử lý..." : "Vào hệ thống"}
        </button>

      </form>
    </div>
  );
}