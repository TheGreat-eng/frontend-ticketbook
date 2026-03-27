import { redirect } from "next/navigation";

export default function RootPage() {
  // Tự động chuyển hướng người dùng sang trang login khi vào trang chủ
  redirect("/login");
}