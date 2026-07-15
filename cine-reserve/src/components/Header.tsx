"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import { mockMovies } from '@/data/mockMovies';

interface HeaderProps {
  id?: string;
}

const Header: React.FC<HeaderProps> = ({ id }) => {
  const router = useRouter();
  const { 
    user, 
    logout, 
    resetBookingFlow, 
    searchQuery, 
    setSearchQuery, 
    isSearchOpen, 
    setIsSearchOpen,
    bookingHistory
  } = useBooking();

  const handleLogoClick = () => {
    resetBookingFlow();
    router.push('/');
  };

  const activeTicketsCount = bookingHistory.length;

  const filteredMovies = searchQuery.trim() === "" 
    ? [] 
    : mockMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        movie.englishTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <header 
      id={id || "global-header"} 
      className="sticky top-0 z-50 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 w-full select-none"
    >
      {/* CGV Red Logo */}
      <button 
        onClick={handleLogoClick}
        className="flex items-center gap-1 cursor-pointer focus:outline-none"
      >
        <span className="text-2xl font-black text-[#E51937] tracking-tighter italic flex items-center gap-0.5">
          CGV
          <span className="w-1.5 h-1.5 bg-[#E51937] rounded-full inline-block animate-pulse" />
        </span>
      </button>

      {/* Header controls (Ticket, Bell, Search) */}
      <div className="flex items-center gap-3">
        {/* Ticket shape icon shortcut to mobile tickets */}
        <Link 
          href="/mypage"
          className="p-1.5 text-gray-700 hover:text-[#E51937] rounded-lg transition-colors relative"
          title="모바일 티켓"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          {activeTicketsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E51937] ring-1 ring-white" />
          )}
        </Link>

        {/* Bell icon */}
        <button 
          onClick={() => alert("새로운 알림이 없습니다.")}
          className="p-1.5 text-gray-700 hover:text-[#E51937] transition-colors"
          title="알림"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* Search button */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="p-1.5 text-gray-700 hover:text-[#E51937] transition-colors"
          title="영화 검색"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3.5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="영화 제목 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-900 text-sm w-full placeholder-gray-400 focus:ring-0"
                  autoFocus
                />
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-1 text-gray-400 hover:text-gray-900 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="max-h-72 overflow-y-auto p-2 bg-gray-50">
              {searchQuery.trim() === "" ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  영화 제목을 입력하세요.
                </div>
              ) : filteredMovies.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {filteredMovies.map(movie => (
                    <button
                      key={movie.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        router.push(`/movie/${movie.id}`);
                      }}
                      className="flex items-center gap-3 p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-left w-full border border-transparent hover:border-gray-100"
                    >
                      <div className="w-8 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={movie.posterUrl} 
                          alt={movie.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs">{movie.title}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] text-[#E51937] font-semibold">★ {movie.rating}</span>
                          <span className="text-[9px] text-gray-400">{movie.genre[0]}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
