"use client";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios";

export default function MyTicketsPage() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    axiosClient.get("/users/me/bookings").then(res => setBookings(res.data.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Vé của tôi</h1>
      <div className="space-y-4">
        {bookings.map(b => (
          <div key={b.id} className="bg-white p-5 rounded-2xl border flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Mã đơn hàng</p>
              <p className="font-mono text-blue-600 font-bold">{b.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-700">{b.totalAmount.toLocaleString()} VND</p>
              <p className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded">ĐÃ THANH TOÁN</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}