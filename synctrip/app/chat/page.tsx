"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, ArrowRight, CheckCircle2, ChevronRight, Bell, Menu } from "lucide-react";
import { storage, UserProfile } from "@/lib/storage";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";

export default function ChatListPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const prof = storage.getProfile();
    if (!prof) {
      router.push("/onboarding");
      return;
    }
    setProfile(prof);

    // Wipe out all chat rooms and messages ONCE for this session as requested to give a clean slate
    if (typeof window !== "undefined" && !sessionStorage.getItem("synctrip_chat_wiped")) {
      localStorage.removeItem("synctrip_chat_rooms");
      localStorage.removeItem("synctrip_chat_messages");
      sessionStorage.setItem("synctrip_chat_wiped", "true");
    }

    setRooms(storage.getChatRooms());
  }, [router]);

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Format timestamp nicely
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const hours = date.getHours().toString().padStart(2, "0");
      const mins = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${mins}`;
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 relative overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          {/* Custom Brand Logo */}
          <svg className="w-8 h-8 text-primary" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C8.28 2 2 8.28 2 16C2 23.72 8.28 30 16 30C23.72 30 30 23.72 30 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
            <path d="M28 10L12 17L18 20L21 26L28 10Z" fill="currentColor" />
          </svg>
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SyncTrip</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-50 rounded-full relative transition">
            <Bell className="w-5.5 h-5.5 text-gray-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-50 rounded-full transition"
          >
            <Menu className="w-5.5 h-5.5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Chat Rooms List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
        {/* Page Title Header */}
        <div className="mb-4 px-1">
          <span className="text-[9px] font-black text-primary bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">MESSAGES</span>
          <h2 className="text-xl font-black text-gray-900 mt-1.5">실시간 대화방 목록</h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">대화중인 여행 메이트들을 한 눈에 확인하세요.</p>
        </div>
        {rooms.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
            <MessageSquare className="w-10 h-10 text-gray-300" />
            <h3 className="font-bold text-gray-800 text-sm">개설된 대화방이 없습니다</h3>
            <p className="text-xs text-gray-400 max-w-xs">
              매칭 피드에서 마음에 드는 여행 버디의 프로필을 확인하고 '👋 인사하기'를 눌러 보세요.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-dark transition active:scale-[0.98]"
            >
              추천 피드 보러 가기
            </button>
          </div>
        ) : (
          rooms.map(room => (
            <div
              key={room.id}
              onClick={() => router.push(`/chat/${room.id}`)}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs hover:border-blue-200 transition cursor-pointer hover-card-trigger"
            >
              {/* Partner Avatar */}
              <img
                src={room.partner?.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg"}
                alt={room.partner?.name || "Partner"}
                className="w-12 h-12 rounded-full object-cover border border-gray-50 bg-gray-50"
              />

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="font-bold text-sm text-gray-800 truncate">{room.partner?.name}</span>
                    {room.partner?.is_identity_verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold">
                    {formatTime(room.lastMessageTime)}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 truncate font-medium">
                  {room.lastMessage}
                </p>
              </div>

              {/* Arrow Indicator */}
              <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
            </div>
          ))
        )}
        {/* Spacer to prevent BottomNav clipping */}
        <div className="h-28 flex-shrink-0" />
      </div>

      {/* Shared Navigation */}
      <BottomNav />

      {/* Sidebar Panel */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
}
