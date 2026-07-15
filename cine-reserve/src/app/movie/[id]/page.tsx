"use client";

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockMovies } from '@/data/mockMovies';
import { useBooking } from '@/context/BookingContext';

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

const MovieDetailPage: React.FC<MovieDetailPageProps> = ({ params }) => {
  const router = useRouter();
  const { selectMovie } = useBooking();
  const { id } = use(params);

  const [isWished, setIsWished] = useState(false);

  // Find movie
  const movie = mockMovies.find(m => m.id === id);

  if (!movie) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F4F5F7] text-gray-900 py-24">
        <h2 className="text-lg font-bold mb-4">영화 정보를 찾을 수 없습니다.</h2>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 rounded-full bg-[#E51937] text-white font-semibold text-xs"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const handleBooking = () => {
    selectMovie(movie);
    router.push('/booking');
  };

  const isUpcoming = movie.status === 'upcoming';

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
      <span className={`w-5 h-5 ${bgColor} text-white font-extrabold text-[10px] rounded-md flex items-center justify-center shrink-0`}>
        {text}
      </span>
    );
  };

  // Convert runtime to hours and minutes
  const formatRuntime = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs}시간 ${remainingMins}분`;
  };

  return (
    <div className="flex-1 bg-white text-gray-900 pb-20 select-none relative flex flex-col min-h-screen">
      
      {/* 1. Backdrop Poster with absolute position */}
      <div className="relative w-full h-[400px] overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover object-center scale-102 filter brightness-[0.4]"
        />
        {/* Dark vertical gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        {/* Top Floating Icons (Back, Home, Share, Wishlist) */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-white">
          <button 
            onClick={() => router.push('/')}
            className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.push('/')}
              className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
            <button 
              onClick={() => alert("공유 링크가 클립보드에 복사되었습니다.")}
              className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 10.742l4.636-2.318a2.5 2.5 0 11.9 1.788L9.75 12.518a2.5 2.5 0 11-.9-1.788z" />
              </svg>
            </button>
            <button 
              onClick={() => setIsWished(!isWished)}
              className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
            >
              <svg className="w-5 h-5" fill={isWished ? "#E51937" : "none"} stroke={isWished ? "#E51937" : "currentColor"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 2. Movie Info overlay bottom block */}
        <div className="absolute bottom-6 left-5 right-5 z-10 text-white text-left">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-black tracking-tight">{movie.title}</h1>
            {renderAgeBadge(movie.ageLimit)}
          </div>
          
          <p className="text-[11px] font-medium text-gray-300 mb-2">
            {movie.releaseDate.replace(/-/g, '.')} 개봉 • {formatRuntime(movie.runtime)} • {movie.genre.join(', ')}
          </p>

          <div className="flex gap-1.5 mt-3.5">
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-gray-200">SCREENX</span>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-gray-200">4DX</span>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-gray-200">IMAX</span>
          </div>
        </div>

      </div>

      {/* 3. Movie stats circles (예매율, 누적관객수, 에그지수) */}
      <div className="px-5 py-6 flex items-center justify-between border-b border-gray-100 bg-white">
        
        {/* 예매율 */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 mb-1 border border-gray-100">
            <svg className="w-5 h-5 text-[#E51937]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">예매율 {movie.id === 'hope' ? '1위' : '순위'}</span>
          <span className="text-sm font-extrabold text-gray-900 mt-0.5">{movie.id === 'hope' ? '47.1%' : `${movie.reservationRate}%`}</span>
        </div>

        <div className="w-px h-10 bg-gray-200" />

        {/* 누적관객수 */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 mb-1 border border-gray-100">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">누적관객수</span>
          <span className="text-sm font-extrabold text-gray-900 mt-0.5">{movie.id === 'hope' ? '5,632명' : '15,280명'}</span>
        </div>

        <div className="w-px h-10 bg-gray-200" />

        {/* 에그지수 */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 mb-1 border border-gray-100">
            <span className="text-xl">🥚</span>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold">에그지수</span>
          <span className="text-sm font-extrabold text-gray-900 mt-0.5">?</span>
        </div>

      </div>

      {/* 4. Movie Synopsis section */}
      <div className="px-5 py-6 bg-white flex flex-col gap-3 pb-24">
        <h3 className="text-sm font-extrabold text-gray-900">시놉시스</h3>
        <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line text-left">
          {movie.synopsis}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <div className="text-xs">
            <span className="text-gray-400 font-bold block">감독</span>
            <span className="text-gray-700 font-semibold">{movie.director}</span>
          </div>
          <div className="text-xs mt-2">
            <span className="text-gray-400 font-bold block">주연배우</span>
            <span className="text-gray-700 font-semibold leading-relaxed">{movie.cast.join(', ')}</span>
          </div>
        </div>

        {isUpcoming && (
          <div className="mt-8 border-t border-gray-100 pt-6 text-left">
            <h3 className="text-sm font-extrabold text-gray-900 mb-3.5">프롤로그</h3>
            <div className="w-full bg-[#F4F5F7] rounded-xl p-4 flex items-center gap-3.5 border border-gray-200/40">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg border border-gray-100">
                📢
              </div>
              <span className="text-xs font-black text-gray-700">차주 예매 오픈 예정</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Sticky Bottom 예매하기 Button */}
      {!isUpcoming && (
        <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto w-full z-40 bg-white border-t border-gray-100">
          <button
            onClick={handleBooking}
            className="w-full py-4.5 bg-[#E51937] hover:bg-[#d1152f] text-white font-extrabold text-base transition-all select-none focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
          >
            예매하기
          </button>
        </div>
      )}

    </div>
  );
};

export default MovieDetailPage;
