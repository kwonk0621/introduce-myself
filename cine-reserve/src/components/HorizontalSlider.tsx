"use client";

import React, { useRef } from 'react';

interface HorizontalSliderProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'cyan' | 'pink';
}

const HorizontalSlider: React.FC<HorizontalSliderProps> = ({ 
  children, 
  title, 
  subtitle,
  badge,
  badgeColor = 'cyan'
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  const badgeStyles = badgeColor === 'pink' 
    ? 'bg-pink-500/10 text-pink-400 border-pink-500/30' 
    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';

  return (
    <div className="relative group/slider my-8 select-none">
      {/* Title Header */}
      <div className="flex items-end justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{title}</h2>
            {badge && (
              <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeStyles}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs sm:text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
        
        {/* Navigation Buttons (Desktop only show on hover, or always show simplified) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full bg-gray-800/80 hover:bg-cyan-500 hover:text-black text-gray-400 border border-gray-700 hover:border-transparent transition-all duration-200"
            aria-label="이전 영화 보기"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full bg-gray-800/80 hover:bg-cyan-500 hover:text-black text-gray-400 border border-gray-700 hover:border-transparent transition-all duration-200"
            aria-label="다음 영화 보기"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-none px-4 sm:px-6 lg:px-8 py-2 scroll-smooth snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {children}
      </div>
      
      {/* Decorative side fades for high-end feel */}
      <div className="absolute left-0 top-12 bottom-0 w-8 bg-gradient-to-r from-[#0B0F19] to-transparent pointer-events-none z-10 hidden sm:block" />
      <div className="absolute right-0 top-12 bottom-0 w-8 bg-gradient-to-l from-[#0B0F19] to-transparent pointer-events-none z-10 hidden sm:block" />
    </div>
  );
};

export default HorizontalSlider;
