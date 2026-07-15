"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Send, CheckCircle2, School, UserCheck, Heart, LogOut } from "lucide-react";
import { storage, UserProfile } from "@/lib/storage";

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [partner, setPartner] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load profile and partner details
  useEffect(() => {
    const prof = storage.getProfile();
    if (!prof) {
      router.push("/onboarding");
      return;
    }
    setProfile(prof);

    // Get room details to identify partner
    const rooms = storage.getChatRooms();
    const room = rooms.find(r => r.id === roomId);
    if (!room) {
      router.push("/chat");
      return;
    }
    setPartner(room.partner);
    setMessages(storage.getChatMessages(roomId));
  }, [roomId, router]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen to mock real-time message events
  useEffect(() => {
    const handleNewMessage = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.roomId === roomId) {
        setMessages(storage.getChatMessages(roomId));
      }
    };

    window.addEventListener("synctrip_new_message", handleNewMessage);
    return () => {
      window.removeEventListener("synctrip_new_message", handleNewMessage);
    };
  }, [roomId]);

  if (!profile || !partner) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    storage.sendChatMessage(roomId, inputText);
    setMessages(storage.getChatMessages(roomId));
    setInputText("");
  };

  const handleLeaveRoom = () => {
    if (window.confirm("정말 이 채팅방을 나가시겠습니까? 대화 기록이 모두 삭제됩니다.")) {
      storage.deleteChatRoom(roomId);
      router.push("/chat");
    }
  };

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
    <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="p-3.5 flex items-center gap-3">
          <button
            onClick={() => router.push("/chat")}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <img
            src={partner.avatar_url}
            alt={partner.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-100"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm text-gray-900 truncate">{partner.name}</span>
              {partner.is_identity_verified && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              )}
            </div>
            <p className="text-[10px] text-gray-400 font-semibold">
              {partner.age_group} · MBTI: {partner.mbti} · 신뢰도 {partner.trust_score}점
            </p>
          </div>

          <button
            onClick={handleLeaveRoom}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition active:scale-95"
            title="채팅방 나가기"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>나가기</span>
          </button>
        </div>

        {/* Quick Partner Badges Row */}
        <div className="px-4 py-1.5 bg-gray-50 border-t border-gray-50 flex gap-2 overflow-x-auto no-scrollbar">
          {partner.is_identity_verified && (
            <span className="inline-flex items-center gap-0.5 text-[8.5px] font-bold bg-white text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
              <UserCheck className="w-2.5 h-2.5" /> 본인인증
            </span>
          )}
          {partner.is_org_verified && (
            <span className="inline-flex items-center gap-0.5 text-[8.5px] font-bold bg-white text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
              <School className="w-2.5 h-2.5" /> {partner.org_name}
            </span>
          )}
          <span className="inline-flex items-center gap-0.5 text-[8.5px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100 ml-auto">
            <Heart className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> 성향 추천 매칭
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 no-scrollbar">
        
        {/* System Message */}
        <div className="text-center py-2">
          <span className="inline-block text-[9px] font-bold text-gray-400 bg-gray-200/50 px-3 py-1 rounded-full border border-gray-100">
            🛡️ 본 대화방은 신뢰 등급 인증을 거친 동행 간의 대화방입니다.
          </span>
        </div>

        {messages.map(msg => {
          const isMe = msg.sender_id === profile.id;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-1.5 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {/* Profile image for partner */}
              {!isMe && (
                <img
                  src={partner.avatar_url}
                  alt={partner.name}
                  className="w-7 h-7 rounded-full object-cover border border-gray-100 self-start mt-0.5"
                />
              )}

              <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                {/* Partner Nickname inside chat */}
                {!isMe && (
                  <span className="text-[10px] text-gray-400 font-bold mb-1 ml-1">{partner.name}</span>
                )}
                
                <div
                  className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                    isMe
                      ? "bg-primary text-white rounded-tr-none shadow-xs"
                      : "bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-xs"
                  }`}
                >
                  {msg.message}
                </div>
              </div>

              {/* Message Time */}
              <span className="text-[8px] font-bold text-gray-400 mb-0.5 flex-shrink-0">
                {formatTime(msg.created_at)}
              </span>
            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Footer Panel */}
      <form
        onSubmit={handleSend}
        className="absolute bottom-0 inset-x-0 p-3 bg-white border-t border-gray-100 flex gap-2 z-10 items-center"
      >
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-3.5 border border-gray-100 bg-gray-50 rounded-2xl focus:outline-none focus:border-primary text-xs font-semibold"
        />
        <button
          type="submit"
          className="p-3.5 bg-primary text-white rounded-2xl hover:bg-primary-dark active:scale-[0.98] transition flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
