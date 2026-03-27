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


import { useAuthStore } from "@/store/useAuthStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const loginAction = useAuthStore((state) => state.login);


  // 2. Hàm gọi API Login
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      
      // CHỈ CẦN 1 DÒNG NÀY (Nó đã tự lưu cookie và decode lưu vào Store)
      loginAction(response.accessToken, response.refreshToken);

      toast.success("Đăng nhập thành công!");
      router.push("/dashboard");
    } catch (error: any) { 
      console.log("Error");
     }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_45%,#f5f3ff_100%)] px-4 py-8">
      <div className="pointer-events-none absolute -left-28 top-20 h-64 w-64 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-indigo-300/30 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-6 md:grid-cols-2">
        <section className="hidden rounded-3xl border border-white/50 bg-white/55 p-8 shadow-sm backdrop-blur md:block">
          <p className="inline-flex rounded-full bg-black/90 px-3 py-1 text-xs font-medium text-white">
            Ticket Portal
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900">
            Đăng nhập để quản lý vé dễ hơn mỗi ngày
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Theo dõi yêu cầu, cập nhật trạng thái realtime và phối hợp đội ngũ trên
            một giao diện gọn gàng, tập trung vào tốc độ xử lý.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-700">
            <p className="rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2">
              Theo dõi trạng thái ticket rõ ràng
            </p>
            <p className="rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2">
              Đăng nhập nhanh, thao tác mượt trên cả mobile
            </p>
            <p className="rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2">
              Tập trung xử lý công việc thay vì tìm kiếm thông tin
            </p>
          </div>
        </section>

        <Card className="mx-auto w-full max-w-md rounded-3xl border border-white/70 bg-white/80 py-0 shadow-xl backdrop-blur">
          <CardHeader className="space-y-1 border-b border-slate-100 px-6 py-6">
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Chào mừng quay lại
            </CardTitle>
            <CardDescription className="text-slate-600">
              Nhập thông tin tài khoản để vào hệ thống.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="ban@example.com"
                  disabled={isLoading}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Mật khẩu
                </label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="mt-1 h-10 w-full">
                {isLoading ? "Đang xử lý..." : "Vào hệ thống"}
              </Button>

              <p className="pt-1 text-center text-sm text-slate-600">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="font-medium text-slate-900 underline-offset-4 hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}