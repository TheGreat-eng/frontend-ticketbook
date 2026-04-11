"use client";

import { useEffect, useState } from 'react';
import { SeatDTO } from '@/types/event';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { toast } from "sonner";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws';

interface SeatMapProps {
  seats: SeatDTO[]; // Dữ liệu khởi tạo từ API
  onSelect: (ids: number[]) => void;
}

export default function SeatMap({ seats: initialSeats, onSelect }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  // Chuyển seats thành state để có thể cập nhật động khi nhận tin nhắn WebSocket
  const [currentSeats, setCurrentSeats] = useState<SeatDTO[]>(initialSeats);

  // Đồng bộ lại currentSeats nếu ban đầu initialSeats thay đổi (do API trả về chậm)
  useEffect(() => {
    setCurrentSeats(initialSeats);
  }, [initialSeats]);

  useEffect(() => {
    const socket = new SockJS(WS_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket Connected");
        
        stompClient.subscribe('/topic/seats', (message) => {
          const soldSeatIds: number[] = JSON.parse(message.body);
          
          toast.info(`Ghế [${soldSeatIds.join(", ")}] vừa được mua!`, {
            description: "Hệ thống đang cập nhật trạng thái thực tế.",
          });

          // CẬP NHẬT TRẠNG THÁI GHẾ REAL-TIME
          setCurrentSeats((prevSeats) =>
            prevSeats.map((seat) =>
              soldSeatIds.includes(seat.id) 
                ? { ...seat, status: 'SOLD' } // Đổi màu xám ngay lập tức
                : seat
            )
          );

          // Nếu người dùng đang chọn đúng cái ghế vừa bị người khác mua mất
          // thì tự động bỏ chọn ghế đó ra khỏi danh sách selectedSeats
          setSelectedSeats((prevSelected) => {
            const filtered = prevSelected.filter(id => !soldSeatIds.includes(id));
            if (filtered.length !== prevSelected.length) {
              onSelect(filtered); // Báo lại cho page.tsx để cập nhật lại tổng tiền
              toast.error("Một số ghế bạn chọn đã bị người khác mua mất!");
            }
            return filtered;
          });
        });
      },
    });

    stompClient.activate();

    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [onSelect]);

  const toggleSeat = (seatId: number) => {
    const seat = currentSeats.find(s => s.id === seatId);
    // Nếu ghế đã bán thì không cho chọn
    if (!seat || seat.status === 'SOLD') return;

    const isSelected = selectedSeats.includes(seatId);
    let newSelection: number[];

    if (isSelected) {
      newSelection = selectedSeats.filter(id => id !== seatId);
    } else {
      if (selectedSeats.length >= 6) {
        toast.warning("Bạn chỉ được chọn tối đa 6 ghế!");
        return;
      }
      newSelection = [...selectedSeats, seatId];
    }

    setSelectedSeats(newSelection);
    onSelect(newSelection);
  };

  return (
    <div className="flex flex-col items-center bg-slate-950 p-10 rounded-3xl shadow-2xl overflow-hidden">
      {/* Sân khấu */}
      <div className="w-2/3 h-8 bg-gradient-to-b from-blue-400 to-transparent opacity-50 rounded-full blur-sm mb-16 shadow-[0_15px_30px_rgba(59,130,246,0.5)]"></div>
      <p className="text-blue-300 text-xs tracking-[1em] mb-12 uppercase">Stage</p>

      {/* Sơ đồ ghế */}
      <div className="relative w-full overflow-auto flex justify-center custom-scrollbar">
        <svg 
          width="1200" 
          height="600" 
          viewBox="0 0 1600 800"
          className="select-none"
        >
          {currentSeats.map((seat) => {
            const xIdx = parseInt(seat.number);
            const yIdx = seat.row.charCodeAt(0) - 65;
            const x = 100 + xIdx * 28;
            const y = 50 + yIdx * 35;
            
            const isSelected = selectedSeats.includes(seat.id);
            const isSold = seat.status === 'SOLD';

            return (
              <g key={seat.id} className={isSold ? "cursor-not-allowed" : "cursor-pointer"} onClick={() => toggleSeat(seat.id)}>
                <rect
                  x={x}
                  y={y}
                  width="22"
                  height="22"
                  rx="4"
                  fill={isSold ? '#334155' : isSelected ? '#3b82f6' : '#1e293b'}
                  stroke={isSelected ? '#60a5fa' : isSold ? '#1e293b' : '#475569'}
                  strokeWidth="1.5"
                  className={`transition-all duration-200 ${!isSold && 'hover:stroke-blue-400'}`}
                />
                {xIdx === 1 && (
                  <text x={x - 40} y={y + 16} fill="#475569" fontSize="12" className="font-bold">
                    {seat.row}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Chú giải */}
      <div className="mt-10 flex gap-8 text-sm text-slate-400">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#1e293b] rounded border border-slate-600"></div> Trống</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-600 rounded"></div> Đang chọn</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#334155] rounded"></div> Đã bán</div>
      </div>
    </div>
  );
}