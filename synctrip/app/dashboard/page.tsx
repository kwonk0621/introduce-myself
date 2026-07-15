"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, Menu, Compass, Sparkles, CheckCircle2, ChevronRight, HelpCircle, 
  MapPin, UserCheck, School, Footprints, MessageSquare, ArrowRight, X 
} from "lucide-react";
import { storage, UserProfile, TravelPreferences, MockUser } from "@/lib/storage";
import BottomNav from "@/components/BottomNav";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<TravelPreferences | null>(null);
  const [mockUsers, setMockUsers] = useState<MockUser[]>([]);
  const [selectedMock, setSelectedMock] = useState<MockUser | null>(null);
  const [countryFilter, setCountryFilter] = useState("전체");

  // Load data
  useEffect(() => {
    const prof = storage.getProfile();
    const pref = storage.getPreferences();
    if (!prof || !pref) {
      router.push("/onboarding");
      return;
    }
    setProfile(prof);
    setPreferences(pref);
    setMockUsers(storage.getMockUsersWithScores());
  }, [router]);

  if (!profile || !preferences) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Country filters
  const countries = ["전체", "일본", "프랑스", "홍콩", "이탈리아"];

  // Filtered mock users for "둘 다 여행하고 싶어요"
  const travelMatches = mockUsers.filter(user => {
    if (countryFilter === "전체") return true;
    return user.preferences.visited_countries.includes(countryFilter);
  });

  // MBTI chemistry matching (opposite E/I, same J/P etc.)
  const mbtiMatches = mockUsers.filter(user => {
    const myE = profile.mbti[0] === "E";
    const otherE = user.profile.mbti[0] === "E";
    return myE !== otherE; // E-I match
  });

  // Age group matches
  const ageMatches = mockUsers.filter(user => {
    return preferences.companion_ages.some(age => user.profile.age_group.includes(age.slice(0, 3)));
  });

  // Steps matches
  const stepsMatches = mockUsers.filter(user => {
    return user.preferences.max_steps === preferences.max_steps;
  });

  const handleSayHi = (partnerId: string) => {
    storage.createMatchRequest(partnerId);
    const rooms = storage.getChatRooms();
    const existingRoom = rooms.find(r => r.partner?.id === partnerId);
    const roomId = existingRoom ? existingRoom.id : `room-${Date.now()}`;
    setSelectedMock(null);
    router.push(`/chat/${roomId}`);
  };

  // Find the highest match for today's match card
  const todayMatch = mockUsers[0];

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
          <button className="p-2 hover:bg-gray-50 rounded-full transition">
            <Menu className="w-5.5 h-5.5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-6 no-scrollbar">
        {/* Welcome Message */}
        <div className="mb-2 px-1">
          <span className="text-[9px] font-black text-primary bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">WELCOME BACK</span>
          <h2 className="text-xl font-black text-gray-900 mt-1.5 flex items-center gap-1.5">
            모험가, <span className="text-primary">{profile.name}</span>님! 👋
          </h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">오늘도 어울리는 여행 버디를 찾아볼까요?</p>
        </div>
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100/50 rounded-xl p-3.5 flex items-center justify-between shadow-sm cursor-pointer hover:bg-blue-100/50 transition">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🤖</span>
            <div>
              <p className="text-xs font-bold text-blue-900">AI 매칭은 어떻게 결정되나요?</p>
              <p className="text-[10px] text-blue-700/80">온보딩 설문과 성향을 분석해 최적의 동행을 추천해요.</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-600" />
        </div>

        {/* 1. 오늘의 동행 (Today's Top Recommendation) */}
        {todayMatch && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-gray-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                오늘의 추천 동행
              </h2>
              <span className="text-[10px] font-bold text-gray-400 flex items-center gap-0.5 cursor-pointer">
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            </div>

            <div 
              onClick={() => setSelectedMock(todayMatch)}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-blue-200 transition cursor-pointer hover-card-trigger"
            >
              <img 
                src={todayMatch.profile.avatar_url} 
                alt={todayMatch.profile.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-50 shadow-inner bg-gray-50"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-gray-800">{todayMatch.profile.name}</span>
                    {todayMatch.profile.is_identity_verified && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                    )}
                  </div>
                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    매칭률 {(todayMatch as any).matchScore || 85}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium mb-1.5">{todayMatch.profile.age_group} · {todayMatch.profile.mbti}</p>
                <div className="inline-block bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
                  <p className="text-[10px] text-gray-600 font-semibold">
                    📝 {todayMatch.preferences.companion_types?.join(", ")} 동행 구하고 있어요!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. 둘 다 여행을 하고 싶어요 (Country Filtered List) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-950 flex items-center gap-1.5">
              <span>🌍</span>
              둘 다 여행을 하고 싶어요
            </h2>
            <span className="text-[10px] font-bold text-gray-400 cursor-pointer hover:text-gray-600">더 보기</span>
          </div>

          {/* Country Selection Chips */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {countries.map(country => (
              <button
                key={country}
                onClick={() => setCountryFilter(country)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                  countryFilter === country
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {country === "일본" && "🇯🇵 "}
                {country === "프랑스" && "🇫🇷 "}
                {country === "홍콩" && "🇭🇰 "}
                {country === "이탈리아" && "🇮🇹 "}
                {country}
              </button>
            ))}
          </div>

          {/* Companion Horizontal Scroll Cards */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
            {travelMatches.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center w-full">
                <p className="text-xs text-gray-400">선택하신 국가의 매칭 동행이 아직 없습니다.</p>
              </div>
            ) : (
              travelMatches.map(user => (
                <div
                  key={user.profile.id}
                  onClick={() => setSelectedMock(user)}
                  className="flex-shrink-0 w-44 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:border-blue-200 transition cursor-pointer hover-card-trigger"
                >
                  <div className="relative h-28 w-full bg-slate-100">
                    <img 
                      src={user.profile.avatar_url} 
                      alt={user.profile.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full text-[9px] font-bold text-white">
                      여행 미정
                    </div>
                    <div className="absolute bottom-2 right-2 bg-blue-600 px-2 py-0.5 rounded-full text-[10px] font-black text-white shadow-sm">
                      {(user as any).matchScore || 75}%
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-bold text-xs text-gray-800 truncate">{user.profile.name}</span>
                      {user.profile.is_identity_verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium mb-2">{user.profile.age_group} · {user.profile.mbti}</p>
                    <div className="flex flex-wrap gap-1">
                      {user.preferences.companion_types.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] font-bold bg-gray-50 border border-gray-100 text-gray-600 px-1.5 py-0.5 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. E와 I, 우리는 환상의 짝꿍! (Personality chemistry) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-950 flex items-center gap-1.5">
              <span>🙌</span>
              E와 I, 우리는 환상의 짝꿍!
            </h2>
            <span className="text-[10px] font-bold text-gray-400 cursor-pointer hover:text-gray-600">더 보기</span>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
            {mbtiMatches.map(user => (
              <div
                key={user.profile.id}
                onClick={() => setSelectedMock(user)}
                className="flex-shrink-0 w-40 bg-white border border-gray-100 rounded-2xl p-3 flex flex-col items-center text-center shadow-sm hover:border-blue-200 transition cursor-pointer hover-card-trigger"
              >
                <img 
                  src={user.profile.avatar_url} 
                  alt={user.profile.name}
                  className="w-12 h-12 rounded-full border border-gray-100 mb-2 object-cover bg-gray-50"
                />
                <div className="flex items-center gap-0.5 justify-center mb-0.5">
                  <span className="font-bold text-xs text-gray-800">{user.profile.name}</span>
                  {user.profile.is_identity_verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-gray-500 font-medium mb-2">{user.profile.age_group} · <span className="text-blue-600 font-bold">{user.profile.mbti}</span></p>
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded-full">
                  성향 합 {(user as any).matchScore || 70}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 선호하는 연령대의 동행이에요 (Age compatible) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-950 flex items-center gap-1.5">
              <span>👥</span>
              선호하는 연령대의 동행이에요
            </h2>
            <span className="text-[10px] font-bold text-gray-400 cursor-pointer hover:text-gray-600">더 보기</span>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
            {ageMatches.map(user => (
              <div
                key={user.profile.id}
                onClick={() => setSelectedMock(user)}
                className="flex-shrink-0 w-44 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:border-blue-200 transition cursor-pointer hover-card-trigger"
              >
                <div className="relative h-24 w-full bg-slate-100">
                  <img 
                    src={user.profile.avatar_url} 
                    alt={user.profile.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-blue-600 px-2 py-0.5 rounded-full text-[10px] font-black text-white shadow-sm">
                    {(user as any).matchScore || 75}%
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-bold text-xs text-gray-800 truncate">{user.profile.name}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold">{user.profile.age_group} · {user.profile.mbti}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. 활동량이 비슷한 동행이에요 (Steps compatibility) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-950 flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-blue-600" />
              활동량이 비슷한 동행이에요
            </h2>
            <span className="text-[10px] font-bold text-gray-400 cursor-pointer hover:text-gray-600">더 보기</span>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
            {stepsMatches.map(user => (
              <div
                key={user.profile.id}
                onClick={() => setSelectedMock(user)}
                className="flex-shrink-0 w-40 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm hover:border-blue-200 transition cursor-pointer hover-card-trigger flex flex-col items-center"
              >
                <img 
                  src={user.profile.avatar_url} 
                  alt={user.profile.name}
                  className="w-12 h-12 rounded-full border border-gray-100 mb-2 object-cover bg-gray-50"
                />
                <span className="font-bold text-xs text-gray-800 mb-0.5">{user.profile.name}</span>
                <p className="text-[9px] text-gray-400 mb-1.5">하루 {user.preferences.max_steps}보</p>
                <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  일치율 {(user as any).matchScore || 70}%
                </span>
              </div>
            ))}
        </div>
      </div>
      {/* Spacer to prevent BottomNav clipping */}
      <div className="h-28 flex-shrink-0" />
    </div>

      {/* Bottom Sheet / Details Modal */}
      {selectedMock && (
        <div className="absolute inset-0 bg-black/60 z-40 flex flex-col justify-end">
          {/* Backdrop Click */}
          <div className="flex-1" onClick={() => setSelectedMock(null)}></div>
          
          {/* Content Sheet */}
          <div className="bg-white rounded-t-3xl max-h-[85%] overflow-y-auto p-5 relative shadow-2xl flex flex-col no-scrollbar">
            <button 
              onClick={() => setSelectedMock(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5.5 h-5.5 text-gray-400" />
            </button>

            {/* Profile Info */}
            <div className="flex items-center gap-4 mb-5 mt-2">
              <img 
                src={selectedMock.profile.avatar_url} 
                alt={selectedMock.profile.name}
                className="w-16 h-16 rounded-full object-cover border border-gray-100 shadow-sm bg-gray-50"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-lg text-gray-900">{selectedMock.profile.name}</h3>
                  {selectedMock.profile.is_identity_verified && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500 font-semibold mb-1">
                  {selectedMock.profile.gender} · {selectedMock.profile.age_group} · MBTI: {selectedMock.profile.mbti}
                </p>
                
                {/* Badges */}
                <div className="flex gap-1.5">
                  {selectedMock.profile.is_identity_verified && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                      <UserCheck className="w-3 h-3" /> 본인인증
                    </span>
                  )}
                  {selectedMock.profile.is_org_verified && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                      <School className="w-3 h-3" /> {selectedMock.profile.org_name} 인증
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Trust Meter */}
            <div className="mb-6 bg-gray-50 rounded-2xl p-3.5 border border-gray-100/50">
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                <span>동행 매칭 적합도</span>
                <span className="text-primary font-black">{(selectedMock as any).matchScore || 85}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(selectedMock as any).matchScore || 85}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-5 flex-1">
              {/* Introduction */}
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">소개글</h4>
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  {selectedMock.profile.self_intro}
                </p>
              </div>

              {/* Spoken Languages */}
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">구사 가능 언어</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMock.profile.languages.map(lang => (
                    <span key={lang} className="text-xs font-bold px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Travel Preferences Tag Grid */}
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2.5">여행 스타일 태그</h4>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                    💡 {selectedMock.preferences.planning_style}
                  </span>
                  <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                    🚬 {selectedMock.preferences.smoking}
                  </span>
                  <span className="text-xs font-bold px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
                    🍺 {selectedMock.preferences.drinking}
                  </span>
                  <span className="text-xs font-bold px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg border border-purple-100">
                    👣 하루 {selectedMock.preferences.max_steps}보
                  </span>
                  {selectedMock.preferences.accommodation_types.map(acc => (
                    <span key={acc} className="text-xs font-semibold px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-200">
                      🏠 {acc}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Propensity Report Summary */}
              <div className="border-t border-gray-100 pt-5">
                <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/20 border border-blue-100/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-blue-600 fill-blue-500" />
                    <h4 className="text-sm font-black text-blue-900">AI 성향 진단서</h4>
                  </div>
                  <p className="text-xs font-bold text-indigo-700 bg-indigo-50/50 inline-block px-2.5 py-0.5 rounded-full mb-2">
                    페르소나: {selectedMock.preferences.ai_summary}
                  </p>
                  <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                    상대방은 나와 계획 성향이 일치하고, 흡연 유무 조율이 부드러운 편이며, 여행지 선호도가 적절히 맞닿아 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Say Hi Button */}
            <div className="mt-8">
              <button
                onClick={() => handleSayHi(selectedMock.profile.id)}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-dark active:scale-[0.99] transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
              >
                <span>👋 인사하고 동행 대화 시작하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Navigation */}
      <BottomNav />
    </div>
  );
}
