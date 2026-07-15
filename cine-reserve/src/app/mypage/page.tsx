"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import Ticket from '@/components/Ticket';

export default function MyPage() {
  const router = useRouter();
  const { user, bookingHistory, cancelBooking, logout } = useBooking();
  const [showHistoryOnly, setShowHistoryOnly] = useState(false);

  // If user is not logged in
  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F4F5F7] text-gray-900 py-24 px-4 select-none">
        <h2 className="text-lg font-bold mb-2">로그인이 필요한 서비스입니다.</h2>
        <p className="text-xs text-gray-400 mb-6">CGV의 다양한 혜택을 이용해 보세요.</p>
        <button 
          onClick={() => router.push('/login')}
          className="px-8 py-3 rounded-full bg-[#E51937] text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F4F5F7] text-gray-900 pb-20 select-none flex flex-col w-full animate-in fade-in duration-300">
      
      {/* 1. Header Profile block (마이페이지.jpg) */}
      <div className="bg-white p-5 flex items-center justify-between border-b border-gray-100 text-left">
        <div className="flex-1">
          <div className="flex items-center gap-1 cursor-pointer hover:opacity-90">
            <h2 className="text-lg font-black text-gray-900">{user.name} 님</h2>
            <span className="text-gray-400 font-bold">&rsaquo;</span>
          </div>
          <button 
            onClick={() => alert("등급 혜택 페이지는 준비 중입니다.")}
            className="text-[10px] text-gray-400 font-bold hover:text-gray-600 mt-1 flex items-center gap-0.5"
          >
            내 등급 보러 가기 &rsaquo;
          </button>
        </div>

        {/* User avatar circle */}
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 border border-gray-200">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* 2. Point status progress bar (0점 / 일반 / 10,000점) */}
      <div className="bg-white px-5 pb-5 border-b border-gray-200">
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 bg-[#E51937] rounded-full" style={{ width: '4%' }} />
          <div className="absolute left-2.5 top-0 bottom-0 flex items-center justify-center">
            <span className="text-[8px] bg-[#E51937] text-white px-1.5 py-0.2 rounded-full font-bold leading-none scale-90">
              0점
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold mt-2">
          <span>일반</span>
          <span>10,000점</span>
        </div>
      </div>

      {/* 3. CJ ONE Point block card */}
      <div className="bg-white border-y border-gray-100 px-5 py-4 flex items-center justify-between text-left mt-2.5">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-yellow-300 block shadow-sm animate-spin-slow" />
          <span className="text-xs font-black text-gray-700">CJ ONE Point</span>
        </div>
        <span className="text-sm font-extrabold text-[#E51937]">44P</span>
      </div>

      {/* 4. Asset Grid panel (쿠폰, 관람권, 기프트카드) */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 grid grid-cols-4 gap-2 text-center text-xs">
        <div className="flex flex-col items-center justify-center border-r border-gray-100 py-1 cursor-pointer hover:bg-gray-50/50 rounded-lg">
          <span className="text-sm font-black text-[#E51937]">8</span>
          <span className="text-[10px] text-gray-400 font-semibold mt-1">쿠폰</span>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-gray-100 py-1 cursor-pointer hover:bg-gray-50/50 rounded-lg">
          <span className="text-sm font-black text-gray-800">0</span>
          <span className="text-[10px] text-gray-400 font-semibold mt-1">관람/기프트콘</span>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-gray-100 py-1 cursor-pointer hover:bg-gray-50/50 rounded-lg">
          <span className="text-sm font-black text-gray-800">0</span>
          <span className="text-[10px] text-gray-400 font-semibold mt-1">기간횟수권</span>
        </div>
        <div className="flex flex-col items-center justify-center py-1 cursor-pointer hover:bg-gray-50/50 rounded-lg">
          <span className="text-lg">💳</span>
          <span className="text-[10px] text-gray-400 font-semibold mt-1">기프트카드</span>
        </div>
      </div>

      {/* 5. Submenu grid (나의 정보 관리) */}
      <div className="bg-white border-y border-gray-200 p-4 mt-2.5 text-left text-xs font-bold text-gray-800 space-y-4">
        <h4 className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-black border-b border-gray-50 pb-2">나의 정보 관리</h4>
        
        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          <button onClick={() => alert("준비 중입니다.")} className="flex justify-between items-center hover:text-[#E51937]">
            <span>내가 본 영화</span>
            <span className="text-gray-300 font-medium">&rsaquo;</span>
          </button>
          <button onClick={() => alert("준비 중입니다.")} className="flex justify-between items-center hover:text-[#E51937]">
            <span>보관함</span>
            <span className="text-gray-300 font-medium">&rsaquo;</span>
          </button>
          <button onClick={() => alert("준비 중입니다.")} className="flex justify-between items-center hover:text-[#E51937]">
            <span>스마트결제관리</span>
            <span className="text-gray-300 font-medium">&rsaquo;</span>
          </button>
          
          {/* 예약/결제내역 toggles ticket lists directly for convenience */}
          <button 
            onClick={() => {
              setShowHistoryOnly(!showHistoryOnly);
              if (!showHistoryOnly) {
                // Scroll down to the booking list
                setTimeout(() => {
                  document.getElementById('booking-history-anchor')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="flex justify-between items-center hover:text-[#E51937]"
          >
            <span className={showHistoryOnly ? "text-[#E51937]" : ""}>예약/결제내역</span>
            <span className="text-gray-300 font-medium">&rsaquo;</span>
          </button>
          
          <button onClick={() => alert("준비 중입니다.")} className="flex justify-between items-center hover:text-[#E51937]">
            <span>내 차량번호 조회</span>
            <span className="text-gray-300 font-medium">&rsaquo;</span>
          </button>
          <button onClick={() => alert("준비 중입니다.")} className="flex justify-between items-center hover:text-[#E51937]">
            <span>자주가는 CGV</span>
            <span className="text-gray-300 font-medium">&rsaquo;</span>
          </button>
        </div>

        {/* Guest sign-out option */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            onClick={() => {
              if (confirm("로그아웃 하시겠습니까?")) {
                logout();
                router.push('/');
              }
            }}
            className="text-[10px] text-gray-400 hover:text-red-500 font-bold"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 6. CGV Member Coupon Advertisement Banner (마이페이지.jpg) */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-4 text-white flex items-center justify-between text-left shadow-sm">
        <div>
          <span className="text-[8px] bg-white/20 border border-white/30 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">AD</span>
          <h4 className="text-sm font-black mt-1.5 leading-tight">0원으로 영화보기</h4>
          <p className="text-[10px] text-white/80 mt-0.5 font-medium">오직 CGV 회원에게만 제공되는 특별 쿠폰</p>
        </div>
        <button 
          onClick={() => alert("쿠폰 다운로드가 완료되었습니다!")}
          className="bg-white text-[#E51937] text-[10px] font-black px-3.5 py-2 rounded-xl active:scale-95 transition-all shadow"
        >
          쿠폰 받기 ↓
        </button>
      </div>

      {/* 7. Booking History / Mobile Tickets List (티켓창.jpg) */}
      <div id="booking-history-anchor" className="p-4 flex flex-col gap-4 mt-6 items-center">
        <div className="w-full flex items-center justify-between border-b border-gray-200 pb-2">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">모바일 티켓</h3>
          <span className="text-[10px] font-bold text-gray-400">총 {bookingHistory.length}건</span>
        </div>

        {bookingHistory.length === 0 ? (
          /* Ticket empty illustration (티켓창.jpg 레퍼런스 스타일) */
          <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300 bg-white border border-gray-200 border-dashed rounded-3xl w-full px-6">
            <div className="w-18 h-18 rounded-full bg-gray-50 flex items-center justify-center text-3xl mb-4 border border-gray-100 select-none">
              ☁️
            </div>
            <p className="text-xs text-gray-400 font-bold leading-normal">
              예매하신 모바일 티켓이 없습니다.
            </p>
            <p className="text-[10px] text-gray-300 mt-1 leading-normal">
              지금 추천작 예매를 진행해보세요!
            </p>
            <button 
              onClick={() => router.push('/booking')}
              className="mt-5 px-6 py-2 bg-[#E51937] hover:bg-[#d1152f] text-white rounded-full text-[10px] font-black transition-all active:scale-95 shadow"
            >
              영화 예매하러 가기
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 w-full items-center">
            {bookingHistory.map(booking => (
              <Ticket 
                key={booking.id} 
                booking={booking} 
                onCancel={(id) => cancelBooking(id)} 
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
