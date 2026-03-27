"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Calendar, History, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils"; // Hàm gộp class có sẵn khi cài Shadcn

export default function Sidebar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const menuItems = [
    { name: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
    { name: "Sự kiện", href: "/dashboard/events", icon: Calendar },
    { name: "Vé của tôi", href: "/dashboard/my-tickets", icon: History },
  ];

  // Chỉ Admin mới thấy menu quản lý User
  if (isAdmin) {
    menuItems.push({ name: "Quản lý User", href: "/dashboard/users", icon: Users });
  }

  return (
    <aside className="w-64 hidden md:flex flex-col border-r h-screen sticky top-0 pt-20 bg-gray-50/50">
      <div className="px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}