"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';
import { mockMovies } from '@/data/mockMovies';
import { db, ChatMessage } from '@/lib/db';

export default function CineTalkPage() {
  const router = useRouter();
  const { user } = useBooking();
  const [selectedMovieId, setSelectedMovieId] = useState("hope");
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeMovie = mockMovies.find(m => m.id === selectedMovieId) || mockMovies[0];

  // Load chat messages and subscribe to real-time additions
  useEffect(() => {
    const loadInitialChats = async () => {
      try {
        const history = await db.getChats(selectedMovieId);
        setChats(history);
      } catch (err) {
        console.error("Failed to load initial chats:", err);
      }
    };

    loadInitialChats();

    // Subscribe to realtime updates
    const unsubscribe = db.subscribeChats(selectedMovieId, (newChat) => {
      setChats(prev => {
        if (prev.some(c => c.id === newChat.id)) return prev;
        return [...prev, newChat];
      });
    });

    return () => {
      unsubscribe();
    };
  }, [selectedMovieId]);

  // Scroll chat window to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const username = user?.name || "용감한납득이5754";
      const newChat = await db.sendChat(selectedMovieId, username, inputText.trim());
      
      // Append manually for instant update if not received by real-time immediately
      setChats(prev => {
        if (prev.some(c => c.id === newChat.id)) return prev;
        return [...prev, newChat];
      });
      setInputText("");
    } catch (err) {
      console.error("Failed to send chat message", err);
    }
  };

  return (
    <div className="flex-1 bg-[#F4F5F7] text-gray-900 pb-20 w-full select-none flex flex-col min-h-screen">
      
      {/* 1. Header of CineTalk */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 flex items-center justify-between">
        <h2 className="text-base font-black text-gray-900 flex items-center gap-1">
          <span>💬 씨네톡</span>
        </h2>
        <span className="text-[10px] bg-red-100 text-red-500 font-extrabold px-2.5 py-0.5 rounded-full">
          실시간 피드
        </span>
      </div>

      {/* 2. Horizontal Movie Selector Tab Bar */}
      <div className="bg-white px-3 py-3 border-b border-gray-100 flex items-center gap-2 overflow-x-auto scrollbar-none w-full">
        {mockMovies.filter(m => m.status === 'now-showing').map(movie => {
          const isSelected = selectedMovieId === movie.id;
          return (
            <button
              key={movie.id}
              onClick={() => setSelectedMovieId(movie.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isSelected ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {movie.title}
            </button>
          );
        })}
      </div>

      {/* 3. Movie summary bar */}
      <div className="bg-white px-4 py-2 border-b border-gray-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-gray-700">{activeMovie.title}</span>
          <span className="text-gray-400">장르: {activeMovie.genre[0]}</span>
        </div>
        <span className="text-gray-400 text-[10px]">예매율 {activeMovie.reservationRate}%</span>
      </div>

      {/* 4. Chat room body scroll stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col bg-gray-50">
        {chats.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400 font-semibold">
            첫 메시지를 입력하여 시네톡에 참여해보세요!
          </div>
        ) : (
          chats.map(chat => {
            const isMe = chat.username === user?.name;
            
            return (
              <div 
                key={chat.id} 
                className={`flex flex-col max-w-[80%] ${
                  isMe ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                {/* Nickname */}
                <span className="text-[10px] text-gray-400 font-bold mb-1 px-1">{chat.username}</span>
                
                {/* Message block with time */}
                <div className="flex items-end gap-1.5">
                  {isMe && <span className="text-[8px] text-gray-400 font-medium shrink-0 mb-1">{chat.time}</span>}
                  
                  <div 
                    className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                      isMe 
                        ? 'bg-[#E51937] text-white rounded-tr-none shadow-sm' 
                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm'
                    }`}
                  >
                    {chat.text}
                  </div>

                  {!isMe && <span className="text-[8px] text-gray-400 font-medium shrink-0 mb-1">{chat.time}</span>}
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* 5. Sticky Bottom Text Input Box */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto w-full z-40 bg-white border-t border-gray-150 p-2 flex items-center justify-between shadow-lg">
        <form onSubmit={handleSend} className="w-full flex items-center gap-2">
          <input
            type="text"
            placeholder={`${activeMovie.title} 영화에 대해 대화해보세요...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-200 focus:border-[#E51937] outline-none text-xs font-medium px-4 py-2.5 rounded-full text-gray-900 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all shadow-md shrink-0 focus:outline-none ${
              inputText.trim() 
                ? 'bg-[#E51937] hover:bg-[#d1152f] cursor-pointer' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>

    </div>
  );
}
