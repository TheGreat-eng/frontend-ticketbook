"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios";
import SeatMap from "@/components/event/SeatMap";
import { SeatDTO } from "@/types/event";
import { useParams } from "next/navigation";


import { toast } from "sonner"; // Import để hiện thông báo


export default function EventBookingPage() {
  const { id } = useParams();
  const [seats, setSeats] = useState<SeatDTO[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]); // Lưu ID các ghế đang chọn
  const [isHolding, setIsHolding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axiosClient.get(`/events/${id}/seats`);
        setSeats(response.data.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách ghế:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [id]);

  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế!");
      return;
    }

    setIsHolding(true);
    try {
      const response = await axiosClient.post(`/events/hold`, selectedSeats);
      if (response.status === 200) {
        toast.success(response.data.message);
        // Chuyển hướng sang trang thanh toán sau khi giữ ghế thành công
        // window.location.href = `/dashboard/checkout?seats=${selectedSeats.join(',')}`;
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Không thể giữ ghế, vui lòng thử lại!";
      toast.error(msg);
    } finally {
      setIsHolding(false);
    }
  };

  if (loading) return <div className="p-10 text-white">Đang tải sơ đồ ghế...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
        {/* Truyền selectedSeats xuống SeatMap để cập nhật UI */}
        <SeatMap seats={seats} onSelect={setSelectedSeats} /> 

        <div className="mt-10 flex justify-between items-center bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <div>
            <p className="text-slate-400">Số ghế đã chọn: <span className="text-white font-bold">{selectedSeats.length}</span></p>
            <p className="text-2xl font-bold text-blue-400">
                {(selectedSeats.length * 500000).toLocaleString()} VND
            </p>
          </div>
          <button 
            disabled={isHolding}
            onClick={handleContinue}
            className={`bg-blue-600 hover:bg-blue-500 px-10 py-4 rounded-xl font-bold transition-all shadow-lg ${isHolding ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isHolding ? "Đang giữ ghế..." : "Tiếp tục thanh toán"}
          </button>
        </div>
    </div>
  );
}