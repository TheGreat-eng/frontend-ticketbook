"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios";
import { toast } from "sonner";
import { Ticket, Calendar, CreditCard } from "lucide-react";

export default function MyTicketsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosClient.get("/users/me/bookings");
        setBookings(response.data.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách vé:", error);
        toast.error("Không thể tải danh sách vé");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="p-8 text-slate-500">Đang tải vé của bạn...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-600 rounded-xl text-white">
          <Ticket size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Vé của tôi</h1>
          <p className="text-slate-500 text-sm">Quản lý các vé bạn đã đặt thành công</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-400">Bạn chưa có đơn đặt vé nào.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-md uppercase">
                    Order ID
                  </span>
                  <code className="font-mono text-slate-700 font-bold">{b.orderId}</code>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(b.bookingTime).toLocaleString("vi-VN")}
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard size={14} />
                    {b.status}
                  </div>
                </div>
              </div>
              
              <div className="text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                <p className="text-xs text-slate-400 uppercase font-bold">Tổng thanh toán</p>
                <p className="text-xl font-black text-blue-600">
                  {b.totalAmount.toLocaleString()} <span className="text-sm font-normal">VND</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}