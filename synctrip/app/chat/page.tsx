"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Menu, Search } from "lucide-react";
import { storage, UserProfile } from "@/lib/storage";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";

export default function ChatListPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "matching">("all");

  useEffect(() => {
    const prof = storage.getProfile();
    if (!prof) {
      router.push("/onboarding");
      return;
    }
    setProfile(prof);

    // PERSISTENCE FIXED: Removed the sessionStorage synctrip_chat_wiped clean slate code 
    // so that the user's chat history persists across pages and reloads.
    setRooms(storage.getChatRooms());

    const handleNewMessage = () => {
      setRooms(storage.getChatRooms());
    };

    window.addEventListener("synctrip_new_message", handleNewMessage);
    return () => {
      window.removeEventListener("synctrip_new_message", handleNewMessage);
    };
  }, [router]);

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleLeaveRoom = (roomId: string) => {
    if (window.confirm("정말 이 채팅방을 나가시겠습니까? 대화 기록이 모두 삭제됩니다.")) {
      storage.deleteChatRoom(roomId);
      setRooms(storage.getChatRooms());
    }
  };

  const calculateTimeAgo = (isoString: string) => {
    try {
      const now = new Date();
      const past = new Date(isoString);
      const diffMs = now.getTime() - past.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return "방금 전";
      if (diffMins < 60) return `${diffMins}분 전`;
      if (diffHours < 24) return `${diffHours}시간 전`;
      return `${diffDays}일 전`;
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
      {/* Header matching Reference Image layout */}
      <div className="px-5 py-4 bg-white flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">채팅</h1>
        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-gray-100 rounded-full transition">
            <Search className="w-6 h-6 text-gray-800" />
          </button>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <Menu className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>

      {/* Subtabs matching Reference Image */}
      <div className="px-5 pb-3 bg-white flex items-center gap-2 border-b border-gray-100">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-black transition ${
            activeTab === "all"
              ? "bg-[#111111] text-white"
              : "bg-gray-50 border border-gray-150 text-gray-500 hover:bg-gray-100"
          }`}
        >
          전체 {rooms.length}
        </button>
        <button
          onClick={() => setActiveTab("matching")}
          className={`px-4 py-1.5 rounded-full text-xs font-black transition ${
            activeTab === "matching"
              ? "bg-[#111111] text-white"
              : "bg-gray-50 border border-gray-150 text-gray-500 hover:bg-gray-100"
          }`}
        >
          동행 매칭 {rooms.length}
        </button>
      </div>

      {/* Chat Rooms List matching layout */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {rooms.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center space-y-3 mt-10">
            <MessageSquare className="w-10 h-10 text-gray-300" />
            <h3 className="font-bold text-gray-800 text-sm">개설된 대화방이 없습니다</h3>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
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
              className="px-5 py-4 flex items-start gap-3.5 hover:bg-gray-50 transition border-b border-gray-50 cursor-pointer"
            >
              {/* Partner Avatar */}
              <img
                src={room.partner?.avatar_url || "https://api.dicebear.com/7.x/adventurer/svg"}
                alt={room.partner?.name || "Partner"}
                className="w-12 h-12 rounded-full object-cover border border-gray-150 bg-gray-50 flex-shrink-0"
              />

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-black text-sm text-gray-900 truncate">{room.partner?.name}</span>
                  <span className="text-[9px] font-black bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                    동행 매칭
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 truncate font-semibold mb-2.5">
                  {room.lastMessage}
                </p>

                {/* Action button row */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLeaveRoom(room.id);
                  }}
                  className="text-xs text-gray-400 hover:text-rose-600 hover:underline font-bold transition"
                >
                  나가기
                </button>
              </div>

              {/* Time display */}
              <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap pt-1">
                {calculateTimeAgo(room.lastMessageTime)}
              </span>
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
