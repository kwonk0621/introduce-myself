"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockMovies, Movie } from '@/data/mockMovies';
import { useBooking } from '@/context/BookingContext';

export default function Home() {
  const router = useRouter();
  const { selectMovie } = useBooking();
  
  const [activeSubTab, setActiveSubTab] = useState<'chart' | 'showing' | 'upcoming'>('chart');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const handleBooking = (movie: Movie) => {
    selectMovie(movie);
    router.push('/booking');
  };

  const handleMovieDetail = (id: string) => {
    router.push(`/movie/${id}`);
  };

  const toggleWishlist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filter movies based on active subtab
  const getFilteredMovies = () => {
    switch (activeSubTab) {
      case 'showing':
        return mockMovies.filter(m => m.status === 'now-showing');
      case 'upcoming':
        return mockMovies.filter(m => m.status === 'upcoming');
      case 'chart':
      default:
        // Rank by reservation rate
        return [...mockMovies].sort((a, b) => b.reservationRate - a.reservationRate);
    }
  };

  const displayedMovies = getFilteredMovies();

  // Helper for age limit badge styling
  const renderAgeBadge = (age: number) => {
    let bgColor = 'bg-yellow-500';
    let text = age.toString();
    if (age === 0) {
      bgColor = 'bg-green-500';
      text = '전체';
    } else if (age === 12) {
      bgColor = 'bg-blue-400';
    } else if (age === 19) {
      bgColor = 'bg-red-500';
    }
    return (
      <span className={`w-4.5 h-4.5 ${bgColor} text-white font-extrabold text-[9px] rounded-md flex items-center justify-center shrink-0`}>
        {text}
      </span>
    );
  };

  // Helper for D-Day count
  const renderDDay = (releaseDate: string) => {
    const today = new Date();
    const release = new Date(releaseDate);
    const diffTime = release.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return (
        <span className="text-[10px] text-[#E51937] font-bold ml-1.5 shrink-0">
          D-{diffDays}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F5F7] pb-16 w-full select-none">
      
      {/* 1. Main Navigation Capsules (영화, 이벤트/혜택, 미니언즈...) */}
      <div className="bg-white px-3 py-3 border-b border-gray-100 flex items-center gap-2 overflow-x-auto scrollbar-none w-full">
        <button className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-bold shrink-0">
          🎬 영화
        </button>
        <button className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold shrink-0 hover:bg-gray-200">
          이벤트/혜택
        </button>
        <button className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold shrink-0 hover:bg-gray-200">
          미니언즈 탐구생활
        </button>
        <button className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold shrink-0 hover:bg-gray-200">
          클럽서비스
        </button>
      </div>

      {/* 2. Sub Category Tabs (무비차트, 현재상영작, 상영예정...) */}
      <div className="bg-white px-4 py-2 border-b border-gray-200 flex items-center justify-between w-full">
        <div className="flex items-center gap-4 text-sm sm:text-base font-bold text-gray-400">
          <button
            onClick={() => setActiveSubTab('chart')}
            className={`pb-1 transition-all ${
              activeSubTab === 'chart' 
                ? 'text-gray-900 border-b-2 border-gray-900' 
                : 'hover:text-gray-600'
            }`}
          >
            무비차트
          </button>
          <button
            onClick={() => setActiveSubTab('showing')}
            className={`pb-1 transition-all ${
              activeSubTab === 'showing' 
                ? 'text-gray-900 border-b-2 border-gray-900' 
                : 'hover:text-gray-600'
            }`}
          >
            현재상영작
          </button>
          <button
            onClick={() => setActiveSubTab('upcoming')}
            className={`pb-1 transition-all ${
              activeSubTab === 'upcoming' 
                ? 'text-gray-900 border-b-2 border-gray-900' 
                : 'hover:text-gray-600'
            }`}
          >
            상영예정
          </button>
        </div>
        
        <span className="text-xs text-gray-400 font-semibold cursor-pointer">
          전체보기 &rsaquo;
        </span>
      </div>

      {/* 3. Movie Carousel Card Slider */}
      <div className="bg-white py-6 overflow-hidden flex flex-col gap-4 w-full">
        
        {/* Horizontal scroll container */}
        <div className="flex gap-4 overflow-x-auto scrollbar-none px-4 scroll-smooth snap-x snap-mandatory">
          
          {/* Static AD Card 구좌 (홈.jpg 레퍼런스 반영) */}
          <div className="scroll-x-item snap-start flex-shrink-0 w-[240px] aspect-[2/3] rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 border border-gray-200 flex flex-col justify-between p-5 relative overflow-hidden text-white shadow-md">
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/30 border border-white/20 text-[9px] font-bold tracking-wider">
              AD
            </div>
            <div className="mt-8">
              <span className="text-[11px] font-semibold tracking-wide uppercase opacity-90 block">CineReserve 멤버십</span>
              <h3 className="text-2xl font-black leading-tight mt-1">영화 예매는<br />언제나 CGV에서!</h3>
            </div>
            <div>
              <p className="text-xs opacity-80">지금 가입하고 할인 쿠폰 받기</p>
              <button 
                onClick={() => router.push('/login')} 
                className="mt-3 px-4 py-1.5 rounded-full bg-white text-blue-600 text-xs font-bold hover:bg-opacity-95 transition-all"
              >
                더 알아보기 &rsaquo;
              </button>
            </div>
          </div>

          {/* Movie Cards list */}
          {displayedMovies.map((movie, index) => {
            const isRanked = activeSubTab === 'chart';
            const rankNumber = index + 1;
            const hasHeart = wishlist.includes(movie.id);

            return (
              <div 
                key={movie.id} 
                className="scroll-x-item snap-start flex-shrink-0 w-[240px] flex flex-col items-center cursor-pointer"
                onClick={() => handleMovieDetail(movie.id)}
              >
                
                {/* Poster Box */}
                <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-gray-950 border border-gray-100 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-full h-full object-cover" 
                  />

                  {/* Heart / Wishlist Icon */}
                  <button
                    onClick={(e) => toggleWishlist(e, movie.id)}
                    className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all"
                  >
                    <svg 
                      className="w-4.5 h-4.5 transition-colors" 
                      fill={hasHeart ? "#E51937" : "none"} 
                      stroke={hasHeart ? "#E51937" : "currentColor"} 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {/* Gigantic Rank Number (홈.jpg 레퍼런스 스타일) */}
                  {isRanked && (
                    <span className="absolute bottom-0 left-2 text-[80px] font-black text-white italic leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] opacity-95">
                      {rankNumber}
                    </span>
                  )}

                  {/* Tech specs/Format badges at bottom right */}
                  <div className="absolute bottom-3 right-3 flex flex-col gap-0.5 items-end">
                    <span className="text-[7px] font-bold px-1.5 py-0.5 rounded bg-black/75 border border-white/10 text-gray-300">IMAX</span>
                    <span className="text-[7px] font-bold px-1.5 py-0.5 rounded bg-black/75 border border-white/10 text-gray-300">4DX</span>
                    <span className="text-[7px] font-bold px-1.5 py-0.5 rounded bg-black/75 border border-white/10 text-gray-300">SCREENX</span>
                  </div>
                </div>

                {/* Movie Information metadata block */}
                <div className="w-full text-center mt-3 px-1 flex flex-col items-center">
                  <div className="flex items-center gap-1.5 w-full justify-center">
                    {renderAgeBadge(movie.ageLimit)}
                    <h4 className="font-extrabold text-gray-900 text-sm truncate max-w-[180px]">{movie.title}</h4>
                  </div>
                  
                  <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px] text-gray-500 font-medium">
                    {movie.reservationRate > 0 && <span>예매율 {movie.reservationRate}%</span>}
                    <span>•</span>
                    <span className="text-xs text-gray-600 font-semibold">{movie.releaseDate.replace(/-/g, '.')} 개봉</span>
                    {renderDDay(movie.releaseDate)}
                  </div>

                  {/* Centered booking button pill (홈.jpg / 홈2.jpg 레퍼런스 반영) */}
                  {movie.status === 'now-showing' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBooking(movie);
                      }}
                      className="mt-3.5 px-6 py-1 border border-gray-300 hover:border-[#E51937] bg-white text-gray-900 hover:text-[#E51937] hover:bg-[#E51937]/5 rounded-full text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      예매하기
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMovieDetail(movie.id);
                      }}
                      className="mt-3.5 px-6 py-1 border border-gray-300 hover:border-gray-400 bg-white text-gray-900 hover:text-gray-600 rounded-full text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      상세보기
                    </button>
                  )}

                </div>

              </div>
            );
          })}

        </div>

        {/* List view toggle display option */}
        <div className="w-full flex justify-end px-4 mt-2">
          <button 
            onClick={() => alert("리스트형 보기는 아직 지원하지 않습니다.")}
            className="text-[11px] text-gray-400 font-bold hover:text-gray-600 flex items-center gap-1"
          >
            🔄 리스트형
          </button>
        </div>

      </div>

    </div>
  );
}
