"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, MessageCircle, Sparkles } from "lucide-react";
import { storage } from "@/lib/storage";

export default function IncomingChatListener() {
  const router = useRouter();
  const [notification, setNotification] = useState<{
    roomId: string;
    partnerName: string;
    partnerAvatar: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Sync with Supabase on mount
    if ((storage as any).syncWithSupabase) {
      (storage as any).syncWithSupabase();
    }

    // Check if the user is onboarded (profile exists)
    const profile = storage.getProfile();
    if (!profile) return;

    // Check if we have already scheduled or triggered the incoming chat in this tab session
    const scheduled = sessionStorage.getItem("synctrip_incoming_chat_scheduled");
    if (scheduled) {
      // Setup listener for custom events if another trigger fires
      const handleCustomIncoming = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail && customEvent.detail.incoming) {
          setNotification({
            roomId: customEvent.detail.roomId,
            partnerName: customEvent.detail.partnerName,
            partnerAvatar: customEvent.detail.partnerAvatar,
            message: customEvent.detail.message,
          });
        }
      };
      window.addEventListener("synctrip_new_message", handleCustomIncoming);
      return () => window.removeEventListener("synctrip_new_message", handleCustomIncoming);
    }

    sessionStorage.setItem("synctrip_incoming_chat_scheduled", "true");

    // Random delay between 15 seconds and 90 seconds (under 3 minutes!)
    const delay = Math.floor(Math.random() * 75000) + 15000;
    console.log(`Incoming chat request scheduled in ${delay / 1000}s`);

    const timer = setTimeout(() => {
      const result = storage.receiveIncomingChatRequest();
      if (result) {
        setNotification({
          roomId: result.roomId,
          partnerName: result.partner.name,
          partnerAvatar: result.partner.avatar_url,
          message: result.message,
        });
      }
    }, delay);

    // Setup listener in case triggered manually
    const handleCustomIncoming = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.incoming) {
        setNotification({
          roomId: customEvent.detail.roomId,
          partnerName: customEvent.detail.partnerName,
          partnerAvatar: customEvent.detail.partnerAvatar,
          message: customEvent.detail.message,
        });
      }
    };

    window.addEventListener("synctrip_new_message", handleCustomIncoming);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("synctrip_new_message", handleCustomIncoming);
    };
  }, []);

  if (!notification) return null;

  return (
    <div className="fixed top-4 inset-x-4 mx-auto max-w-sm z-[9999] bg-white border border-blue-100 rounded-3xl p-4 shadow-2xl flex flex-col gap-3 animate-fade-in-down">
      <div className="flex items-start gap-3">
        {/* Partner avatar */}
        <img
          src={notification.partnerAvatar}
          alt={notification.partnerName}
          className="w-11 h-11 rounded-full object-cover border border-gray-150 bg-gray-50 flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-black text-sm text-gray-900 truncate">{notification.partnerName}</span>
            <span className="inline-flex items-center gap-0.5 text-[8.5px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
              <Sparkles className="w-2 h-2 text-blue-500 fill-blue-500" /> 동행 신청
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate font-semibold leading-relaxed">
            "{notification.message}"
          </p>
        </div>

        {/* Close button */}
        <button 
          onClick={() => setNotification(null)}
          className="p-1 hover:bg-gray-100 rounded-full transition flex-shrink-0"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setNotification(null)}
          className="flex-1 py-2 bg-gray-50 border border-gray-150 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-100 transition active:scale-[0.98]"
        >
          나중에
        </button>
        <button
          onClick={() => {
            const rid = notification.roomId;
            setNotification(null);
            router.push(`/chat/${rid}`);
          }}
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition active:scale-[0.98] flex items-center justify-center gap-1 shadow-md shadow-blue-500/10"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-white text-white" /> 대화하기
        </button>
      </div>
    </div>
  );
}
