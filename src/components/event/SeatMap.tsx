"use client";

import React, { useState } from 'react';
import { SeatDTO } from '@/types/event';

interface SeatMapProps {
  seats: SeatDTO[];
  onSelect: (ids: number[]) => void; // THÊM DÒNG NÀY để hết lỗi đỏ ở page.tsx
}

export default function SeatMap({ seats, onSelect }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const toggleSeat = (seatId: number) => {
    const newSelection = selectedSeats.includes(seatId)
      ? selectedSeats.filter(id => id !== seatId)
      : [...selectedSeats, seatId];
    
    // Giới hạn tối đa 6 ghế (theo yêu cầu trong ảnh giao diện)
    if (newSelection.length > 6) return;

    setSelectedSeats(newSelection);
    onSelect(newSelection); // Gửi danh sách ID về cho page.tsx xử lý
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
          {seats.map((seat) => {
            // Tính toán vị trí ghế dựa trên Row và Number
            const xIdx = parseInt(seat.number);
            const yIdx = seat.row.charCodeAt(0) - 65;
            
            const x = 100 + xIdx * 28;
            const y = 50 + yIdx * 35;
            
            const isSelected = selectedSeats.includes(seat.id);
            const isSold = seat.status === 'SOLD';

            return (
              <g key={seat.id} className="cursor-pointer" onClick={() => !isSold && toggleSeat(seat.id)}>
                <rect
                  x={x}
                  y={y}
                  width="22"
                  height="22"
                  rx="4"
                  fill={isSold ? '#334155' : isSelected ? '#3b82f6' : '#1e293b'}
                  stroke={isSelected ? '#60a5fa' : isSold ? '#1e293b' : '#475569'}
                  strokeWidth="1.5"
                  className="transition-all duration-200 hover:stroke-blue-400"
                />
                {/* Hiển thị số hàng ở đầu mỗi dãy */}
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

      {/* Chú giải & Thông tin chọn ghế */}
      <div className="mt-10 flex gap-8 text-sm text-slate-400">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-800 rounded border border-slate-600"></div> Trống</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-600 rounded"></div> Đang chọn</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-slate-700 rounded"></div> Đã bán</div>
      </div>
    </div>
  );
}