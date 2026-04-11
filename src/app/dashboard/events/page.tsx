"use client";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // API này bạn đã có dữ liệu từ DataSeeder
    axiosClient.get("/events").then(res => setEvents(res.data.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Sự kiện nổi bật</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events?.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition-all">
            <div className="h-40 bg-slate-200 rounded-xl mb-4 overflow-hidden bg-[url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500')] bg-cover"></div>
            <h3 className="font-bold text-lg mb-2">{event.title}</h3>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{event.description}</p>
            <Link 
              href={`/dashboard/events/${event.id}`}
              className="block text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Đặt vé ngay
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}