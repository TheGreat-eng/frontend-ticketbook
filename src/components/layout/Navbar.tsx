"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User, Ticket, Bell } from "lucide-react";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Ticket className="w-6 h-6" />
          <span>TicketPro</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5 text-gray-500" />
          </Button>

          <div className="flex items-center gap-3 pl-4 border-l">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.sub}</p>
              <p className="text-xs text-gray-500">
                {isAdmin ? "Quản trị viên" : "Khách hàng"}
              </p>
            </div>
            
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <User className="w-5 h-5" />
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Thoát
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}