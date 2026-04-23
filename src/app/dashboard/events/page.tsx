// FILE: src/app/dashboard/events/page.tsx
"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios";
import Link from "next/link";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { toast } from "sonner";

export default function EventsListPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosClient.get("/events");
        setEvents(response.data.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách sự kiện:", error);
        toast.error("Không thể tải danh sách sự kiện");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Đang tải danh sách sự kiện...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Sự kiện nổi bật</h1>
        <p className="text-slate-500 mt-2">Chọn sự kiện bạn muốn tham gia và đặt vé ngay</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-400">Hiện tại chưa có sự kiện nào diễn ra.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="flex-1">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Ticket size={24} />
                </div>
                
                <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">
                  {event.title}
                </h2>
                
                <p className="text-slate-500 text-sm mb-6 line-clamp-3">
                  {event.description || "Đang cập nhật mô tả cho sự kiện này..."}
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <div className="p-2 bg-slate-50 rounded-lg"><Calendar size={16} className="text-slate-400" /></div>
                    {new Date(event.startTime).toLocaleString("vi-VN")}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <div className="p-2 bg-slate-50 rounded-lg"><MapPin size={16} className="text-slate-400" /></div>
                    {event.venueName}
                  </div>
                </div>
              </div>

              {/* BẤM VÀO ĐÂY SẼ CHUYỂN SANG TRANG /events/[id] ĐỂ VÀO PHÒNG CHỜ */}
              <Link href={`/dashboard/events/${event.id}`} className="block mt-auto">
                <button className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold transition-colors">
                  Mua vé ngay
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}