import React from "react";
import { useRouter } from "next/navigation";
import { 
  X, Home, MessageSquare, User, ShieldCheck, RefreshCw, 
  LogOut, ChevronRight, Star
} from "lucide-react";
import { storage } from "@/lib/storage";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  
  if (!isOpen) return null;

  const profile = storage.getProfile();
  const pref = storage.getPreferences();

  const handleReset = () => {
    if (confirm("모든 채팅 및 온보딩 데이터를 초기화하시겠습니까?")) {
      storage.resetAllData();
      onClose();
      window.location.href = "/onboarding";
    }
  };

  const handleLogout = () => {
    storage.resetAllData();
    onClose();
    router.push("/onboarding");
  };

  const handleMenuClick = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div className="absolute inset-0 z-50 flex overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      {/* Sidebar Sheet */}
      <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col z-10 animate-slideLeft">
        
        {/* Top Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <svg className="w-6 h-6 text-primary" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C8.28 2 2 8.28 2 16C2 23.72 8.28 30 16 30C23.72 30 30 23.72 30 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
              <path d="M28 10L12 17L18 20L21 26L28 10Z" fill="currentColor" />
            </svg>
            <span className="font-black text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SyncMenu</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Card */}
        {profile && (
          <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 border-b border-blue-100/35">
            <div className="flex items-center gap-3.5 mb-4">
              <img 
                src={profile.avatar_url} 
                alt={profile.name} 
                className="w-12 h-12 rounded-full object-cover border border-white shadow-sm bg-white"
              />
              <div className="min-w-0">
                <h4 className="font-extrabold text-sm text-gray-900 truncate">{profile.name}님</h4>
                <p className="text-[10px] text-gray-400 font-bold">신뢰도: <span className="text-primary">{profile.trust_score}점</span></p>
              </div>
            </div>
            
            {pref?.ai_summary && (
              <div className="bg-white border border-blue-100/50 rounded-xl px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                   onClick={() => handleMenuClick("/profile")}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs">🤖</span>
                  <span className="text-[10px] font-black text-gray-700 truncate">{pref.ai_summary}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </div>
            )}
          </div>
        )}

        {/* Menu Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-2">메뉴</span>
            {[
              { label: "동행 매칭 홈", path: "/dashboard", icon: Home },
              { label: "실시간 대화방", path: "/chat", icon: MessageSquare },
              { label: "내 모험 (프로필)", path: "/profile", icon: User },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleMenuClick(item.path)}
                  className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition text-left text-xs font-black"
                >
                  <Icon className="w-4.5 h-4.5 text-gray-500" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider px-2">보안 & 인증</span>
            {[
              { label: "안전 신원 인증", path: "/profile", icon: ShieldCheck },
              { label: "학교/직장 이메일 인증", path: "/profile", icon: Star },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleMenuClick(item.path)}
                  className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition text-left text-xs font-black"
                >
                  <Icon className="w-4.5 h-4.5 text-gray-500" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-black active:scale-[0.99] transition"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" /> 데모 데이터 전체 초기화
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100/50 text-xs font-black active:scale-[0.99] transition"
          >
            <LogOut className="w-4 h-4 text-red-500" /> 로그아웃 (온보딩으로)
          </button>
        </div>
      </div>
    </div>
  );
}
