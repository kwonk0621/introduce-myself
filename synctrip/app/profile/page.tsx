"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, UserCheck, School, Award, Star, Mail, ShieldAlert,
  ArrowRight, ArrowLeft, ShieldCheck, RefreshCw, LogOut, ChevronRight, MoreVertical,
  Share2, Edit3, X, HelpCircle, Eye, EyeOff, Edit, Bell, Menu
} from "lucide-react";
import { storage, UserProfile, TravelPreferences } from "@/lib/storage";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<TravelPreferences | null>(null);
  
  // Tab states: "companion" (동행 프로필) | "matching" (매칭 프로필)
  const [activeTab, setActiveTab] = useState<"companion" | "matching">("companion");
  
  // Preview mode for matching profile
  const [previewMode, setPreviewMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Bottom sheets
  const [showMenuSheet, setShowMenuSheet] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Org Verification form state
  const [emailInput, setEmailInput] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [orgNameDetected, setOrgNameDetected] = useState("");

  useEffect(() => {
    const prof = storage.getProfile();
    const pref = storage.getPreferences();
    if (!prof) {
      router.push("/onboarding");
      return;
    }
    setProfile(prof);
    setPreferences(pref);
  }, [router]);

  if (!profile || !preferences) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Country code to flag helper
  const getFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      일본: "🇯🇵",
      이탈리아: "🇮🇹",
      프랑스: "🇫🇷",
      홍콩: "🇭🇰",
      미국: "🇺🇸",
      태국: "🇹🇭",
      스페인: "🇪🇸",
      베트남: "🇻🇳",
      영국: "🇬🇧",
      독일: "🇩🇪",
      한국: "🇰🇷",
      대한민국: "🇰🇷",
      대만: "🇹🇼",
      필리핀: "🇵🇭",
      캐나다: "🇨🇦",
      오스트리아: "🇦🇹",
      스위스: "🇨🇭",
      싱가포르: "🇸🇬"
    };
    return flags[country] || "📍";
  };

  // Handle Identity Verification
  const handleVerifyIdentity = () => {
    const updated = {
      ...profile,
      is_identity_verified: true,
      trust_score: Math.min(100, profile.trust_score + 10)
    };
    storage.saveProfile(updated);
    setProfile(updated);
    setShowIdentityModal(false);
  };

  // Handle Org Email Verification Send
  const handleSendVerifyEmail = () => {
    if (!emailInput.includes("@") || !emailInput.includes(".")) {
      alert("올바른 이메일 형식을 입력해 주세요.");
      return;
    }

    let detected = "직장/학교";
    const domain = emailInput.split("@")[1].toLowerCase();
    
    if (domain.includes("snu") || domain.includes("seoul.ac.kr")) detected = "서울대학교";
    else if (domain.includes("kaist")) detected = "KAIST";
    else if (domain.includes("yonsei")) detected = "연세대학교";
    else if (domain.includes("korea.ac.kr")) detected = "고려대학교";
    else if (domain.includes("naver")) detected = "네이버";
    else if (domain.includes("kakao")) detected = "카카오";
    else if (domain.includes("samsung")) detected = "삼성전자";
    else {
      detected = domain.split(".")[0].toUpperCase();
    }

    const mockCode = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedCode(mockCode);
    setOrgNameDetected(detected);
    setCodeSent(true);
  };

  // Handle Org Code Verification Submit
  const handleVerifyOrgCode = () => {
    if (codeInput === simulatedCode) {
      const updated = {
        ...profile,
        is_org_verified: true,
        org_name: orgNameDetected,
        trust_score: Math.min(100, profile.trust_score + 15)
      };
      storage.saveProfile(updated);
      setProfile(updated);
      setShowOrgModal(false);
      setCodeSent(false);
      setCodeInput("");
      setEmailInput("");
    } else {
      alert("인증코드가 올바르지 않습니다. 다시 확인해 주세요.");
    }
  };

  const handleEditRedirect = () => {
    setShowMenuSheet(false);
    router.push("/onboarding?edit=true");
  };

  return (
    <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
      
      {/* 1. Header with Tabs */}
      {!previewMode && (
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10 flex flex-col">
          {/* Unified Brand Header */}
          <div className="p-4 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Custom Brand Logo */}
              <svg className="w-8 h-8 text-primary" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2C8.28 2 2 8.28 2 16C2 23.72 8.28 30 16 30C23.72 30 30 23.72 30 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
                <path d="M28 10L12 17L18 20L21 26L28 10Z" fill="currentColor" />
              </svg>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SyncTrip</span>
            </div>
            <div className="flex items-center gap-3">
              {activeTab === "matching" && (
                <button
                  onClick={() => setShowMenuSheet(true)}
                  className="p-1.5 hover:bg-gray-50 rounded-full transition"
                >
                  <MoreVertical className="w-5.5 h-5.5 text-gray-700" />
                </button>
              )}
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

          {/* Sub Tabs Bar */}
          <div className="px-4 flex gap-4 border-t border-gray-50">
            <button 
              onClick={() => setActiveTab("companion")}
              className={`pb-3 pt-2.5 text-sm font-black relative transition ${
                activeTab === "companion" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              동행 프로필
              {activeTab === "companion" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gray-900 rounded-full"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("matching")}
              className={`pb-3 pt-2.5 text-sm font-black relative transition ${
                activeTab === "matching" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              매칭 프로필
              {activeTab === "matching" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gray-900 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        
        {/* A. COMPANION PROFILE TAB */}
        {activeTab === "companion" && !previewMode && (
          <div className="p-4 space-y-6">
            
            {/* User Avatar Card (Image Reference 1) */}
            <div className="flex items-center gap-4">
              <img 
                src={profile.avatar_url} 
                alt={profile.name} 
                className="w-16 h-16 rounded-full object-cover border border-gray-100 bg-gray-50 shadow-inner"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-extrabold text-base text-gray-800 truncate">{profile.name}</span>
                    {profile.is_identity_verified && (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 fill-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <span className="text-[10px] font-extrabold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    {profile.mbti ? profile.mbti : "MBTI"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-semibold">
                  {profile.age_group} · {profile.gender} · 한국
                </p>
              </div>
            </div>

            {/* Self Intro Text */}
            <p className="text-xs font-semibold text-gray-500 leading-relaxed bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              {profile.self_intro}
            </p>

            {/* Follower Stats Row */}
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div className="flex gap-3 text-xs font-bold text-gray-700">
                <span>팔로워 <span className="font-extrabold">0</span></span>
                <span className="text-gray-300">•</span>
                <span>팔로잉 <span className="font-extrabold">0</span></span>
              </div>
              <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100/50 cursor-pointer">
                0개의 동행 후기
              </span>
            </div>

            {/* Kakao & Trust Badges Row */}
            <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-300 rounded-full flex items-center justify-center font-black text-amber-900 text-sm">
                  카카오
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-800">본인인증 완료</h4>
                  <p className="text-[9px] text-gray-400">카카오톡 본인 신원 인증이 완료되었습니다.</p>
                </div>
              </div>
              <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
                ✓
              </span>
            </div>

            {/* Outlined Green Edit Button (Image Reference 1) */}
            <button 
              onClick={() => router.push("/onboarding?edit=true")}
              className="w-full py-3.5 border border-emerald-500 text-emerald-600 hover:bg-emerald-50 active:scale-[0.99] transition rounded-xl text-xs font-black flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" /> 프로필 수정
            </button>

            {/* Trust Center Sub-section (safety verification center kept for MVP spec) */}
            <div className="border-t border-gray-100 pt-5 space-y-3">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">안전인증 보증</h3>
              <div className="space-y-2">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <School className="w-4.5 h-4.5 text-blue-600" />
                    <span className="text-xs font-bold text-gray-700">학교 / 직장인 인증</span>
                  </div>
                  {profile.is_org_verified ? (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {profile.org_name}
                    </span>
                  ) : (
                    <button
                      onClick={() => setShowOrgModal(true)}
                      className="text-[10px] font-bold text-white bg-primary px-3 py-1 rounded-lg"
                    >
                      인증하기
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Feed Section */}
            <div className="space-y-3 pt-2">
              <div className="inline-block bg-gray-900 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full">
                피드 0
              </div>
              <div className="py-14 border border-dashed border-gray-100 rounded-2xl text-center">
                <p className="text-xs text-gray-400 font-bold">아직, 작성한 콘텐츠가 없어요.</p>
              </div>
            </div>
            {/* Spacer to prevent BottomNav clipping */}
            <div className="h-28 flex-shrink-0" />
          </div>
        )}

        {/* B. MATCHING PROFILE TAB */}
        {activeTab === "matching" && !previewMode && (
          <div className="p-4 space-y-6">
            
            {/* Quick Toggle Preview */}
            <button
              onClick={() => setPreviewMode(true)}
              className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] transition"
            >
              <Eye className="w-4 h-4" /> 매칭 프로필 미리보기
            </button>

            {/* 1. 가고 싶은 곳이 있어요 (Image Reference 2) */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">✈️ 가고 싶은 곳이 있어요</h3>
              <div className="flex flex-wrap gap-1.5">
                {preferences.travel_destinations.length === 0 ? (
                  <span className="text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                    설정되지 않음
                  </span>
                ) : (
                  preferences.travel_destinations.map(country => (
                    <span key={country} className="inline-flex items-center gap-1 text-xs font-extrabold bg-blue-50 border border-blue-100 text-blue-700 px-3.5 py-1.5 rounded-full">
                      <span className="text-sm">{getFlag(country)}</span> {country}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* 2. 나는 N개국 여행자 */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                🌍 나는 {preferences.visited_countries.length}개국 여행자
              </h3>
              <div className="flex flex-wrap gap-2">
                {preferences.visited_countries.length === 0 ? (
                  <span className="text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                    아직 다녀온 국가가 없습니다
                  </span>
                ) : (
                  preferences.visited_countries.map(country => (
                    <span key={country} className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-lg shadow-xs" title={country}>
                      {getFlag(country)}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* 3. 여행 계획 스타일은 */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">📝 여행 계획 스타일은</h3>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <h4 className="text-sm font-black text-gray-800 mb-1">{preferences.planning_style}</h4>
                <p className="text-[11px] text-gray-500 font-medium">
                  {preferences.planning_style === "초계획형" && "여행 전 일정표를 만들어두고, 맛집/동선/예산까지 정해요."}
                  {preferences.planning_style === "계획형" && "하루 단위로 오전/오후 핵심 일정을 정해두고 움직여요."}
                  {preferences.planning_style === "반반형" && "하루 단위로 큰 틀 1~2개만 잡고, 나머진 즉흥으로 정해요."}
                  {preferences.planning_style === "즉흥형" && "후보 리스트는 있지만, 현장 분위기 보고 골라요."}
                  {preferences.planning_style === "완전 즉흥형" && "거의 정하지 않고, 도착해서 오늘 뭐하지?부터 시작해요."}
                </p>
              </div>
            </div>

            {/* 4. 흡연 유무는 */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">🚬 흡연 유무는</h3>
              <span className="inline-block px-3.5 py-1.5 bg-gray-100 text-gray-700 text-xs font-extrabold rounded-xl border border-gray-200">
                {preferences.smoking}
              </span>
            </div>

            {/* 5. 음주 여부는 */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">🍺 음주 여부는</h3>
              <span className="inline-block px-3.5 py-1.5 bg-gray-100 text-gray-700 text-xs font-extrabold rounded-xl border border-gray-200">
                {preferences.drinking}
              </span>
            </div>

            {/* 6. 원하는 동행 연령대는 */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">👥 원하는 동행 연령대는</h3>
              <div className="flex flex-wrap gap-1.5">
                {preferences.companion_ages.map(age => (
                  <span key={age} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200">
                    {age}
                  </span>
                ))}
              </div>
            </div>

            {/* 7. MBTI */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">🌈 내 MBTI는</h3>
              <span className="inline-block px-4 py-1.5 bg-gray-50 text-gray-800 text-xs font-extrabold rounded-lg border border-gray-200">
                {profile.mbti}
              </span>
            </div>

            {/* 8. 구사 가능 언어 */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">📢 할 수 있는 언어는</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.languages.map(lang => (
                  <span key={lang} className="px-3.5 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* 9. 선호하는 여행지 테마 */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">🚋 선호하는 여행지는</h3>
              <div className="flex flex-wrap gap-1.5">
                {preferences.travel_destinations.map(dest => (
                  <span key={dest} className="px-3.5 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200">
                    {dest}
                  </span>
                ))}
              </div>
            </div>

            {/* 10. 추구하는 여행 타입 */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">✨ 추구하는 여행 타입은</h3>
              <div className="flex flex-wrap gap-1.5">
                {preferences.travel_types.map(type => (
                  <span key={type} className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-semibold rounded-lg">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* 11. 여행에서 중요한 것 2가지 */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">🔮 여행에서 중요한 것 2가지는</h3>
              <div className="flex flex-wrap gap-1.5">
                {preferences.important_factors.map(factor => (
                  <span key={factor} className="px-3.5 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 text-xs font-bold rounded-lg">
                    {factor}
                  </span>
                ))}
              </div>
            </div>

            {/* 12. 걸음 수 */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">👟 하루 최대 걸음 수는</h3>
              <span className="inline-block px-3.5 py-1.5 bg-gray-100 text-gray-700 text-xs font-extrabold rounded-xl border border-gray-200">
                {preferences.max_steps}
              </span>
            </div>

            {/* 13. 숙소 타입 */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">🏠 선호 숙소 타입은</h3>
              <div className="flex flex-wrap gap-1.5">
                {preferences.accommodation_types.map(acc => (
                  <span key={acc} className="px-3.5 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200">
                    {acc}
                  </span>
                ))}
              </div>
            </div>

            {/* Outlined Green Edit Button */}
            <button 
              onClick={() => router.push("/onboarding?edit=true")}
              className="w-full mt-6 py-3.5 border border-emerald-500 text-emerald-600 hover:bg-emerald-50 active:scale-[0.99] transition rounded-xl text-xs font-black flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" /> 프로필 수정
            </button>

            {/* Spacer to prevent BottomNav clipping */}
            <div className="h-28 flex-shrink-0" />
          </div>
        )}

        {/* C. PREVIEW MODE FOR MATCHING PROFILE (Image Reference 5) */}
        {previewMode && (
          <div className="absolute inset-0 bg-white z-40 flex flex-col overflow-y-auto no-scrollbar pb-24">
            
            {/* Top Segment indicators like Instagram stories */}
            <div className="px-4 pt-4 flex gap-1 z-10 bg-white">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
                    i === currentSlide ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                ></div>
              ))}
            </div>

            {/* Navigation inside preview */}
            <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-gray-50">
              <button 
                onClick={() => setPreviewMode(false)}
                className="text-xs font-black text-gray-500 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> 미리보기 종료
              </button>
              
              {/* Hide Matching dropdown */}
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full cursor-pointer">
                <span className="text-[10px] font-black">매칭 숨기기</span>
                <ChevronRight className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>

            {/* Mock Profile Card with image */}
            <div className="p-4 space-y-6">
              
              <div className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-md bg-slate-100">
                <img 
                  src={profile.avatar_url} 
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Float Badge overlay */}
                <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
                  대표 사진
                </div>

                <button 
                  onClick={handleEditRedirect}
                  className="absolute bottom-4 right-4 p-2 bg-white hover:bg-gray-50 rounded-full shadow-md text-gray-700 transition"
                >
                  <Edit className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Identity Row */}
              <div className="px-1.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <h2 className="text-xl font-black text-gray-900">{profile.name}</h2>
                  {profile.is_identity_verified && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500 font-semibold">
                  20대 초 · {profile.gender} · {profile.mbti}
                </p>
              </div>

              {/* Self Intro section */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-gray-400 flex items-center gap-1">
                  📝 자기소개
                </h4>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs font-semibold text-gray-700 leading-relaxed">
                  23세 {profile.gender}자입니다. <br />
                  같이 재밌게 여행다니실 분 찾고싶습니다!
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-2 border-t border-gray-50 pt-5">
                <h4 className="text-xs font-black text-gray-400 flex items-center gap-1">
                  🛫 지금 여행 상태는
                </h4>
                <div className="text-xs font-extrabold text-gray-800">
                  {preferences.travel_status}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Shared Menu bottom sheet modal (Image Reference 3) */}
      {showMenuSheet && (
        <div className="absolute inset-0 bg-black/60 z-40 flex flex-col justify-end">
          <div className="flex-1" onClick={() => setShowMenuSheet(false)}></div>
          
          <div className="bg-white rounded-t-3xl p-5 relative shadow-2xl flex flex-col space-y-4 animate-fade-in-up">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-2"></div>
            
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="font-extrabold text-sm text-gray-400">동행 프로필</span>
              <button 
                onClick={() => setShowMenuSheet(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <button 
              className="w-full py-4 text-left font-extrabold text-sm text-gray-700 hover:text-primary transition border-b border-gray-50/50 flex items-center justify-between"
              onClick={() => alert("링크가 복사되었습니다!")}
            >
              <span>프로필 공유</span>
              <Share2 className="w-4 h-4 text-gray-400" />
            </button>

            <button 
              onClick={handleEditRedirect}
              className="w-full py-4 text-left font-extrabold text-sm text-gray-700 hover:text-primary transition flex items-center justify-between"
            >
              <span>수정</span>
              <Edit3 className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* 2. School/Workplace Verification Mock Modal */}
      {showOrgModal && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <School className="w-6 h-6" />
              <h3 className="font-black text-lg text-gray-900">학교/직장 이메일 인증</h3>
            </div>

            <p className="text-xs text-gray-500">
              학교 혹은 직장 이메일을 입력하세요. 도메인(예: @snu.ac.kr, @naver.com)을 인식하여 뱃지가 부여됩니다.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400">인증용 이메일 주소</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    placeholder="example@naver.com"
                    disabled={codeSent}
                    className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-xs"
                  />
                  <button
                    onClick={handleSendVerifyEmail}
                    disabled={codeSent}
                    className="bg-primary hover:bg-primary-dark disabled:bg-gray-200 text-white font-bold text-xs px-3.5 py-3 rounded-xl transition"
                  >
                    메일발송
                  </button>
                </div>
              </div>

              {codeSent && (
                <div className="space-y-2 border-t border-gray-50 pt-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-2.5 text-[10px] text-blue-800 font-bold">
                    📧 [모의 메일 발송 완료] <br />
                    비밀 수신함 인증 번호: <span className="text-red-500 text-xs font-black">{simulatedCode}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400">인증 코드 입력</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={codeInput}
                        onChange={e => setCodeInput(e.target.value)}
                        placeholder="인증코드 4자리 입력"
                        className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-xs"
                      />
                      <button
                        onClick={handleVerifyOrgCode}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-3 rounded-xl transition"
                      >
                        인증완료
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { setShowOrgModal(false); setCodeSent(false); }}
                className="w-full py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 bg-white"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Navigation */}
      <BottomNav />

      {/* Sidebar Panel */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
}
