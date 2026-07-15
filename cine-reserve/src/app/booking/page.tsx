"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import { mockMovies, mockTheaters, mockSchedules, Movie } from '@/data/mockMovies';
import SeatMap from '@/components/SeatMap';
import Ticket from '@/components/Ticket';

export default function BookingPage() {
  const router = useRouter();
  const {
    user,
    activeStep,
    selectedMovie,
    selectedTheater,
    selectedDate,
    selectedSchedule,
    selectedTimeSlot,
    headcount,
    selectedSeats,
    bookingHistory,
    login,
    selectMovie,
    selectTheaterAndDate,
    selectScheduleTime,
    updateHeadcount,
    toggleSeat,
    goToStep,
    resetBookingFlow,
    clearSelectedSeats,
    completePayment
  } = useBooking();

  const [activeTab, setActiveTab] = useState<'movie' | 'theater'>('movie');
  const [formatFilter, setFormatFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [showSeatMap, setShowSeatMap] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [guestName, setGuestName] = useState<string>("");
  const [isTermsAgreed, setIsTermsAgreed] = useState<boolean>(false);
  const [isTheaterModalOpen, setIsTheaterModalOpen] = useState<boolean>(false);

  const nowShowingMovies = mockMovies.filter(m => m.status === 'now-showing');

  // Filter schedules based on selections, including special format filter
  const availableSchedules = selectedMovie && selectedTheater && selectedDate
    ? mockSchedules.filter(s => 
        s.movieId === selectedMovie.id && 
        s.theaterId === selectedTheater.id && 
        s.date === selectedDate &&
        (formatFilter === 'all' || s.screenType.toLowerCase() === formatFilter)
      )
    : [];

  const totalHeadcount = headcount.adult + headcount.youth + headcount.special + headcount.senior;

  // Calculate dynamic price
  const calculateTotalPrice = () => {
    return headcount.adult * 10000 + 
           headcount.youth * 8000 + 
           headcount.special * 7000 + 
           headcount.senior * 6000;
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim()) {
      login(guestName.trim(), true);
    }
  };

  const handleFinalPayment = () => {
    if (!isTermsAgreed) {
      alert("약관 동의가 필요합니다.");
      return;
    }
    const booking = completePayment(paymentMethod);
    if (!booking) {
      alert("예매 정보가 부족합니다.");
    }
  };

  const latestBooking = bookingHistory[0];

  // Helper list of dates (Next 5 days)
  const getNextFiveDays = () => {
    const list = [];
    const weeks = ['일', '월', '화', '수', '목', '금', '토'];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const dayName = weeks[d.getDay()];
      list.push({
        date: dateStr,
        day: d.getDate(),
        dayName,
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
        dayOfWeekNum: d.getDay()
      });
    }
    return list;
  };

  const bookingDates = getNextFiveDays();

  // Helper age limit badge
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
      <span className={`w-3.5 h-3.5 ${bgColor} text-white font-extrabold text-[8px] rounded flex items-center justify-center shrink-0`}>
        {text}
      </span>
    );
  };

  return (
    <div className="flex-1 bg-[#F4F5F7] text-gray-900 pb-20 w-full select-none flex flex-col">
      
      {/* ──────────────────────────────────────────────────────────── */}
      {/* STEP 2: Movie, Theater, Date, and Time Selection (예매창.jpg) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeStep <= 2 && (
        <div className="flex flex-col bg-white border-b border-gray-200 animate-in fade-in duration-300">
          
          {/* Top Selection Tabs (KakaoTalk image style) */}
          <div className="bg-[#1A1A1A] px-4 py-3 flex items-center justify-between sticky top-0 z-30 text-white border-b border-gray-800">
            <div className="flex items-center gap-4 text-sm font-extrabold">
              <button 
                type="button"
                onClick={() => setActiveTab('movie')}
                className={`py-1 relative cursor-pointer transition-colors ${
                  activeTab === 'movie' ? 'text-white' : 'text-gray-500'
                }`}
              >
                <span>영화별 예매</span>
                {activeTab === 'movie' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded" />
                )}
              </button>
              <span className="text-gray-700">|</span>
              <button 
                type="button"
                onClick={() => setActiveTab('theater')}
                className={`py-1 relative cursor-pointer transition-colors ${
                  activeTab === 'theater' ? 'text-white' : 'text-gray-500'
                }`}
              >
                <span>극장별 예매</span>
                {activeTab === 'theater' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded" />
                )}
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>


          {/* 1. Date Slider (Always at top for Theater-based, or contextual for Movie-based) */}
          {activeTab === 'theater' && (
            <div className="border-b border-gray-200 px-4 py-3 overflow-x-auto scrollbar-none bg-[#1A1A1A] text-white">
              <div className="flex gap-2.5">
                {bookingDates.map((d, index) => {
                  const isSelected = selectedDate === d.date;
                  let colorClass = "text-white";
                  if (d.dayOfWeekNum === 6) colorClass = "text-blue-400";
                  if (d.dayOfWeekNum === 0) colorClass = "text-red-400";
                  
                  return (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => selectTheaterAndDate(selectedTheater || mockTheaters[0], d.date)}
                      className={`flex flex-col items-center justify-center w-11 h-14 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#E51937] border-[#E51937] text-white shadow-sm' 
                          : 'bg-[#2A2A2A] border-transparent hover:border-gray-700'
                      }`}
                    >
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-white/90' : 'text-gray-400'}`}>
                        {d.dayName}
                      </span>
                      <span className={`text-base font-black mt-0.5 ${isSelected ? 'text-white' : colorClass}`}>
                        {d.day}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Time Filter capsules (Always visible in theater tab or movie tab when active) */}
          <div className="flex items-center gap-1.5 px-4 py-3 overflow-x-auto scrollbar-none bg-[#1A1A1A] border-b border-gray-800">
            {[
              { id: "all", name: "전체" },
              { id: "morning", name: "오전" },
              { id: "afternoon", name: "오후" },
              { id: "night", name: "18시 이후" },
              { id: "late", name: "심야" }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeFilter(t.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                  timeFilter === t.id 
                    ? 'bg-[#E51937] border-[#E51937] text-white' 
                    : 'bg-[#2A2A2A] border-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Movie-based Reservation Layout (activeTab === 'movie') */}
          {activeTab === 'movie' && (
            <>
              {/* Format pills */}
              <div className="flex items-center gap-1.5 px-4 py-3 overflow-x-auto scrollbar-none bg-gray-50 border-b border-gray-100 shrink-0">
                <button 
                  type="button"
                  onClick={() => setFormatFilter('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer border ${
                    formatFilter === 'all' 
                      ? 'bg-white text-gray-900 border-gray-300 shadow-sm font-extrabold' 
                      : 'bg-transparent text-gray-400 border-transparent hover:text-gray-600'
                  }`}
                >
                  전체
                </button>
                {['SCREENX', '4DX', 'IMAX', 'DOLBY'].map(f => (
                  <button 
                    key={f}
                    type="button"
                    onClick={() => setFormatFilter(f.toLowerCase())}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer border ${
                      formatFilter === f.toLowerCase() 
                        ? 'bg-white text-gray-900 border-gray-300 shadow-sm font-extrabold' 
                        : 'bg-transparent text-gray-400 border-transparent hover:text-gray-600'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Movie carousel display */}
              <div className="px-4 py-4 border-b border-gray-200 bg-white">
                <div className="flex gap-3 overflow-x-auto scrollbar-none py-1">
                  {nowShowingMovies.map(movie => {
                    const isSelected = selectedMovie?.id === movie.id;
                    return (
                      <button
                        key={movie.id}
                        type="button"
                        onClick={() => selectMovie(movie)}
                        className={`flex-shrink-0 w-16 text-center transition-all focus:outline-none cursor-pointer ${
                          isSelected ? 'scale-105 opacity-100 ring-2 ring-[#E51937] rounded-lg' : 'opacity-60 hover:opacity-90'
                        }`}
                      >
                        <div className={`aspect-[2/3] rounded-lg overflow-hidden border bg-gray-100 ${
                          isSelected ? 'border-2 border-[#E51937] shadow-sm' : 'border-gray-200'
                        }`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedMovie && (
                  <div className="mt-3 flex items-center justify-center gap-1 text-xs">
                    {renderAgeBadge(selectedMovie.ageLimit)}
                    <span className="font-extrabold text-gray-900">{selectedMovie.title}</span>
                    <span className="text-gray-400">| {Math.floor(selectedMovie.runtime / 60)}시간 {selectedMovie.runtime % 60}분</span>
                  </div>
                )}
              </div>

              {/* Date Slider inside Movie-based tab */}
              {selectedMovie && (
                <div className="border-b border-gray-200 px-4 py-3 overflow-x-auto scrollbar-none bg-white">
                  <div className="flex gap-2.5">
                    {bookingDates.map((d, index) => {
                      const isSelected = selectedDate === d.date;
                      let colorClass = "text-gray-900";
                      if (d.dayOfWeekNum === 6) colorClass = "text-blue-500";
                      if (d.dayOfWeekNum === 0) colorClass = "text-[#E51937]";
                      
                      return (
                        <button
                          key={d.date}
                          type="button"
                          onClick={() => selectTheaterAndDate(selectedTheater || mockTheaters[0], d.date)}
                          className={`flex flex-col items-center justify-center w-11 h-14 rounded-xl border transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#E51937] border-[#E51937] text-white shadow-sm' 
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-white/90' : 'text-gray-400'}`}>
                            {d.dayName}
                          </span>
                          <span className={`text-base font-black mt-0.5 ${isSelected ? 'text-white' : colorClass}`}>
                            {d.day}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Theater Horizontal Select pills (CGV Style: 안산, 용산아이파크몰, 일산, 광교...) */}
              {selectedMovie && selectedDate && (
                <div className="px-4 py-3.5 border-b border-gray-200 bg-white flex items-center gap-2 overflow-x-auto scrollbar-none">
                  {mockTheaters.map(t => {
                    const isSelected = selectedTheater?.id === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => selectTheaterAndDate(t, selectedDate)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-black border-black text-white' 
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setIsTheaterModalOpen(true)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Filter layout sort pills: 전체, 특별관 */}
              {selectedMovie && selectedDate && (
                <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center text-xs font-bold text-gray-400 gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormatFilter('all')}
                    className={`pb-0.5 relative transition-colors cursor-pointer ${
                      formatFilter === 'all' ? 'text-gray-900 font-extrabold' : 'text-gray-400'
                    }`}
                  >
                    <span>전체</span>
                    {formatFilter === 'all' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded" />
                    )}
                  </button>
                  <span className="text-gray-200">|</span>
                  <button 
                    type="button"
                    onClick={() => setFormatFilter('imax')}
                    className={`pb-0.5 relative transition-colors cursor-pointer ${
                      formatFilter !== 'all' ? 'text-gray-900 font-extrabold' : 'text-gray-400'
                    }`}
                  >
                    <span>특별관</span>
                    {formatFilter !== 'all' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded" />
                    )}
                  </button>
                </div>
              )}

              {/* Showtimes list */}
              {selectedMovie && selectedDate && (
                <div className="p-4 bg-gray-50/50 flex-1">
                  {availableSchedules.length === 0 ? (
                    <div className="py-12 text-center text-xs text-gray-400 bg-white border border-gray-200 border-dashed rounded-xl">
                      선택하신 날짜에 상영 일정이 없습니다.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {availableSchedules.map(schedule => (
                        <div key={schedule.id} className="text-left">
                          <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2.5">
                            {schedule.screenType}
                          </h3>
                          <div className="grid grid-cols-3 gap-2">
                            {schedule.times.map(t => {
                              const availableCount = t.totalSeats - t.reservedSeats.length;
                              return (
                                <button
                                  key={t.time}
                                  type="button"
                                  onClick={() => selectScheduleTime(schedule, t)}
                                  className="bg-white border border-gray-200 hover:border-[#E51937] p-2.5 rounded-xl text-left shadow-sm hover:shadow transition-all flex flex-col justify-between h-20 w-full cursor-pointer"
                                >
                                  {/* Row 1: Time range */}
                                  <div className="flex items-baseline gap-0.5">
                                    <span className="font-extrabold text-sm text-gray-950">{t.time}</span>
                                    <span className="text-[9px] text-gray-400">-{t.endTime}</span>
                                  </div>

                                  {/* Row 2: Available Seats & Sun Icon */}
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <span className="text-[10px] font-bold text-[#3b82f6]">
                                      {availableCount}
                                      <span className="text-gray-400 font-medium">/{t.totalSeats}석</span>
                                    </span>
                                    {parseInt(t.time.split(':')[0]) < 12 && (
                                      <span className="text-xs">☀️</span>
                                    )}
                                  </div>

                                  {/* Row 3: Hall Name */}
                                  <span className="text-[9px] text-gray-400 font-medium mt-1">{t.hallName}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Theater-based Reservation Layout (activeTab === 'theater') */}
          {activeTab === 'theater' && (
            <>
              {/* Theater horizontal selector tab (안산, 용산아이파크몰, 일산, 광교...) */}
              <div className="px-4 py-4 border-b border-gray-200 bg-white flex items-center gap-2 overflow-x-auto scrollbar-none">
                {mockTheaters.map(t => {
                  const isSelected = selectedTheater?.id === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => selectTheaterAndDate(t, selectedDate || bookingDates[0].date)}
                      className={`px-5 py-2.5 rounded-full text-xs font-black shrink-0 border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-black border-black text-white shadow-md' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setIsTheaterModalOpen(true)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Movie-by-movie collapse layout inside the selected theater (KakaoTalk 1st screen style) */}
              <div className="bg-gray-50 flex-1 p-4 space-y-4">
                {nowShowingMovies.map(movie => {
                  // Fetch schedules for this theater, date, and movie
                  const movieSchedules = mockSchedules.filter(s => 
                    s.movieId === movie.id && 
                    s.theaterId === (selectedTheater?.id || mockTheaters[0].id) && 
                    s.date === (selectedDate || bookingDates[0].date)
                  );

                  return (
                    <div key={movie.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-left">
                      {/* Movie Header line */}
                      <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-3.5">
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={movie.posterUrl} alt={movie.title} className="w-8 h-11 object-cover rounded shadow-sm shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-extrabold text-xs text-gray-900 flex items-center gap-1.5">
                              {renderAgeBadge(movie.ageLimit)}
                              <span>{movie.title}</span>
                            </span>
                            <span className="text-[9px] text-gray-400 font-semibold mt-0.5">{movie.genre[0]} | {movie.runtime}분</span>
                          </div>
                        </div>
                        <span className="text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </div>

                      {/* Screen format & showtimes block */}
                      {movieSchedules.length === 0 ? (
                        <div className="text-[10px] text-gray-400 text-center py-2 font-semibold">
                          상영 일정이 없습니다.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {movieSchedules.map(sched => (
                            <div key={sched.id}>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">{sched.screenType}</span>
                              <div className="grid grid-cols-3 gap-2">
                                {sched.times.map(t => {
                                  const availableCount = t.totalSeats - t.reservedSeats.length;
                                  return (
                                    <button
                                      key={t.time}
                                      type="button"
                                      onClick={() => {
                                        // Pick movie + theater + date + schedule + time
                                        selectMovie(movie);
                                        selectScheduleTime(sched, t);
                                      }}
                                      className="bg-white border border-gray-200 hover:border-[#E51937] p-2.5 rounded-xl text-left shadow-sm hover:shadow transition-all flex flex-col justify-between h-20 w-full cursor-pointer"
                                    >
                                      {/* Row 1: Time range */}
                                      <div className="flex items-baseline gap-0.5">
                                        <span className="font-extrabold text-sm text-gray-950">{t.time}</span>
                                        <span className="text-[9px] text-gray-400">-{t.endTime}</span>
                                      </div>

                                      {/* Row 2: Available Seats & Sun Icon */}
                                      <div className="flex items-center gap-1 mt-0.5">
                                        <span className="text-[10px] font-bold text-[#3b82f6]">
                                          {availableCount}
                                          <span className="text-gray-400 font-medium">/{t.totalSeats}석</span>
                                        </span>
                                        {parseInt(t.time.split(':')[0]) < 12 && (
                                          <span className="text-xs">☀️</span>
                                        )}
                                      </div>

                                      {/* Row 3: Hall Name */}
                                      <span className="text-[9px] text-gray-400 font-medium mt-1">{t.hallName}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Theater Selection Modal */}
          {isTheaterModalOpen && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center">
              <div className="w-full max-w-md bg-[#F4F5F7] rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col h-[80vh] overflow-hidden">
                {/* Header of CGV 찾기 */}
                <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between shrink-0">
                  <span className="text-gray-900 font-black text-sm">CGV 찾기</span>
                  <button
                    type="button"
                    onClick={() => setIsTheaterModalOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-900 rounded-lg cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* 1. Search Bar */}
                <div className="bg-white px-4 pb-3 pt-1 shrink-0">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="지역명/CGV극장명을 입력하세요."
                      className="w-full bg-gray-50 border border-gray-200 outline-none text-xs font-semibold px-4 py-3 rounded-xl pr-10 text-gray-900 placeholder-gray-400 focus:border-[#E51937]"
                      readOnly
                    />
                    <span className="absolute right-3 top-3.5 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* 2. Horizontal Scrollable Region Tabs */}
                <div className="bg-white border-b border-gray-200 px-3 py-2.5 flex gap-2 overflow-x-auto scrollbar-none shrink-0 w-full text-xs font-bold">
                  {[
                    { id: 'recom', name: '추천' },
                    { id: 'seoul', name: '서울' },
                    { id: 'gyeonggi', name: '경기' },
                    { id: 'incheon', name: '인천' },
                    { id: 'gangwon', name: '강원' },
                    { id: 'dc', name: '대전/충청' }
                  ].map((region, idx) => (
                    <button
                      key={region.id}
                      type="button"
                      className={`px-4 py-1.5 rounded-full border transition-all shrink-0 cursor-pointer ${
                        idx === 0
                          ? 'bg-black border-black text-white'
                          : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {region.name}
                    </button>
                  ))}
                </div>

                {/* 3. Theater List Cards Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-8">
                  {mockTheaters.map(t => {
                    const isSelected = selectedTheater?.id === t.id;
                    
                    // Format badges based on theater name for realistic feel
                    let specialFormats = "2D, SCREENX";
                    let address = "서울특별시 마포구 양화로 186 (동교동, LC타워 7층)";
                    if (t.id === 'th-konda') {
                      specialFormats = "2D, SCREENX, DOLBY";
                      address = "서울특별시 광진구 아차산로 272 (자양동, 스타시티몰 2층)";
                    } else if (t.id === 'th-yongsan') {
                      specialFormats = "4DX, 아이맥스, SCREENX, DOLBY";
                      address = "서울특별시 용산구 한강대로23길 55 (한강로3가, 아이파크몰 6층)";
                    }

                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          selectTheaterAndDate(t, selectedDate || new Date().toISOString().split('T')[0]);
                          setIsTheaterModalOpen(false);
                        }}
                        className={`w-full bg-white border rounded-2xl p-4 text-left shadow-sm hover:shadow transition-all relative flex flex-col justify-between cursor-pointer ${
                          isSelected 
                            ? 'border-[#E51937] ring-1 ring-[#E51937]' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-900 font-extrabold text-xs flex items-center gap-1">
                              <span>⭐</span>
                              <span>{t.name}</span>
                            </span>
                            <span className="text-[8px] bg-green-50 text-green-600 border border-green-200 font-bold px-1.5 py-0.5 rounded">
                              운영중
                            </span>
                          </div>
                          {isSelected && <span className="text-[#E51937] text-[10px] font-bold">선택됨 ✓</span>}
                        </div>

                        <div className="text-[9px] font-extrabold text-[#E51937] mt-1.5">
                          {specialFormats}
                        </div>

                        <div className="text-[9px] text-gray-400 font-medium leading-relaxed mt-1 flex items-start gap-0.5">
                          <span>📍</span>
                          <span className="truncate">{address}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* STEP 3: Headcount & Seat Map view (인원선택창.jpg) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeStep === 3 && selectedMovie && selectedTheater && selectedTimeSlot && (
        <div className="flex flex-col bg-white border-b border-gray-200 animate-in fade-in duration-300">
          
          {/* Blurred summary header card at the top */}
          <div className="relative w-full h-24 overflow-hidden bg-black flex items-center px-4">
            {/* Background image blur */}
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedMovie.posterUrl} alt="" className="w-full h-full object-cover filter blur-md brightness-[0.3]" />
            </div>
            
            {/* Details overlay */}
            <div className="z-10 text-white text-left flex items-center justify-between w-full">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white">{selectedMovie.title}</h3>
                  {renderAgeBadge(selectedMovie.ageLimit)}
                </div>
                <p className="text-[10px] text-gray-300 mt-1 font-semibold">
                  {selectedDate?.replace(/-/g, '.')} ({getNextFiveDays().find(d=>d.date===selectedDate)?.dayName})
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {selectedTheater.name} • {selectedTimeSlot.hallName} • {selectedSchedule?.screenType}
                </p>
              </div>
              <button 
                onClick={() => goToStep(2)}
                className="text-[10px] bg-white/20 border border-white/30 px-3 py-1 rounded-full text-white font-bold"
              >
                시간 변경
              </button>
            </div>
          </div>

          {/* Toggle between Headcount Screen and Seat Selection Screen */}
          {showSeatMap ? (
            <SeatMap 
              reservedSeats={selectedTimeSlot.reservedSeats} 
              onComplete={() => setShowSeatMap(false)}
              onHeadcountChange={() => {
                setShowSeatMap(false);
                clearSelectedSeats();
              }}
            />
          ) : (
            <div className="p-4 flex flex-col gap-6 text-left">
              
              {/* Headcount Selection Section */}
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">관람인원</h4>
                  <button 
                    onClick={() => {
                      updateHeadcount('adult', 2);
                      updateHeadcount('youth', 0);
                      updateHeadcount('special', 0);
                      updateHeadcount('senior', 0);
                      clearSelectedSeats();
                    }}
                    className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-900"
                    title="초기화"
                  >
                    🔄
                  </button>
                </div>

                {/* Counters row list */}
                <div className="space-y-4">
                  {[
                    { id: 'adult', name: '일반', price: '10,000원' },
                    { id: 'youth', name: '청소년', price: '8,000원' },
                    { id: 'special', name: '우대', price: '7,000원' },
                    { id: 'senior', name: '경로', price: '6,000원' }
                  ].map(item => {
                    const currentCount = headcount[item.id as 'adult' | 'youth' | 'special' | 'senior'];
                    return (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-gray-700">{item.name}</span>
                          <span className="text-[9px] text-gray-400 ml-1.5">({item.price})</span>
                        </div>
                        
                        <div className="flex gap-1">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <button
                              key={num}
                              onClick={() => updateHeadcount(item.id as 'adult' | 'youth' | 'special' | 'senior', num)}
                              className={`w-7 h-7 text-xs font-bold rounded-lg border transition-all ${
                                currentCount === num
                                  ? 'bg-[#E51937] border-[#E51937] text-white shadow-sm font-black'
                                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots display helper */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex gap-2">
                  <div className="border-2 border-[#E51937] p-2.5 rounded-xl bg-white text-center shadow-sm w-28 flex flex-col items-center">
                    <span className="font-extrabold text-sm text-gray-900">{selectedTimeSlot.time}</span>
                    <span className="text-[8px] text-gray-400 leading-none">~ {selectedTimeSlot.endTime}</span>
                    <span className="text-[8px] text-gray-400 font-bold mt-1.5">{selectedTimeSlot.hallName}</span>
                  </div>
                  
                  {/* Neighboring time slots for convenience */}
                  {selectedSchedule?.times.filter(t => t.time !== selectedTimeSlot.time).slice(0, 2).map(t => (
                    <button
                      key={t.time}
                      onClick={() => selectScheduleTime(selectedSchedule, t)}
                      className="border border-gray-200 hover:border-[#E51937] p-2.5 rounded-xl bg-white text-center shadow-sm w-28 flex flex-col items-center opacity-50 hover:opacity-100 transition-all"
                    >
                      <span className="font-bold text-xs text-gray-600">{t.time}</span>
                      <span className="text-[8px] text-gray-400 leading-none">~ {t.endTime}</span>
                      <span className="text-[8px] text-gray-400 font-semibold mt-1">{t.hallName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* White summary pill above the black box (인원선택창 아래쪽.jpg) */}
              <div className="w-full bg-white border border-gray-200 rounded-xl p-3.5 mb-2.5 flex items-center font-extrabold text-xs text-gray-900">
                일반 {totalHeadcount}
              </div>

              {/* Bottom drawer for seat verification details (인원선택창 아래쪽.jpg / 인원선택창 아래쪽 좌석선택후.jpg) */}
              <div className="bg-[#121829] border border-gray-900 rounded-2xl p-4 text-white relative mt-2 shadow-xl text-left">
                
                {selectedSeats.length === 0 ? (
                  <div className="flex items-center justify-between mb-3.5">
                    <div>
                      <h4 className="font-extrabold text-xs text-white">좌석을 선택해 주세요</h4>
                      <p className="text-[9px] text-gray-400 mt-0.5">인원수를 먼저 지정한 후 선택 버튼을 눌러주세요.</p>
                    </div>
                    <button
                      disabled={totalHeadcount <= 0}
                      onClick={() => setShowSeatMap(true)}
                      className={`px-5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        totalHeadcount > 0 
                          ? 'bg-[#E51937] hover:bg-[#d1152f] text-white' 
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      선택
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3.5">
                    <div>
                      <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">선택하신 좌석 정보입니다.</h4>
                      <div className="flex items-center gap-2.5 mt-2">
                        {selectedSeats.map(seat => (
                          <span 
                            key={seat}
                            className="w-8 h-8 rounded-full border-2 border-[#E51937] bg-transparent flex items-center justify-center text-xs font-black text-[#E51937] tracking-wider"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowSeatMap(true)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-black text-gray-900 cursor-pointer hover:bg-gray-50"
                    >
                      변경
                    </button>
                  </div>
                )}

                {/* Mini seat preview map (Always rendered inside the dark container for both selected and unselected states) */}
                <div className="flex flex-col items-center py-4 bg-[#0A0E1A]/40 rounded-xl relative overflow-hidden">
                  {/* curved screen line */}
                  <div className="w-[180px] h-[3px] bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full shadow-[0_0_6px_rgba(249,115,22,0.4)]" />
                  <span className="text-[8px] text-gray-500 tracking-[0.4em] uppercase mt-1 mb-3">screen</span>
                  
                  {/* mini grid representation */}
                  <div className="grid gap-y-0.5">
                    {Array.from({ length: 8 }).map((_, rIndex) => {
                      const rowName = String.fromCharCode(65 + rIndex); // A to H
                      return (
                        <div key={rowName} className="flex gap-0.5 items-center">
                          {Array.from({ length: 13 }).map((_, cIndex) => {
                            const colNum = cIndex + 1;
                            const seatId = `${rowName}${colNum}`;
                            const isSelected = selectedSeats.includes(seatId);
                            const isReserved = selectedTimeSlot.reservedSeats.includes(seatId);
                            const isWheelchair = rowName === 'A' && (colNum === 7 || colNum === 8);
                            
                            let seatBg = "bg-white";
                            let borderClass = "border border-gray-400/20";
                            
                            if (isReserved) {
                              seatBg = "bg-gray-700/60";
                            } else if (isSelected) {
                              seatBg = "bg-[#E51937]";
                            } else if (isWheelchair) {
                              seatBg = "bg-blue-400";
                            }
                            
                            return (
                              <div 
                                key={seatId} 
                                className={`w-1.5 h-1.5 rounded-[1px] ${seatBg} ${borderClass} relative overflow-hidden`}
                              />
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend below the grid */}
                  <div className="flex items-center gap-4 text-[9px] text-gray-400 mt-4 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-white rounded-sm border border-gray-400/30" />
                      <span>일반석 (181)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-blue-400 rounded-sm" />
                      <span>장애인석 (2)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Warning label under the black box */}
              <div className="text-[10px] text-gray-500 mt-3 font-semibold text-left px-2 leading-relaxed flex items-start gap-1">
                <span className="text-[#E51937]">꼭 확인해 주세요</span>
                <span>본 상영관은 스마트 시트 운영중입니다. 고객님께서 예매하신 좌석에서만 관람이 가능합니다.</span>
              </div>

              {/* Bottom Sticky Payment Button */}
              <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto w-full bg-[#F4F5F7] border-t border-gray-200 px-4 py-3 flex items-center justify-center z-40 select-none h-16 shadow-lg">
                <button
                  disabled={selectedSeats.length === 0 || selectedSeats.length !== totalHeadcount}
                  onClick={() => goToStep(4)}
                  className={`w-full py-3.5 rounded-xl font-black text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 ${
                    selectedSeats.length > 0 && selectedSeats.length === totalHeadcount
                      ? 'bg-[#E51937] hover:bg-[#d1152f] text-white cursor-pointer shadow-[#E51937]/20'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none border border-transparent'
                  }`}
                >
                  {selectedSeats.length > 0 && selectedSeats.length === totalHeadcount
                    ? `${calculateTotalPrice().toLocaleString()}원 결제하기`
                    : '0원 결제하기'
                  }
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* STEP 4: Payment Simulation (결제창1.jpg / 결제창2.jpg / 결제창3.jpg) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeStep === 4 && selectedMovie && selectedTheater && selectedTimeSlot && (
        <div className="flex flex-col bg-[#F4F5F7] flex-1 animate-in fade-in duration-300 gap-4 pb-24">
          
          {/* Header Bar matching 결제창1.jpg */}
          <div className="bg-white border-b border-gray-200 px-4 py-3.5 flex items-center justify-between sticky top-0 z-10 text-gray-900 shrink-0">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => goToStep(3)} 
                className="w-8 h-8 rounded-full hover:bg-gray-150 flex items-center justify-center text-xl font-bold cursor-pointer"
              >
                &lsaquo;
              </button>
              <span className="text-sm font-black text-gray-900">결제</span>
            </div>
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
              📍 {selectedTheater.name}
            </span>
          </div>

          <div className="px-4 space-y-4">
            {/* 1. 상품정보 및 할인쿠폰 (결제창1.jpg) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 text-left shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">상품정보 및 할인쿠폰</h4>
                <span className="text-xs text-gray-400">▼</span>
              </div>

              <div className="flex gap-3">
                <div className="w-12 h-18 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedMovie.posterUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900">{selectedMovie.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{selectedTheater.name} • {selectedTimeSlot.hallName} • {selectedSeats.join(', ')}</p>
                  </div>
                  <span className="text-sm font-extrabold text-[#E51937] block">{calculateTotalPrice().toLocaleString()}원</span>
                </div>
              </div>

              <button 
                onClick={() => alert("적용 가능한 할인쿠폰이 없습니다.")}
                className="w-full py-2.5 border border-gray-200 hover:border-gray-300 rounded-xl text-center text-xs font-bold text-gray-600 mt-4 flex items-center justify-between px-3 bg-gray-50 cursor-pointer"
              >
                <span>할인쿠폰을 선택해 주세요</span>
                <span>&rsaquo;</span>
              </button>
            </div>

            {/* 2. 멤버십/관람권/제휴 */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 text-left shadow-sm space-y-3">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">멤버십 / 관람권 / 제휴</h4>
              
              <button 
                onClick={() => alert("현재 보유하신 CGV 영화관람권이 없습니다.")}
                className="w-full py-3 border-b border-gray-100 hover:bg-gray-50 text-left text-xs font-bold text-gray-700 flex items-center justify-between px-1 cursor-pointer"
              >
                <span>CGV영화관람권 / 기프티콘</span>
                <span>&rsaquo;</span>
              </button>
              <button 
                onClick={() => alert("현재 보유하신 CGV 기간권이 없습니다.")}
                className="w-full py-3 hover:bg-gray-50 text-left text-xs font-bold text-gray-700 flex items-center justify-between px-1 cursor-pointer"
              >
                <span>CGV기간권 / 횟수권</span>
                <span>&rsaquo;</span>
              </button>

              <button 
                onClick={() => alert("멤버십 조회가 완료되었습니다.")}
                className="w-full py-3.5 border border-gray-200 hover:border-gray-300 rounded-xl text-center text-xs font-bold text-gray-500 flex items-center justify-center gap-1.5 px-3 bg-gray-50 mt-2 cursor-pointer"
              >
                🔍 적용 가능한 멤버십/관람권/제휴 확인
              </button>
            </div>

            {/* 3. 결제수단 선택 (결제창2.jpg) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 text-left shadow-sm">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-4">결제수단</h4>

              <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-4 text-xs font-semibold text-gray-500 bg-gray-50">
                <button className="flex-1 py-2 text-center bg-gray-100/50 cursor-pointer">CGV 스마트결제</button>
                <button className="flex-1 py-2 text-center bg-white text-gray-900 border-l border-gray-200 font-bold cursor-pointer">일반결제</button>
              </div>

              <div className="grid grid-cols-3 gap-1.5 mb-4">
                {[
                  { id: "card", name: "앱카드" },
                  { id: "phone", name: "휴대폰결제" },
                  { id: "bank", name: "내통장결제" },
                  { id: "naver", name: "N pay (네이버)" },
                  { id: "toss", name: "toss (토스)" },
                  { id: "kakao", name: "pay (카카오)" },
                  { id: "payco", name: "PAYCO" },
                  { id: "cj", name: "CJ PAY" }
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 text-[10px] font-extrabold rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === method.id
                        ? 'bg-[#E51937]/5 border-[#E51937] text-[#E51937]'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {method.name}
                  </button>
                ))}
              </div>

              {/* BC Card Selection & Warning details (결제창2.jpg) */}
              {paymentMethod === 'card' && (
                <div className="space-y-2.5 mb-4 animate-in fade-in duration-200">
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-between text-xs font-bold text-gray-700 cursor-pointer">
                    <span className="flex items-center gap-1.5">💳 BC카드</span>
                    <span>▼</span>
                  </div>
                  <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-between text-xs font-bold text-gray-700 cursor-pointer">
                    <span>페이북 / ISP</span>
                    <span>▼</span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-150 text-[10px] text-gray-500 space-y-1.5 leading-relaxed font-semibold">
                    <p className="flex items-start gap-1">
                      <span>•</span>
                      <span>ISP 결제는 임직원 카드 할인이 불가합니다. 일반결제나 PC를 이용하시기 바랍니다.</span>
                    </p>
                    <p className="flex items-start gap-1">
                      <span>•</span>
                      <span>ISP 결제 시 즉시할인은 적용되지 않습니다. 즉시할인 적용을 원하시는 경우 &ldquo;즉시할인&rdquo; 메뉴를 이용해주세요.</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Point section (결제창2.jpg / 결제창3.jpg) */}
              <div className="mt-4 border-t border-gray-100 pt-4 space-y-4">
                {/* CJ ONE Point */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="checkbox" 
                      id="cj-one-chk" 
                      className="rounded text-[#E51937] focus:ring-[#E51937]" 
                      disabled
                    />
                    <label htmlFor="cj-one-chk" className="text-gray-400 font-bold">CJ ONE 포인트</label>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded font-bold">포인트부족</span>
                    <span className="font-extrabold text-[#E51937] block">44P</span>
                  </div>
                </div>

                {/* CJ Gift Card */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="checkbox" 
                      id="cj-gift-chk" 
                      className="rounded text-[#E51937] focus:ring-[#E51937]" 
                      disabled
                    />
                    <label htmlFor="cj-gift-chk" className="text-gray-400 font-bold flex flex-col">
                      <span>CJ 기프트카드</span>
                      <span className="text-[9px] text-gray-300 font-medium mt-0.5">조회하기 &rsaquo;</span>
                    </label>
                  </div>
                  <div className="w-24 h-8 bg-gray-100 rounded-lg border border-gray-200" />
                </div>

                {/* CGV Gift Card */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="checkbox" 
                      id="cgv-gift-chk" 
                      className="rounded text-[#E51937] focus:ring-[#E51937]" 
                      disabled
                    />
                    <label htmlFor="cgv-gift-chk" className="text-gray-400 font-bold flex flex-col">
                      <span>CGV 기프트카드</span>
                      <span className="text-[9px] text-gray-300 font-medium mt-0.5">조회하기 &rsaquo;</span>
                    </label>
                  </div>
                  <div className="w-24 h-8 bg-gray-100 rounded-lg border border-gray-200" />
                </div>
              </div>
            </div>

            {/* 4. Terms and conditions (결제창3.jpg) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 text-left shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <input 
                  type="checkbox" 
                  id="agree-all" 
                  checked={isTermsAgreed}
                  onChange={(e) => setIsTermsAgreed(e.target.checked)}
                  className="w-4 h-4 rounded text-[#E51937] focus:ring-[#E51937] border-gray-300 cursor-pointer"
                />
                <label htmlFor="agree-all" className="text-xs font-black text-gray-800 cursor-pointer">
                  전체 약관 동의하기
                </label>
              </div>
              
              <p className="text-[10px] text-gray-400 leading-normal mt-2.5 px-0.5 text-left">
                주문상품 정보 결제 대행 서비스, 취소 및 환불 규정 안내에 대해 모두 동의합니다.
              </p>

              <div className="space-y-2.5 mt-4 text-[10px] font-bold text-gray-455">
                <div className="flex justify-between items-center cursor-pointer hover:text-gray-800 border-b border-gray-50 pb-2">
                  <span>이용 / 취소 / 환불 규정 안내</span>
                  <span>▼</span>
                </div>
                <div className="flex justify-between items-center cursor-pointer hover:text-gray-800">
                  <span>문화비 소득공제 안내</span>
                  <span>▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sticky Payment execute Button */}
          <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto w-full bg-[#F4F5F7] border-t border-gray-200 px-4 py-3 flex items-center justify-center z-40 select-none h-16 shadow-lg">
            <button
              disabled={!isTermsAgreed}
              onClick={handleFinalPayment}
              className={`w-full py-3.5 rounded-xl font-black text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                isTermsAgreed
                  ? 'bg-[#E51937] hover:bg-[#d1152f] text-white shadow-[#E51937]/20'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none border border-transparent'
              }`}
            >
              {calculateTotalPrice().toLocaleString()}원 결제하기
            </button>
          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* STEP 5: Booking Confirmation success ticket (티켓창.jpg) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeStep === 5 && latestBooking && (
        <div className="flex flex-col bg-[#F4F5F7] p-4 flex-1 animate-in fade-in duration-300 items-center gap-5">
          <div className="w-11 h-11 rounded-full bg-green-50 border border-green-500 flex items-center justify-center mb-1">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div className="text-center">
            <h2 className="text-lg font-extrabold text-gray-900 leading-tight">예매가 완료되었습니다!</h2>
            <p className="text-[10px] text-gray-500 mt-1">모바일 티켓이 정상적으로 발권되었습니다.</p>
          </div>
          
          {/* Render success ticket */}
          <Ticket booking={latestBooking} />

          <div className="flex gap-3 mt-6">
            <button
              onClick={resetBookingFlow}
              className="px-6 py-2.5 rounded-xl border border-gray-300 hover:border-gray-400 bg-white text-gray-700 font-bold text-xs transition-colors shadow-sm focus:outline-none"
            >
              처음으로
            </button>
            <button
              onClick={() => {
                resetBookingFlow();
                router.push('/mypage');
              }}
              className="px-6 py-2.5 rounded-xl bg-[#E51937] hover:bg-[#d1152f] text-white font-extrabold text-xs transition-all shadow-md active:scale-95"
            >
              티켓 확인하러 가기
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
