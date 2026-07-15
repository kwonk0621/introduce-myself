"use client";

import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message
  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: '안녕하세요! 🎬 CGV 영화 예매 도우미 **시네봇(CineBot)**입니다. 영화 정보, 상영 시간표, 요금 안내 등 무엇이든 물어보세요! 😊',
        time: timeStr
      }
    ]);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const userMessageText = inputText.trim();

    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: userMessageText,
      time: timeStr
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Prepare payload containing previous chat history
      const historyPayload = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      historyPayload.push({
        role: 'user',
        content: userMessageText
      });

      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyPayload })
      });

      const replyNow = new Date();
      const replyTimeStr = replyNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          role: 'assistant',
          content: data.reply,
          time: replyTimeStr
        }]);
      } else {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          role: 'assistant',
          content: data.error || '답변을 가져오는 도중 오류가 발생했습니다.',
          time: replyTimeStr
        }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const replyNow = new Date();
      const replyTimeStr = replyNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: 'assistant',
        content: '인터넷 연결이 불안정하거나 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        time: replyTimeStr
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. Floating Action Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute bottom-20 right-4 z-50 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none ${
          isOpen ? 'bg-gray-800 rotate-180' : 'bg-[#E51937] hover:bg-[#d1152f]'
        }`}
        title="시네봇 챗봇 열기"
      >
        {isOpen ? (
          // Close Icon
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Chat Agent Icon
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* 2. Chat Overlay Widget Panel */}
      {isOpen && (
        <div className="absolute bottom-32 right-4 z-50 w-[calc(100%-2rem)] max-w-[340px] h-[400px] bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#E51937] to-[#ff4760] p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <h3 className="text-xs font-black tracking-wide">CGV 시네봇</h3>
                <p className="text-[9px] text-red-100 font-semibold">AI 예매 도우미</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white opacity-85 hover:opacity-100 focus:outline-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
            {messages.map(msg => {
              const isAssistant = msg.role === 'assistant';
              
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    isAssistant ? 'self-start items-start' : 'self-end items-end'
                  }`}
                >
                  <span className="text-[9px] text-gray-400 font-bold mb-1 px-1">
                    {isAssistant ? '시네봇' : '나'}
                  </span>
                  
                  <div className="flex items-end gap-1">
                    {msg.role === 'user' && (
                      <span className="text-[8px] text-gray-400 font-medium mb-1 shrink-0">{msg.time}</span>
                    )}

                    <div
                      className={`p-3 rounded-2xl text-[11px] font-semibold leading-relaxed ${
                        isAssistant
                          ? 'bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm'
                          : 'bg-[#E51937] text-white rounded-tr-none shadow-sm'
                      }`}
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      {msg.content}
                    </div>

                    {isAssistant && (
                      <span className="text-[8px] text-gray-400 font-medium mb-1 shrink-0">{msg.time}</span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Loader Indicator */}
            {isLoading && (
              <div className="flex flex-col max-w-[85%] self-start items-start">
                <span className="text-[9px] text-gray-400 font-bold mb-1 px-1">시네봇</span>
                <div className="p-3 bg-white border border-gray-200 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Sticky Input Field */}
          <div className="p-2.5 bg-white border-t border-gray-100 shadow-lg">
            <form onSubmit={handleSend} className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="어떤 영화/시간대를 예약할까요?..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 focus:border-[#E51937] outline-none text-[11px] font-semibold px-3.5 py-2 rounded-full text-gray-900 placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-white transition-all shadow-md shrink-0 focus:outline-none ${
                  inputText.trim() && !isLoading
                    ? 'bg-[#E51937] hover:bg-[#d1152f] cursor-pointer'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                }`}
              >
                <svg className="w-3.5 h-3.5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
