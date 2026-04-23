"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosClient from "@/lib/axios";
import SeatMap from "@/components/event/SeatMap";
import { SeatDTO } from "@/types/event";
import { toast } from "sonner";
import { Loader2, Users } from "lucide-react";

export default function EventBookingPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [seats, setSeats] = useState<SeatDTO[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [isHolding, setIsHolding] = useState(false);

  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [isAllowed, setIsAllowed] = useState(false);

  // LOGIC HÀNG CHỜ MỚI - HIỂN THỊ RÕ MỌI TRẠNG THÁI
  const checkQueueStatus = useCallback(async () => {
    try {
      console.log("Đang kiểm tra hàng chờ...");
      const response = await axiosClient.get(`/events/${id}/queue-status`);
      const position = response.data.data;
      console.log("Server trả về vị trí:", position);

      if (position === 0) {
        setIsAllowed(true);
        fetchSeats(); 
        toast.success("Đã đến lượt của bạn! Vui lòng chọn ghế.");
      } else if (position === -1) {
        // Cập nhật UI để bạn biết hệ thống đang làm gì
        setQueuePosition(-1); 
        console.warn("Chưa có tên trong danh sách, đang xin cấp số...");
        await axiosClient.post(`/events/${id}/join-queue`);
        setTimeout(checkQueueStatus, 2000);
      } else {
        setQueuePosition(position);
        setTimeout(checkQueueStatus, 3000);
      }
    } catch (error) {
      console.error("Lỗi gọi API hàng chờ:", error);
      setQueuePosition(-2); // Gán -2 để UI hiện dòng chữ Lỗi mạng
      setTimeout(checkQueueStatus, 4000);
    }
  }, [id]);

  const fetchSeats = async () => {
    try {
      const response = await axiosClient.get(`/events/${id}/seats`);
      setSeats(response.data.data);
    } catch (error) {
      toast.error("Không thể tải sơ đồ ghế");
    }
  };

  useEffect(() => {
    if (!id) return;
    const initQueue = async () => {
      try {
        await axiosClient.post(`/events/${id}/join-queue`);
      } catch (error) {
        console.warn("Lỗi xin số ban đầu, hệ thống sẽ tự thử lại.");
      } finally {
        checkQueueStatus();
      }
    };
    initQueue();
  }, [id, checkQueueStatus]);

  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế!");
      return;
    }
    setIsHolding(true);
    try {
      const response = await axiosClient.post(`/events/hold`, selectedSeats);
      toast.success("Giữ ghế thành công!", {
        description: "Hệ thống đang xử lý vé của bạn.",
      });
      setSelectedSeats([]);
      
      // Chuyển trang để nhường chỗ cho người khác
      router.push("/dashboard/my-tickets"); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi giữ ghế");
      setIsHolding(false); 
    } 
  };

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
              Bạn đang được xếp hàng để đảm bảo hệ thống không bị quá tải.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-[30px] shadow-lg shadow-blue-200 transform hover:scale-105 transition-transform">
            <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.2em] mb-2">Số thứ tự của bạn</p>
            <p className="text-6xl font-black text-white tabular-nums flex items-center justify-center min-h-[72px]">
              {/* HIỂN THỊ CỤ THỂ TỪNG TRẠNG THÁI */}
              {queuePosition === null && <span className="text-2xl animate-pulse">Đang kết nối...</span>}
              {queuePosition === -1 && <span className="text-2xl animate-pulse text-yellow-300">Đang xin số...</span>}
              {queuePosition === -2 && <span className="text-2xl text-red-300">Lỗi Server!</span>}
              {queuePosition !== null && queuePosition >= 1 && queuePosition}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Chọn chỗ ngồi</h1>
        </div>
        <div className="flex gap-2">
            <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">Đã vào phòng</span>
        </div>
      </div>

      <SeatMap seats={seats} onSelect={setSelectedSeats} />

      <div className="bg-white p-8 rounded-[35px] shadow-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
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
          className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold transition-all hover:bg-blue-600 disabled:opacity-30 disabled:pointer-events-none"
        >
          {isHolding ? "Đang xử lý..." : "Tiếp tục thanh toán"}
        </button>
      </div>
    </div>
  );
}