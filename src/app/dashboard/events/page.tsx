"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import axiosClient from "@/lib/axios";
import SeatMap from "@/components/event/SeatMap";
import { SeatDTO } from "@/types/event";
import { toast } from "sonner";
import { Loader2, Users } from "lucide-react";

export default function EventBookingPage() {
  const { id } = useParams();
  
  // States cho dữ liệu ghế
  const [seats, setSeats] = useState<SeatDTO[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [isHolding, setIsHolding] = useState(false);

  // States cho hàng chờ (Phase 7)
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [isAllowed, setIsAllowed] = useState(false);

  /**
   * Hàm kiểm tra vị trí hàng chờ
   */
  const checkQueueStatus = useCallback(async () => {
    try {
      const response = await axiosClient.get(`/events/${id}/queue-status`);
      const position = response.data.data;
      
      setQueuePosition(position);

      if (position === 0) {
        // VỊ TRÍ 0 = ĐÃ ĐẾN LƯỢT
        setIsAllowed(true);
        fetchSeats(); // Chỉ load danh sách ghế khi đã được phép vào
        toast.success("Đã đến lượt của bạn! Vui lòng chọn ghế.");
      } else {
        // Nếu vẫn phải chờ, check lại sau 3 giây
        setTimeout(checkQueueStatus, 3000);
      }
    } catch (error) {
      console.error("Lỗi kiểm tra hàng chờ:", error);
    }
  }, [id]);

  /**
   * Hàm lấy danh sách ghế (Chỉ gọi khi position === 0)
   */
  const fetchSeats = async () => {
    try {
      const response = await axiosClient.get(`/events/${id}/seats`);
      setSeats(response.data.data);
    } catch (error) {
      toast.error("Không thể tải sơ đồ ghế");
    }
  };

  /**
   * Bước 1: Khi vào trang, tự động Join hàng chờ
   */
  useEffect(() => {
    const joinAndStartPolling = async () => {
      try {
        await axiosClient.post(`/events/${id}/join-queue`);
        checkQueueStatus();
      } catch (error) {
        toast.error("Hệ thống hàng chờ đang bận");
      }
    };
    joinAndStartPolling();
  }, [id, checkQueueStatus]);

  /**
   * Hàm xử lý khi nhấn Thanh toán (Phase 4-5)
   */
  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế!");
      return;
    }
    setIsHolding(true);
    try {
      const response = await axiosClient.post(`/events/hold`, selectedSeats);
      toast.success("Giữ ghế thành công!", {
        description: `Mã đơn: ${response.data.message}. Check email nhận vé!`,
      });
      setSelectedSeats([]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi giữ ghế");
    } finally {
      setIsHolding(false);
    }
  };

  // --- GIAO DIỆN 1: MÀN HÌNH CHỜ (WAITING ROOM) ---
  if (!isAllowed) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-blue-50 max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative mx-auto w-24 h-24">
            <Loader2 className="w-24 h-24 text-blue-600 animate-spin opacity-20" />
            <Users className="w-10 h-10 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Vui lòng chờ...</h1>
            <p className="text-slate-500 leading-relaxed px-4">
              Sự kiện đang rất "hot". Bạn đang được xếp hàng để đảm bảo hệ thống không bị quá tải.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-[30px] shadow-lg shadow-blue-200 transform hover:scale-105 transition-transform">
            <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.2em] mb-2">Số thứ tự của bạn</p>
            <p className="text-6xl font-black text-white tabular-nums">
              {queuePosition ?? "..."}
            </p>
          </div>

          <div className="pt-4">
            <p className="text-sm text-slate-400 italic">Tự động cập nhật sau mỗi 3 giây. Vui lòng không đóng trình duyệt.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- GIAO DIỆN 2: CHỌN GHẾ (KHI ĐÃ QUA HÀNG CHỜ) ---
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Chọn chỗ ngồi</h1>
          <p className="text-slate-500">Sự kiện: <span className="font-bold text-blue-600 uppercase">Concert Anh Trai Say Hi</span></p>
        </div>
        <div className="flex gap-2">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">Trạng thái: Đã vào phòng</span>
        </div>
      </div>

      {/* SeatMap Component (Phase 6 Real-time) */}
      <SeatMap seats={seats} onSelect={setSelectedSeats} />

      {/* Thanh thanh toán dưới cùng */}
      <div className="bg-white p-8 rounded-[35px] shadow-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Users size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Bạn đã chọn <span className="text-slate-900 font-bold">{selectedSeats.length}</span> ghế</p>
            <p className="text-3xl font-black text-blue-600">
              {(selectedSeats.length * 500000).toLocaleString()} <span className="text-sm font-normal">VND</span>
            </p>
          </div>
        </div>
        
        <button 
          disabled={isHolding || selectedSeats.length === 0}
          onClick={handleContinue}
          className={`group relative overflow-hidden bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-xl shadow-slate-200`}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isHolding ? "Đang xử lý..." : "Tiếp tục thanh toán"}
          </span>
        </button>
      </div>
    </div>
  );
}