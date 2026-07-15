"use client";

import React from 'react';
import { useBooking } from '@/context/BookingContext';

interface SeatMapProps {
  reservedSeats: string[];
  onComplete: () => void;
  onHeadcountChange: () => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ reservedSeats, onComplete, onHeadcountChange }) => {
  const { headcount, selectedSeats, toggleSeat, selectedSchedule, selectedTheater, selectedTimeSlot } = useBooking();
  const totalHeadcount = headcount.adult + headcount.youth + headcount.special + headcount.senior;

  const screenType = selectedSchedule?.screenType || '2D';

  // Dynamic grid configuration matching different CGV premium screen designs
  let rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
  let colLength = 13;
  let getAisleCols = (col: number): boolean => col === 4 || col === 9;
  let getSeatType = (row: string, col: number): string => {
    if (row === 'A' && (col === 7 || col === 8)) return 'wheelchair';
    return 'standard';
  };
  let screenText = "screen";
  let screenColor = "bg-[#E51937] shadow-[0_0_6px_rgba(229,25,55,0.4)]";
  let noticeText = "💡 B열은 스크린 시선이 가장 편안한 Light존입니다.";

  if (screenType === 'IMAX') {
    rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
    colLength = 16;
    getAisleCols = (col: number) => col === 4 || col === 12;
    getSeatType = (row: string, col: number) => {
      if (row === 'A' && (col === 8 || col === 9)) return 'wheelchair';
      return 'standard';
    };
    screenText = "🌟 IMAX GIANT SCREEN 🌟";
    screenColor = "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]";
    noticeText = "⭐ 초대형 IMAX 스크린과 강력한 고출력 입체 사운드가 특화된 대형 상영관입니다.";
  } else if (screenType === 'DOLBY') {
    rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
    colLength = 14;
    getAisleCols = (col: number) => col === 3 || col === 11;
    getSeatType = (row: string, col: number) => {
      if (row === 'A' && (col === 7 || col === 8)) return 'wheelchair';
      return 'standard';
    };
    screenText = "🔊 DOLBY ATMOS AUDIO SCREEN 🔊";
    screenColor = "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]";
    noticeText = "🔊 돌비 오리지널 입체 오디오 시스템이 설계된 특수 음향 정밀 상영관입니다.";
  } else if (screenType === '4DX') {
    rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    colLength = 12;
    getAisleCols = (col: number) => col === 4 || col === 8;
    getSeatType = (row: string, col: number) => {
      if (row === 'A' && (col === 5 || col === 6)) return 'wheelchair';
      return 'standard';
    };
    screenText = "⚡ 4DX MOTION SCREEN ⚡";
    screenColor = "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]";
    noticeText = "🏃 4DX 상영관은 영화 장면에 따라 역동적으로 진동 및 움직이는 모션 시트관입니다.";
  } else if (screenType === 'SCREENX') {
    rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    colLength = 14;
    getAisleCols = (col: number) => col === 3 || col === 11;
    getSeatType = (row: string, col: number) => {
      if (row === 'A' && (col === 7 || col === 8)) return 'wheelchair';
      return 'standard';
    };
    screenText = "🖥️ SCREENX 3-SIDED SCREEN 🖥️";
    screenColor = "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]";
    noticeText = "🖥️ 좌우 양쪽 벽면까지 3면으로 스크린이 확장되어 뛰어난 몰입감을 줍니다.";
  }

  const cols = Array.from({ length: colLength }, (_, i) => i + 1);

  return (
    <div className="w-full flex flex-col bg-[#1A1D24] min-h-[calc(100vh-8rem)] select-none text-white relative">
      
      {/* Top Header Bar (자리선택창.jpg) */}
      <div className="w-full bg-white text-gray-900 border-b border-gray-200 px-4 py-3 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black flex items-center gap-1">
            <span className="text-red-500">📍</span>
            {selectedTheater?.name || '건대입구'} <span className="text-gray-400 font-bold ml-1">{selectedTimeSlot?.hallName || '5관'}</span>
          </span>
        </div>
        <button 
          onClick={onHeadcountChange}
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-800 text-lg font-bold cursor-pointer transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Main Seat Map Area with dark background */}
      <div className="w-full flex-1 flex flex-col items-center pt-8 pb-20 px-2 relative overflow-hidden">
        
        {/* Floating Mini-Map Preview Overlay (자리선택창.jpg) */}
        <div className="absolute left-4 top-8 w-16 h-24 border border-gray-700 bg-black/50 shadow-md rounded p-1 hidden sm:flex flex-col items-center pointer-events-none opacity-60 z-20">
          <div className="w-10 h-0.5 bg-orange-500/80 mb-1.5" />
          <div className="grid grid-cols-6 gap-px w-full">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1 bg-white/20 rounded-[0.5px]" />
            ))}
          </div>
        </div>

        {/* Curved Screen representation */}
        <div className="w-full max-w-[340px] mb-8 flex flex-col items-center">
          <div className={`w-full h-1.5 rounded-full ${screenColor}`} />
          <span className="text-[8px] text-gray-400 font-extrabold tracking-[0.2em] uppercase mt-1.5">{screenText}</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3.5 text-[9px] text-gray-400 mb-6 bg-black/20 p-2.5 rounded-lg border border-gray-800/40">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[1px] bg-white border border-gray-400" />
            <span>일반석</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[1px] bg-blue-500 border border-blue-400" />
            <span>장애인석</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[1px] bg-[#E51937] border border-[#E51937]" />
            <span>선택됨</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[1px] bg-gray-800 border border-gray-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-600/30 rotate-45 transform scale-150 border-t border-gray-500/40" />
            </div>
            <span>예매불가</span>
          </div>
        </div>

        {/* Seat Map Layout scrollable wrapper */}
        <div className="overflow-x-auto w-full pb-4 scrollbar-none flex justify-center">
          <div className="grid gap-y-1 min-w-[350px] px-4">
            {rows.map(row => {
              const isLightZone = row === 'B';
              
              return (
                <div key={row} className="flex items-center gap-2 relative">
                  
                  {/* Row Identifier left */}
                  <span className="w-4 text-[9px] font-black text-gray-500 text-center">{row}</span>
                  
                  {/* Light zone highlight overlay */}
                  {isLightZone && (
                    <div className="absolute left-6 right-6 top-0 bottom-0 border border-amber-500/20 bg-amber-500/5 rounded-[2px] pointer-events-none -z-10" />
                  )}
   
                  {/* Seats row */}
                  <div className="flex items-center gap-0.5 relative z-10">
                    {cols.map(col => {
                      const seatId = `${row}${col}`;
                      const isReserved = reservedSeats.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);
                      const seatType = getSeatType(row, col);
                      
                      // Style classes
                      let seatStyle = "bg-white border-gray-300 text-gray-900 hover:border-gray-500 font-medium";
                      
                      if (isReserved) {
                        seatStyle = "bg-gray-800 border-gray-900 text-gray-600 cursor-not-allowed overflow-hidden relative";
                      } else if (isSelected) {
                        seatStyle = "bg-[#E51937] border-[#E51937] text-white font-black shadow-sm";
                      } else if (seatType === 'wheelchair') {
                        seatStyle = "bg-blue-500 border-blue-400 text-white font-black";
                      }

                      // Aisle spacing columns check
                      const isAisle = getAisleCols(col);

                      return (
                        <React.Fragment key={col}>
                          <button
                            disabled={isReserved}
                            onClick={() => toggleSeat(seatId)}
                            className={`w-6.5 h-6.5 text-[6.5px] tracking-tighter flex items-center justify-center rounded-[2px] border transition-all select-none cursor-pointer focus:outline-none ${seatStyle}`}
                            title={`좌석 ${seatId}`}
                          >
                            {/* Diagonal line overlay for reserved seat */}
                            {isReserved && (
                              <div className="absolute inset-0 bg-transparent flex items-center justify-center">
                                <div className="w-[150%] h-[0.5px] bg-gray-700 rotate-45 transform origin-center" />
                              </div>
                            )}
                            {!isReserved && seatId}
                          </button>
                          {isAisle && <div className="w-3" />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  
                  {/* Row Identifier right */}
                  <span className="w-4 text-[9px] font-black text-gray-500 text-center">{row}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row B Light Zone Label */}
        <div className="text-[9px] text-[#E51937] font-semibold mt-4 text-center px-4 leading-relaxed bg-red-500/5 py-1.5 px-3 rounded-full border border-red-500/10">
          {noticeText}
        </div>

      </div>

      {/* Bottom Sticky action drawer */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto w-full bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between z-40 select-none h-16 shadow-lg text-gray-900">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase leading-none">선택인원</div>
            <div className="text-sm font-black text-gray-900 mt-1">일반 {totalHeadcount}</div>
          </div>
          <button
            onClick={onHeadcountChange}
            className="px-3 py-1.5 text-xs bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-gray-700 font-black shadow-sm transition-all focus:outline-none cursor-pointer"
          >
            인원변경
          </button>
        </div>

        <button
          disabled={totalHeadcount <= 0 || selectedSeats.length !== totalHeadcount}
          onClick={onComplete}
          className={`px-8 py-3 rounded-xl font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer ${
            totalHeadcount > 0 && selectedSeats.length === totalHeadcount
              ? 'bg-[#E51937] hover:bg-[#d1152f] text-white shadow-[#E51937]/20'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none border border-transparent'
          }`}
        >
          선택완료
        </button>
      </div>

    </div>
  );
};

export default SeatMap;
