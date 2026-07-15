"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';

const Footer: React.FC = () => {
  const pathname = usePathname();
  const { resetBookingFlow } = useBooking();

  const handleBookingClick = () => {
    resetBookingFlow();
  };

  const isHomeActive = pathname === '/';
  const isBookingActive = pathname === '/booking';
  const isMyPageActive = pathname === '/mypage';

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 h-16 flex items-center justify-between px-2 select-none shadow-lg">
      <div className="max-w-md mx-auto w-full flex items-center justify-around relative">
        
        {/* 홈 */}
        <Link 
          href="/" 
          onClick={() => resetBookingFlow()}
          className={`flex flex-col items-center justify-center w-12 transition-colors ${
            isHomeActive ? 'text-[#E51937]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill={isHomeActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] mt-1 font-medium">홈</span>
        </Link>

        {/* 씨네톡 */}
        <Link 
          href="/cinetalk" 
          className={`flex flex-col items-center justify-center w-12 transition-colors ${
            pathname === '/cinetalk' ? 'text-[#E51937]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill={pathname === '/cinetalk' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-[10px] mt-1 font-medium">씨네톡</span>
        </Link>

        {/* 예매·예약 (Floating red button) */}
        <div className="relative -top-4">
          <Link
            href="/booking"
            onClick={handleBookingClick}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center text-white transition-all shadow-md active:scale-95 ${
              isBookingActive 
                ? 'bg-[#b81229] ring-4 ring-white' 
                : 'bg-[#E51937] hover:bg-[#d1152f] ring-4 ring-white shadow-[#E51937]/30'
            }`}
          >
            <span className="text-[10px] font-bold leading-none tracking-tighter">예매·예약</span>
          </Link>
        </div>

        {/* 매점 */}
        <Link 
          href="/store"
          className={`flex flex-col items-center justify-center w-12 transition-colors ${
            pathname === '/store' ? 'text-[#E51937]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill={pathname === '/store' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm-2 4h4M5 20h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] mt-1 font-medium">매점</span>
        </Link>

        {/* 더보기 (마이페이지) */}
        <Link 
          href="/mypage"
          className={`flex flex-col items-center justify-center w-12 transition-colors ${
            isMyPageActive ? 'text-[#E51937]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill={isMyPageActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[10px] mt-1 font-medium">더보기</span>
        </Link>

      </div>
    </footer>
  );
};

export default Footer;
