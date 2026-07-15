"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, Menu, Compass, Sparkles, CheckCircle2, ChevronRight, HelpCircle, 
  MapPin, UserCheck, School, Footprints, MessageSquare, ArrowRight, X,
  Home, MoreVertical, ArrowLeft
} from "lucide-react";
import { storage, UserProfile, TravelPreferences, MockUser } from "@/lib/storage";
import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<TravelPreferences | null>(null);
  const [mockUsers, setMockUsers] = useState<MockUser[]>([]);
  const [selectedMock, setSelectedMock] = useState<MockUser | null>(null);
  const [countryFilter, setCountryFilter] = useState("전체");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [openQnaIdx, setOpenQnaIdx] = useState<number | null>(null);

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
      싱가포르: "🇸🇬",
      몽골: "🇲🇳",
      이집트: "🇪🇬",
      이스라엘: "🇮🇱",
      호주: "🇦🇺"
    };
    return flags[country] || "📍";
  };

  const isWishCountryMatch = (country: string) => {
    if (!preferences) return false;
    return (preferences.wish_countries || []).includes(country) || (preferences.travel_destinations || []).includes(country);
  };

  const isVisitedCountryMatch = (country: string) => {
    if (!preferences) return false;
    return (preferences.visited_countries || []).includes(country);
  };

  const isPlanningMatch = (style: string) => {
    if (!preferences) return false;
    return preferences.planning_style === style;
  };

  const isSmokingMatch = (smoking: string) => {
    if (!preferences) return false;
    return preferences.smoking === smoking;
  };

  const isDrinkingMatch = (drinking: string) => {
    if (!preferences) return false;
    return preferences.drinking === drinking;
  };

  const isAgeMatch = (age: string) => {
    if (!preferences) return false;
    return (preferences.companion_ages || []).includes(age);
  };

  const isCompanionTypeMatch = (type: string) => {
    if (!preferences) return false;
    return (preferences.companion_types || []).includes(type);
  };

  const isMbtiMatch = (mbti: string) => {
    if (!profile) return false;
    return profile.mbti === mbti;
  };

  const isLanguageMatch = (lang: string) => {
    if (!profile) return false;
    return (profile.languages || []).includes(lang);
  };

  const isDestMatch = (dest: string) => {
    if (!preferences) return false;
    return (preferences.travel_destinations || []).includes(dest);
  };

  const isTravelTypeMatch = (type: string) => {
    if (!preferences) return false;
    return (preferences.travel_types || []).includes(type);
  };

  const isFactorMatch = (factor: string) => {
    if (!preferences) return false;
    return (preferences.important_factors || []).includes(factor);
  };

  const isStepsMatch = (steps: string) => {
    if (!preferences) return false;
    return preferences.max_steps === steps;
  };

  const isAccMatch = (acc: string) => {
    if (!preferences) return false;
    return (preferences.accommodation_types || []).includes(acc);
  };

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

  // 같은 MBTI의 동행
  const sameMbtiMatches = mockUsers.filter(user => {
    return user.profile.mbti === profile.mbti;
  });

  // 선호하는 여행지가 같아요
  const sameDestMatches = mockUsers.filter(user => {
    return user.preferences.travel_destinations.some(dest => preferences.travel_destinations.includes(dest));
  });

  // 여행 타입이 같아요
  const sameTravelTypeMatches = mockUsers.filter(user => {
    return user.preferences.travel_types.some(type => preferences.travel_types.includes(type));
  });

  const handleSayHi = (partnerId: string) => {
    storage.createMatchRequest(partnerId);
    const rooms = storage.getChatRooms();
    const existingRoom = rooms.find(r => r.partner?.id === partnerId);
    const roomId = existingRoom ? existingRoom.id : `room-${Date.now()}`;
    setSelectedMock(null);
    router.push(`/chat/${roomId}`);
  };

  const generateAiReport = (mock: MockUser) => {
    if (!profile || !preferences) return "";

    const userPref = preferences;
    const partnerPref = mock.preferences;

    let planningMatch = "";
    if (userPref.planning_style === partnerPref.planning_style) {
      planningMatch = `계획 스타일이 똑같이 '${userPref.planning_style}'이라서 동선이나 일정을 조율하기에 가장 완벽한 짝꿍입니다.`;
    } else {
      planningMatch = `계획 스타일은 '${partnerPref.planning_style}'(나의 스타일: '${userPref.planning_style}')로, 서로의 단점을 보완해줄 수 있는 상호보완적 관계입니다.`;
    }

    let activityMatch = "";
    if (userPref.max_steps === partnerPref.max_steps) {
      activityMatch = `하루 목표 활동량이 '${userPref.max_steps}'로 서로 같아, 지치거나 템포가 흐트러지지 않고 발맞춰 걸을 수 있습니다.`;
    } else {
      activityMatch = `하루 활동 템포는 '${partnerPref.max_steps}'보 수준으로, 서로의 체력과 휴식 시간을 적절히 배려하면 쾌적한 도보 여행이 가능합니다.`;
    }

    let styleMatch = "";
    const commonStyles = partnerPref.travel_types?.filter(x => userPref.travel_types?.includes(x)) || [];
    if (commonStyles.length > 0) {
      styleMatch = `두 분 모두 '${commonStyles.slice(0, 2).join(", ")}' 여행 스타일을 선호하여 관심 있는 명소나 일정을 공유하기에 매우 좋습니다.`;
    } else {
      styleMatch = `상대방은 '${partnerPref.travel_types?.slice(0, 2).join(", ")}' 취향을 가지고 있어 색다른 매력의 여행을 경험해볼 수 있습니다.`;
    }

    let habitMatch = "";
    if (userPref.smoking === partnerPref.smoking) {
      if (userPref.smoking === "비흡연") {
        habitMatch = `또한 두 분 모두 비흡연자여서 비흡연 공간 탐방 등에서 매우 높은 쾌적함을 공유할 것입니다.`;
      } else {
        habitMatch = `또한 흡연 성향이 유사하여 동선 이동 중에 어색함 없이 조율이 수월합니다.`;
      }
    } else {
      habitMatch = `또한 흡연 성향에 다소 차이(나: ${userPref.smoking}, 상대: ${partnerPref.smoking})가 있으므로 사전에 서로를 위한 가벼운 에티켓 조율이 필요합니다.`;
    }

    return `${planningMatch} ${activityMatch} ${styleMatch} ${habitMatch}`;
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
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-50 rounded-full transition"
          >
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
        <div 
          onClick={() => setShowGuide(true)}
          className="bg-blue-50 border border-blue-100/50 rounded-xl p-3.5 flex items-center justify-between shadow-sm cursor-pointer hover:bg-blue-100/50 transition"
        >
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

        {/* Same MBTI Matches (Image Reference 1) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-950 flex items-center gap-1.5">
              <span>🌈</span>
              같은 MBTI의 동행이에요
            </h2>
            <span className="text-[10px] font-bold text-gray-400 cursor-pointer hover:text-gray-600">더 보기</span>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
            {sameMbtiMatches.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 text-center w-full">
                <p className="text-xs text-gray-400">같은 MBTI인 동행이 아직 없습니다.</p>
              </div>
            ) : (
              sameMbtiMatches.map(user => {
                const companionTag = user.preferences.companion_types[0] || "전 일정";
                const destTag = user.preferences.travel_destinations[0] || "바다";
                return (
                  <div
                    key={user.profile.id}
                    onClick={() => setSelectedMock(user)}
                    className="flex-shrink-0 w-44 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:border-blue-200 transition cursor-pointer hover-card-trigger"
                  >
                    <div className="relative h-40 w-full bg-slate-50">
                      <img 
                        src={user.profile.avatar_url} 
                        alt={user.profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="font-black text-xs text-gray-900 truncate">{user.profile.name}</span>
                        {user.profile.is_identity_verified && (
                          <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-emerald-500 text-white rounded-full text-[8px] font-black">✓</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold mb-2">
                        {user.profile.age_group.split(" ")[0]} · {user.profile.gender} · {user.profile.mbti}
                      </p>
                      <div className="text-[11px] font-black text-emerald-500 truncate">
                        {companionTag} · {destTag}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Same Destination Matches (Image Reference 2) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-950 flex items-center gap-1.5">
              <span>📌</span>
              선호하는 여행지가 같아요
            </h2>
            <span className="text-[10px] font-bold text-gray-400 cursor-pointer hover:text-gray-600">더 보기</span>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
            {sameDestMatches.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 text-center w-full">
                <p className="text-xs text-gray-400">선호하는 여행지가 같은 동행이 아직 없습니다.</p>
              </div>
            ) : (
              sameDestMatches.map(user => {
                const companionTag = user.preferences.companion_types[0] || "전 일정";
                const overlaps = user.preferences.travel_destinations.filter(d => preferences.travel_destinations.includes(d));
                const destTag = overlaps.join(", ") || user.preferences.travel_destinations[0] || "바다";
                return (
                  <div
                    key={user.profile.id}
                    onClick={() => setSelectedMock(user)}
                    className="flex-shrink-0 w-44 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:border-blue-200 transition cursor-pointer hover-card-trigger"
                  >
                    <div className="relative h-40 w-full bg-slate-50">
                      <img 
                        src={user.profile.avatar_url} 
                        alt={user.profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="font-black text-xs text-gray-900 truncate">{user.profile.name}</span>
                        {user.profile.is_identity_verified && (
                          <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-emerald-500 text-white rounded-full text-[8px] font-black">✓</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold mb-2">
                        {user.profile.age_group.split(" ")[0]} · {user.profile.gender} · {user.profile.mbti}
                      </p>
                      <div className="text-[11px] font-black text-emerald-500 truncate">
                        {companionTag} · {destTag}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Same Travel Type Matches (Image Reference 3) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-950 flex items-center gap-1.5">
              <span>💎</span>
              여행 타입이 같아요
            </h2>
            <span className="text-[10px] font-bold text-gray-400 cursor-pointer hover:text-gray-600">더 보기</span>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
            {sameTravelTypeMatches.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 text-center w-full">
                <p className="text-xs text-gray-400">선호하는 여행 타입이 같은 동행이 아직 없습니다.</p>
              </div>
            ) : (
              sameTravelTypeMatches.map(user => {
                const companionTag = user.preferences.companion_types[0] || "전 일정";
                const overlaps = user.preferences.travel_types.filter(t => preferences.travel_types.includes(t));
                const typeTag = overlaps.slice(0, 2).join(" · ") || user.preferences.travel_types.slice(0, 2).join(" · ");
                return (
                  <div
                    key={user.profile.id}
                    onClick={() => setSelectedMock(user)}
                    className="flex-shrink-0 w-44 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:border-blue-200 transition cursor-pointer hover-card-trigger"
                  >
                    <div className="relative h-40 w-full bg-slate-50">
                      <img 
                        src={user.profile.avatar_url} 
                        alt={user.profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="font-black text-xs text-gray-900 truncate">{user.profile.name}</span>
                        {user.profile.is_identity_verified && (
                          <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-emerald-500 text-white rounded-full text-[8px] font-black">✓</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold mb-2">
                        {user.profile.age_group.split(" ")[0]} · {user.profile.gender} · {user.profile.mbti}
                      </p>
                      <div className="text-[11px] font-black text-emerald-500 truncate">
                        {companionTag} · {typeTag}
                      </div>
                    </div>
                  </div>
                );
              })
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
            {stepsMatches.map(user => {
              const companionTag = user.preferences.companion_types[0] || "전 일정";
              const stepText = `하루 ${user.preferences.max_steps.replace(" 이상", "")}`;
              return (
                <div
                  key={user.profile.id}
                  onClick={() => setSelectedMock(user)}
                  className="flex-shrink-0 w-44 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:border-blue-200 transition cursor-pointer hover-card-trigger"
                >
                  <div className="relative h-40 w-full bg-slate-50">
                    <img 
                      src={user.profile.avatar_url} 
                      alt={user.profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="font-black text-xs text-gray-900 truncate">{user.profile.name}</span>
                      {user.profile.is_identity_verified && (
                        <span className="inline-flex items-center justify-center w-3.5 h-3.5 bg-emerald-500 text-white rounded-full text-[8px] font-black">✓</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold mb-2">
                      {user.profile.age_group.split(" ")[0]} · {user.profile.gender} · {user.profile.mbti}
                    </p>
                    <div className="text-[11px] font-black text-emerald-500 truncate">
                      {companionTag} · {stepText}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spacer to prevent BottomNav clipping */}
        <div className="h-28 flex-shrink-0" />
      </div>

      {/* Bottom Sheet / Details Modal */}
      {selectedMock && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col overflow-hidden pb-4">
          {/* 1. Header Navigation Bar */}
          <div className="flex-shrink-0 bg-white border-b border-gray-100">
            <div className="h-12 px-4 flex items-center justify-between">
              {/* Left Icons */}
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedMock(null)} className="p-1 hover:bg-gray-100 rounded-full transition">
                  <ArrowLeft className="w-5.5 h-5.5 text-gray-700" />
                </button>
                <button onClick={() => setSelectedMock(null)} className="p-1 hover:bg-gray-100 rounded-full transition">
                  <Home className="w-5.5 h-5.5 text-gray-700" />
                </button>
              </div>
              {/* Right Icons */}
              <div className="flex items-center gap-3">
                <button className="p-1 hover:bg-gray-100 rounded-full transition">
                  <MoreVertical className="w-5.5 h-5.5 text-gray-700" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded-full transition">
                  <Menu className="w-5.5 h-5.5 text-gray-700" />
                </button>
              </div>
            </div>
            {/* Tabs */}
            <div className="px-4 py-2.5 flex gap-4 bg-white">
              <span className="text-gray-300 font-black text-sm cursor-pointer hover:text-gray-500 transition">기본 프로필</span>
              <span className="text-gray-900 font-black text-sm cursor-pointer border-b-2 border-gray-900 pb-1">동행 프로필</span>
            </div>
          </div>

          {/* 2. Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-6 no-scrollbar pb-28">
            
            {/* Active Badge */}
            <div className="flex justify-end">
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100/50">
                적극 참여중
              </span>
            </div>

            {/* Profile Card */}
            <div className="border border-gray-150 rounded-3xl p-4 shadow-sm bg-white">
              <div className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-gray-50 shadow-inner">
                <img 
                  src={selectedMock.profile.avatar_url} 
                  alt={selectedMock.profile.name}
                  className="w-full h-full object-cover"
                />
                {/* Story indicators */}
                <div className="absolute top-3 left-4 right-4 flex gap-1.5 z-10">
                  {[...Array(selectedMock.profile.name.length % 2 === 0 ? 4 : 3)].map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-[3px] flex-1 rounded-full ${idx === 0 ? "bg-emerald-500" : "bg-white/60"}`} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-base text-gray-900">{selectedMock.profile.name}</span>
                    {selectedMock.profile.is_identity_verified && (
                      <span className="inline-flex items-center justify-center w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-bold">✓</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-bold mt-1">
                    {selectedMock.profile.age_group} · {selectedMock.profile.gender} · {selectedMock.profile.mbti}
                  </div>
                </div>
                <button 
                  onClick={() => handleSayHi(selectedMock.profile.id)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full font-black text-xs flex items-center gap-1 shadow-sm active:scale-95 transition"
                >
                  👋 인사하기
                </button>
              </div>
            </div>

            {/* A. 자기소개 (Show only if self_intro is present) */}
            {selectedMock.profile.self_intro && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <span>📝</span> 자기소개
                </h4>
                <div className="bg-gray-50 rounded-2xl p-4 text-xs font-semibold text-gray-700 leading-relaxed border border-gray-100">
                  {selectedMock.profile.self_intro}
                </div>
              </div>
            )}

            {/* B. 지금 여행 상태는 */}
            <div className="space-y-1">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <span>🛫</span> 지금 여행 상태는
              </h4>
              <div className="text-sm font-black text-gray-800 border-b-2 border-gray-800 pb-1.5 inline-block">
                계획
              </div>
              <div className="mt-2.5">
                <span className="inline-block bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl px-4 py-2.5 text-xs font-black">
                  여행을 같이 계획하고 싶어요
                </span>
              </div>
            </div>

            {/* C. 가고 싶은 곳이 있어요 */}
            {selectedMock.preferences.wish_countries && selectedMock.preferences.wish_countries.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-amber-600/90 uppercase tracking-wider">
                  가고 싶은 곳이 있어요
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMock.preferences.wish_countries.map((country, idx) => {
                    const isMatch = isWishCountryMatch(country);
                    return (
                      <span 
                        key={country} 
                        className={`inline-flex items-center gap-1 text-xs font-black px-3.5 py-2 rounded-2xl border ${
                          isMatch
                            ? "border-yellow-300 bg-yellow-100 text-yellow-900 shadow-sm"
                            : idx === 0 
                            ? "border-amber-400 bg-amber-50/20 text-amber-900" 
                            : "border-gray-200 bg-white text-gray-800"
                        }`}
                      >
                        <span>{getFlag(country)}</span> {country}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* D. 나는 X개국 여행자 */}
            {selectedMock.preferences.visited_countries && selectedMock.preferences.visited_countries.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <span>🌏</span> 나는 {selectedMock.preferences.visited_countries.length}개국 여행자
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {selectedMock.preferences.visited_countries.map(country => {
                    const isMatch = isVisitedCountryMatch(country);
                    return (
                      <span 
                        key={country} 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm border ${
                          isMatch
                            ? "border-yellow-300 bg-yellow-100"
                            : "border-gray-200 bg-white"
                        }`}
                        title={country}
                      >
                        {getFlag(country)}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* E. 여행 계획 스타일은 */}
            {selectedMock.preferences.planning_style && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <span>📝</span> 여행 계획 스타일은
                </h4>
                <div className={`border rounded-2xl p-4 ${
                  isPlanningMatch(selectedMock.preferences.planning_style)
                    ? "border-yellow-300 bg-yellow-50/20"
                    : "border-amber-300 bg-amber-50/10"
                }`}>
                  <div className={`font-extrabold text-sm mb-1 ${
                    isPlanningMatch(selectedMock.preferences.planning_style)
                      ? "text-yellow-950 font-black"
                      : "text-amber-700"
                  }`}>
                    {selectedMock.preferences.planning_style}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold leading-normal">
                    {selectedMock.preferences.planning_style === "즉흥형" 
                      ? "후보 리스트는 있지만, 현장 분위기 보고 골라요."
                      : selectedMock.preferences.planning_style === "계획형"
                      ? "하루 단위로 오전/오후 핵심 일정을 정해두고 움직여요."
                      : selectedMock.preferences.planning_style === "반반형"
                      ? "하루 단위로 큰 틀 1~2개만 잡고, 나머진 즉흥으로 정해요."
                      : "즉흥적이되 큰 틀만 맞추어 이동해요."}
                  </div>
                </div>
              </div>
            )}

            {/* F. 흡연 유무는 */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <span>🚬</span> 흡연 유무는
              </h4>
              <span className={`inline-block px-4 py-2 border text-xs font-black rounded-xl ${
                isSmokingMatch(selectedMock.preferences.smoking)
                  ? "bg-yellow-100 border-yellow-300 text-yellow-900 font-extrabold"
                  : "bg-gray-50 border-gray-150 text-gray-800"
              }`}>
                {selectedMock.preferences.smoking}
              </span>
            </div>

            {/* G. 음주 여부는 */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <span>🍺</span> 음주 여부는
              </h4>
              <span className={`inline-block px-4 py-2 border text-xs font-black rounded-xl ${
                isDrinkingMatch(selectedMock.preferences.drinking)
                  ? "bg-yellow-100 border-yellow-300 text-yellow-900 font-extrabold"
                  : "bg-gray-50 border-gray-150 text-gray-800"
              }`}>
                {selectedMock.preferences.drinking}
              </span>
            </div>

            {/* H. 원하는 동행의 연령대는 */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <span>👥</span> 원하는 동행의 연령대는
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedMock.preferences.companion_ages.map(age => {
                  const isMatch = isAgeMatch(age);
                  return (
                    <span 
                      key={age} 
                      className={`px-4 py-2 border text-xs font-black rounded-xl ${
                        isMatch
                          ? "bg-yellow-100 border-yellow-300 text-yellow-900 font-extrabold"
                          : "bg-gray-50 border-gray-150 text-gray-800"
                      }`}
                    >
                      {age}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* I. 내가 찾고 있는 동행은 */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <span>👀</span> 내가 찾고 있는 동행은
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedMock.preferences.companion_types.map(type => {
                  const isMatch = isCompanionTypeMatch(type);
                  return (
                    <span 
                      key={type} 
                      className={`px-4 py-2 text-xs font-black rounded-xl border ${
                        isMatch
                          ? "bg-yellow-100 border-yellow-300 text-yellow-900 font-extrabold"
                          : type === "전 일정" 
                          ? "border-amber-400 bg-amber-50/20 text-amber-900"
                          : "border-gray-150 bg-gray-50 text-gray-800"
                      }`}
                    >
                      {type}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* J. 내 MBTI는 */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <span>🌈</span> 내 MBTI는
              </h4>
              <span className={`inline-block px-4 py-2 border text-xs font-black rounded-xl ${
                isMbtiMatch(selectedMock.profile.mbti)
                  ? "bg-yellow-100 border-yellow-300 text-yellow-900 font-extrabold"
                  : "bg-gray-50 border-gray-150 text-gray-800"
              }`}>
                {selectedMock.profile.mbti}
              </span>
            </div>

            {/* K. 할 수 있는 언어는 */}
            {selectedMock.profile.languages && selectedMock.profile.languages.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <span>📢</span> 할 수 있는 언어는
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMock.profile.languages.map(lang => {
                    const isMatch = isLanguageMatch(lang);
                    return (
                      <span 
                        key={lang} 
                        className={`px-4 py-2 border text-xs font-black rounded-xl ${
                          isMatch
                            ? "bg-yellow-100 border-yellow-300 text-yellow-900 font-extrabold"
                            : "bg-gray-50 border-gray-150 text-gray-800"
                        }`}
                      >
                        {lang}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* L. 선호하는 여행지는 */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <span>🚊</span> 선호하는 여행지는
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedMock.preferences.travel_destinations.map(dest => {
                  const isMatch = isDestMatch(dest);
                  return (
                    <span 
                      key={dest} 
                      className={`px-4 py-2 border text-xs font-black rounded-xl ${
                        isMatch
                          ? "bg-yellow-100 border-yellow-300 text-yellow-900 font-extrabold"
                          : "bg-gray-50 border-gray-150 text-gray-800"
                      }`}
                    >
                      {dest}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* M. 추구하는 여행 타입은 */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <span>✨</span> 추구하는 여행 타입은
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedMock.preferences.travel_types.map(type => {
                  const isMatch = isTravelTypeMatch(type);
                  return (
                    <span 
                      key={type} 
                      className={`px-3.5 py-2 border text-xs font-bold rounded-xl ${
                        isMatch
                          ? "bg-yellow-100 border-yellow-300 text-yellow-900 font-extrabold"
                          : "bg-gray-50 border-gray-150 text-gray-750"
                      }`}
                    >
                      {type}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* N. 여행에서 중요한 것 2가지는 */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <span>🔮</span> 여행에서 중요한 것 2가지는
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedMock.preferences.important_factors.map((factor, idx) => {
                  const isMatch = isFactorMatch(factor);
                  return (
                    <span 
                      key={factor} 
                      className={`px-4 py-2 border text-xs font-black rounded-xl ${
                        isMatch
                          ? "bg-yellow-100 border-yellow-300 text-yellow-900 font-extrabold"
                          : idx === 0 
                          ? "bg-amber-50 border-amber-250 text-amber-700" 
                          : "bg-purple-50 border-purple-250 text-purple-700"
                      }`}
                    >
                      {factor}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* O. 하루 최대 걸음 수는 */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <span>👟</span> 하루 최대 걸음 수는
              </h4>
              <span className={`inline-block px-4 py-2 border text-xs font-black rounded-xl ${
                isStepsMatch(selectedMock.preferences.max_steps)
                  ? "bg-yellow-100 border-yellow-300 text-yellow-900 font-extrabold"
                  : "bg-gray-50 border-gray-150 text-gray-800"
              }`}>
                {selectedMock.preferences.max_steps}
              </span>
            </div>

            {/* P. 선호 숙소 타입은 */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <span>🏠</span> 선호 숙소 타입은
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedMock.preferences.accommodation_types.map(acc => {
                  const isMatch = isAccMatch(acc);
                  return (
                    <span 
                      key={acc} 
                      className={`px-4 py-2 border text-xs font-black rounded-xl ${
                        isMatch
                          ? "bg-yellow-100 border-yellow-300 text-yellow-900 font-extrabold"
                          : "bg-gray-50 border-gray-150 text-gray-800"
                      }`}
                    >
                      {acc}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* AI Propensity Report Summary */}
            <div className="border-t border-gray-100 pt-5">
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/20 border border-blue-100/50 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-blue-600 fill-blue-500" />
                  <h4 className="text-sm font-black text-blue-900">AI 성향 진단서</h4>
                </div>
                <p className="text-xs font-bold text-indigo-700 bg-indigo-50/50 inline-block px-2.5 py-0.5 rounded-full mb-2">
                  페르소나: {selectedMock.preferences.ai_summary}
                </p>
                <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                  {generateAiReport(selectedMock)}
                </p>
              </div>
            </div>
            
          </div>

          {/* Sticky Floating Greeting Button at bottom right */}
          <button 
            onClick={() => handleSayHi(selectedMock.profile.id)}
            className="absolute bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition text-white px-5 py-3.5 rounded-full font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25"
          >
            👋 인사하기
          </button>
        </div>
      )}

      {/* Shared Navigation */}
      <BottomNav />

      {/* Sidebar Panel */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* AI Matching Guide Bottom Sheet */}
      {showGuide && (
        <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div className="flex-1" onClick={() => setShowGuide(false)}></div>
          
          {/* Content Sheet */}
          <div className="bg-white rounded-t-3xl max-h-[85%] overflow-y-auto p-6 relative shadow-2xl flex flex-col no-scrollbar">
            <button 
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5.5 h-5.5 text-gray-400" />
            </button>

            {/* Header */}
            <div className="mb-6 mt-2">
              <span className="text-[9px] font-black text-primary bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">AI Guide</span>
              <h3 className="text-lg font-black text-gray-900 mt-2">AI 동행 매칭 시스템 안내</h3>
              <p className="text-xs text-gray-400 font-semibold mt-1">SyncTrip의 AI가 최적의 버디를 찾아내는 원리를 안내합니다.</p>
            </div>

            {/* Q&A Accordion List */}
            <div className="space-y-3.5">
              {[
                {
                  q: "AI 매칭 점수(일치율)는 어떻게 계산되나요?",
                  a: "SyncTrip AI 매칭 엔진은 회원님의 여행 계획성(초계획형~즉흥형), 라이프스타일(음주/흡연), 선호 숙소 타입, 하루 최대 걸음 수, 가고 싶은 여행지 테마 등의 선호도를 다각도로 비교 분석합니다. 라이프스타일 일치 여부와 여행 계획 스타일의 조화도에 따라 가중치가 부여되어 % 점수로 환산됩니다."
                },
                {
                  q: "신뢰도 점수(Trust Score)는 무엇인가요?",
                  a: "신뢰도 점수는 안전한 동행을 보장하기 위한 자체 등급 제도입니다. 기본 카카오 신원인증 시 80점의 기본 점수를 획득하며, 소속 학교나 직장 이메일 인증을 통과하면 신뢰 배지와 함께 가산점을 얻습니다. 매칭 신뢰 배지가 높은 회원일수록 피드에서 우선 추천됩니다."
                },
                {
                  q: "계획 스타일이 다른 동행과 만나도 괜찮을까요?",
                  a: "완벽히 동일한 성향 매칭 외에도, 서로의 성격을 보완해 줄 수 있는 E/I 성격 조화 매칭 등을 다양하게 제공합니다. 계획을 세세히 세우는 파트너와 즉흥적으로 즐기는 파트너가 상호 조율하여 더욱 균형 잡힌 여행을 설계하도록 돕는 유연한 엔진을 탑재하고 있습니다."
                },
                {
                  q: "AI 성향 분석 요약(AI Summary)은 어떻게 생성되나요?",
                  a: "프로필 설정 및 온보딩 설문 제출 시, Google Gemini 2.5 Flash 모델이 회원님의 모든 라이프스타일과 성향 키워드를 복합적으로 진단하여 고유한 페르소나 타이틀(예: '알프스의 푸른 숨결을 찾는 여유주의자')과 정밀 성향 진단 분석서를 즉석에서 생성합니다."
                }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-4 transition-all hover:bg-gray-100/55 cursor-pointer"
                  onClick={() => setOpenQnaIdx(openQnaIdx === idx ? null : idx)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black text-gray-800 leading-snug flex-1">
                      <span className="text-primary mr-1.5">Q.</span>{item.q}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      openQnaIdx === idx ? "rotate-90 text-primary" : ""
                    }`} />
                  </div>
                  {openQnaIdx === idx && (
                    <div className="mt-3 pt-3 border-t border-gray-200/50 text-[11px] leading-relaxed text-gray-500 font-semibold animate-fadeIn">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer action */}
            <button
              onClick={() => setShowGuide(false)}
              className="mt-8 w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/10 active:scale-[0.99] transition"
            >
              안내 확인 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
