"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Movie } from '@/data/mockMovies';
import { useBooking } from '@/context/BookingContext';

interface MovieCardProps {
  movie: Movie;
  onMouseEnter?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onMouseEnter }) => {
  const router = useRouter();
  const { selectMovie } = useBooking();

  const handleBooking = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectMovie(movie);
    router.push('/booking');
  };

  const handleDetail = () => {
    router.push(`/movie/${movie.id}`);
  };

  const isUpcoming = movie.status === 'upcoming';

  return (
    <div 
      onClick={handleDetail}
      onMouseEnter={onMouseEnter}
      className="flex-shrink-0 w-[180px] sm:w-[220px] md:w-[240px] snap-start group cursor-pointer bg-[#121829]/40 border border-gray-800 hover:border-cyan-500/40 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-cyan-500/10 flex flex-col"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Hover Overlay with actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
          <button
            onClick={handleDetail}
            className="w-full py-2 rounded-lg bg-gray-800/90 hover:bg-gray-700 text-white font-medium text-xs sm:text-sm border border-gray-700 transition-colors shadow-lg"
          >
            상세 정보
          </button>
          
          {!isUpcoming ? (
            <button
              onClick={handleBooking}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              바로 예매
            </button>
          ) : (
            <div className="w-full py-2 text-center rounded-lg bg-pink-500/20 border border-pink-500/40 text-pink-400 font-semibold text-xs sm:text-sm">
              상영 예정작
            </div>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-gray-800 text-[10px] sm:text-xs text-yellow-400 font-semibold flex items-center gap-1">
          <span>★</span>
          <span>{movie.rating}</span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          {isUpcoming ? (
            <span className="px-2 py-0.5 rounded-md bg-pink-500/90 text-white text-[10px] font-bold uppercase tracking-wider">
              D-Day
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/90 text-black text-[10px] font-bold uppercase tracking-wider">
              Now
            </span>
          )}
        </div>
      </div>

      {/* Info Container */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-cyan-400 transition-colors">
            {movie.title}
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">{movie.englishTitle}</p>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 border border-gray-800 rounded px-1.5 py-0.5 bg-gray-900/50">
            {movie.genre[0]}
          </span>
          <span className="text-[10px] text-gray-400">{movie.runtime}분</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
