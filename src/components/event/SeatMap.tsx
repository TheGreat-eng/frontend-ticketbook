"use client";

import { useEffect, useState, useRef } from 'react';
import { SeatDTO } from '@/types/event';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { toast } from "sonner";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws';

interface SeatMapProps {
  seats: SeatDTO[]; 
  onSelect: (ids: number[]) => void;
}

export default function SeatMap({ seats: initialSeats, onSelect }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [currentSeats, setCurrentSeats] = useState<SeatDTO[]>(initialSeats);

  // GIẢI PHÁP ROOT CAUSE: Dùng useRef để theo dõi ghế đang chọn, tránh lỗi React "Cannot update a component"
  const selectedSeatsRef = useRef<number[]>([]);
  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  useEffect(() => {
    setCurrentSeats(initialSeats);
  }, [initialSeats]);

  useEffect(() => {
    const socket = new SockJS(WS_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe('/topic/seats', (message) => {
          const soldSeatIds: number[] = JSON.parse(message.body);
          
          // 1. Cập nhật UI ghế thành màu xám (SOLD)
          setCurrentSeats((prevSeats) =>
            prevSeats.map((seat) =>
              soldSeatIds.includes(seat.id) ? { ...seat, status: 'SOLD' } : seat
            )
          );

          // 2. Lọc ghế an toàn bằng useRef
          const currentSelected = selectedSeatsRef.current;
          const hasConflict = currentSelected.some(id => soldSeatIds.includes(id));

          if (hasConflict) {
            const safeSelection = currentSelected.filter(id => !soldSeatIds.includes(id));
            setSelectedSeats(safeSelection);
            onSelect(safeSelection); 
            toast.error("Một số ghế bạn chọn đã bị người khác mua mất!");
          } else {
            toast.info(`Ghế [${soldSeatIds.join(", ")}] vừa được mua!`);
          }
        });
      },
    });

    stompClient.activate();

    return () => {
      if (stompClient.active) stompClient.deactivate();
    };
  }, [onSelect]);

  const toggleSeat = (seatId: number) => {
    const seat = currentSeats.find(s => s.id === seatId);
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
      <div className="w-2/3 h-8 bg-gradient-to-b from-blue-400 to-transparent opacity-50 rounded-full blur-sm mb-16 shadow-[0_15px_30px_rgba(59,130,246,0.5)]"></div>
      <p className="text-blue-300 text-xs tracking-[1em] mb-12 uppercase">Stage</p>

      <div className="relative w-full overflow-auto flex justify-center custom-scrollbar">
        <svg width="1200" height="600" viewBox="0 0 1600 800" className="select-none">
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
                  x={x} y={y} width="22" height="22" rx="4"
                  fill={isSold ? '#334155' : isSelected ? '#3b82f6' : '#1e293b'}
                  stroke={isSelected ? '#60a5fa' : isSold ? '#1e293b' : '#475569'}
                  strokeWidth="1.5"
                  className={`transition-all duration-200 ${!isSold && 'hover:stroke-blue-400'}`}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}