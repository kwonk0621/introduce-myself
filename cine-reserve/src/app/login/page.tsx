"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useBooking();
  const [username, setUsername] = useState("용감한납득이5754");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim(), false);
      router.push('/mypage');
    }
  };

  const handleGuestLogin = () => {
    login("비회원", true);
    router.push('/mypage');
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-[#F4F5F7] px-6 py-12 select-none animate-in fade-in duration-300">
      
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-3xl p-6 shadow-cgv flex flex-col text-left">
        
        {/* CGV Styled Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-black text-[#E51937] tracking-tighter italic inline-block">
            CGV
          </span>
          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">CineReserve 가상 로그인</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="text-[10px] text-gray-400 font-black uppercase block mb-1">아이디 / 닉네임</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E51937] outline-none text-xs font-bold text-gray-900 transition-all placeholder-gray-300 bg-gray-50/50"
              placeholder="아이디 또는 이름을 입력하세요"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#E51937] hover:bg-[#d1152f] text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            로그인
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <span className="relative bg-white px-3 text-[9px] text-gray-300 font-bold uppercase">또는</span>
        </div>

        <button
          onClick={handleGuestLogin}
          className="w-full py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-extrabold text-xs transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          비회원 로그인
        </button>

      </div>

    </div>
  );
}
