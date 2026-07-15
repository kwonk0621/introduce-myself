"use client";

import React from 'react';
import { Booking } from '@/context/BookingContext';

interface TicketProps {
  booking: Booking;
  onCancel?: (id: string) => void;
}

const Ticket: React.FC<TicketProps> = ({ booking, onCancel }) => {
  const { id, movie, theater, schedule, timeSlot, headcount, selectedSeats, totalPrice, bookingDate } = booking;

  const formatShowDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const weeks = ['일', '월', '화', '수', '목', '금', '토'];
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}(${weeks[d.getDay()]})`;
  };

  const formatBookingDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // Helper to compile headcount string
  const getHeadcountLabel = () => {
    const parts = [];
    if (headcount.adult > 0) parts.push(`일반 ${headcount.adult}명`);
    if (headcount.youth > 0) parts.push(`청소년 ${headcount.youth}명`);
    if (headcount.special > 0) parts.push(`우대 ${headcount.special}명`);
    if (headcount.senior > 0) parts.push(`경로 ${headcount.senior}명`);
    return parts.join(' / ');
  };

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-cgv relative flex flex-col transition-all duration-300 select-none animate-in fade-in duration-300">
      
      {/* Upper Ticket Area */}
      <div className="p-5 flex gap-4 bg-gray-50/50">
        {/* Poster */}
        <div className="w-20 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Movie Info */}
        <div className="flex-1 flex flex-col justify-between py-1 text-left">
          <div>
            <span className="text-[9px] px-2 py-0.5 rounded bg-[#E51937]/10 text-[#E51937] font-bold border border-[#E51937]/20">
              {schedule.screenType}
            </span>
            <h3 className="font-black text-gray-900 text-base mt-2 leading-tight">{movie.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{movie.englishTitle}</p>
          </div>
          
          <div className="text-xs text-gray-500">
            <p className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-700 font-semibold">{theater.name} • {timeSlot.hallName}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Ticket Details Panel */}
      <div className="px-5 pb-5 grid grid-cols-2 gap-y-3.5 gap-x-2 border-b border-dashed border-gray-200 relative pt-2">
        {/* Left Side Hole */}
        <div className="absolute -left-3 bottom-0 transform translate-y-1/2 w-6 h-6 rounded-full bg-[#F4F5F7] border-r border-gray-200 z-10" />
        {/* Right Side Hole */}
        <div className="absolute -right-3 bottom-0 transform translate-y-1/2 w-6 h-6 rounded-full bg-[#F4F5F7] border-l border-gray-200 z-10" />

        <div className="text-left">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">상영일자</span>
          <span className="text-xs font-extrabold text-gray-900 mt-0.5">{formatShowDate(schedule.date)}</span>
        </div>
        
        <div className="text-left">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">상영시간</span>
          <span className="text-xs font-extrabold text-[#E51937] mt-0.5">{timeSlot.time} ~ {timeSlot.endTime}</span>
        </div>

        <div className="text-left">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">관람인원</span>
          <span className="text-xs font-bold text-gray-800 mt-0.5 truncate block">
            {getHeadcountLabel()}
          </span>
        </div>

        <div className="text-left">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">선택좌석</span>
          <span className="text-xs font-black text-gray-900 mt-0.5 tracking-wide">
            {selectedSeats.join(', ')}
          </span>
        </div>
      </div>

      {/* Lower Tear-off Ticket Stub */}
      <div className="p-5 bg-gray-50 flex items-center justify-between">
        {/* Mock Barcode / QR Code */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white p-1 rounded-lg flex items-center justify-center border border-gray-200">
            {/* Simple CSS-based Mock QR pattern */}
            <div className="w-full h-full bg-black relative flex flex-wrap" style={{ contentVisibility: 'auto' }}>
              <div className="w-1/2 h-1/2 bg-white border border-black flex items-center justify-center">
                <div className="w-2/3 h-2/3 bg-black"></div>
              </div>
              <div className="w-1/2 h-1/2 bg-white p-0.5 flex flex-wrap gap-0.5">
                <div className="w-2 h-2 bg-black"></div>
                <div className="w-1 h-1 bg-black"></div>
              </div>
              <div className="w-1/2 h-1/2 bg-white p-0.5 flex flex-wrap gap-0.5">
                <div className="w-2 h-2 bg-black"></div>
              </div>
              <div className="w-1/2 h-1/2 bg-white border border-black flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-black"></div>
              </div>
            </div>
          </div>
          <div className="text-left">
            <span className="text-[9px] text-gray-400 block font-semibold">예매번호</span>
            <span className="text-xs font-mono font-bold text-gray-800 block leading-none">{id}</span>
            <span className="text-[8px] text-gray-400 block mt-1">결제: {formatBookingDate(bookingDate)}</span>
          </div>
        </div>

        {/* Pricing / Action */}
        <div className="text-right">
          <span className="text-[9px] text-gray-400 block font-semibold">결제금액</span>
          <span className="text-sm font-black text-[#E51937] block leading-tight">{totalPrice.toLocaleString()}원</span>
          
          {onCancel && (
            <button
              onClick={() => {
                if (confirm("정말로 이 예매를 취소하시겠습니까?")) {
                  onCancel(id);
                }
              }}
              className="mt-2.5 text-[9px] px-2.5 py-1 rounded border border-red-200 hover:border-[#E51937] text-red-500 hover:bg-[#E51937]/5 font-bold transition-all focus:outline-none"
            >
              예매 취소
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default Ticket;
