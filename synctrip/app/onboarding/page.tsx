"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ArrowLeft, Check, Plus, X } from "lucide-react";
import { storage, UserProfile, TravelPreferences } from "@/lib/storage";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  // Step 1: Profile Info
  const [name, setName] = useState("");
  const [gender, setGender] = useState("남자");
  const [ageGroup, setAgeGroup] = useState("20대 중반");
  const [mbti, setMbti] = useState("ENFP");
  const [selfIntro, setSelfIntro] = useState("");
  const [languages, setLanguages] = useState<string[]>(["한국어"]);
  const [newLanguage, setNewLanguage] = useState("");

  // Step 2: Lifestyle
  const [travelStatus, setTravelStatus] = useState("여행이 예정되어있어요");
  const [smoking, setSmoking] = useState("비흡연");
  const [drinking, setDrinking] = useState("사회적 음주");
  const [companionAges, setCompanionAges] = useState<string[]>([]);
  const [companionTypes, setCompanionTypes] = useState<string[]>([]);

  // Step 3: Travel Style
  const [planningStyle, setPlanningStyle] = useState("반반형");
  const [visitedCountries, setVisitedCountries] = useState<string[]>([]);
  const [newCountry, setNewCountry] = useState("");
  const [importantFactors, setImportantFactors] = useState<string[]>([]);
  const [maxSteps, setMaxSteps] = useState("10,000 ~ 15,000");
  const [accommodationTypes, setAccommodationTypes] = useState<string[]>([]);
  const [travelDestinations, setTravelDestinations] = useState<string[]>([]);
  const [travelTypes, setTravelTypes] = useState<string[]>([]);

  // Check if profile exists, redirect if it does (unless they want to reset/edit)
  useEffect(() => {
    const profile = storage.getProfile();
    const pref = storage.getPreferences();
    const isEdit = typeof window !== "undefined" && window.location.search.includes("edit=true");
    
    if (profile && !isEdit) {
      router.push("/dashboard");
      return;
    }

    if (profile && isEdit) {
      setName(profile.name);
      setGender(profile.gender);
      setAgeGroup(profile.age_group);
      setMbti(profile.mbti);
      setSelfIntro(profile.self_intro);
      setLanguages(profile.languages);
      
      if (pref) {
        setTravelStatus(pref.travel_status);
        setSmoking(pref.smoking);
        setDrinking(pref.drinking);
        setCompanionAges(pref.companion_ages);
        setCompanionTypes(pref.companion_types);
        setPlanningStyle(pref.planning_style);
        setVisitedCountries(pref.visited_countries);
        setImportantFactors(pref.important_factors);
        setMaxSteps(pref.max_steps);
        setAccommodationTypes(pref.accommodation_types);
        setTravelDestinations(pref.travel_destinations);
        setTravelTypes(pref.travel_types);
      }
    }
  }, [router]);

  // Options lists
  const smokingOptions = ["비흡연", "흡연 (연초)", "흡연 (전자담배)", "음주 시", "다른 흡연자가 있을 때만", "흡연에 자유로운 나라를 갈 때만"];
  const drinkingOptions = ["마시지 않음", "가끔 마심", "사회적 음주", "즐겨 마심"];
  const companionAgeOptions = ["20대 초", "20대 중후반", "30대 초", "30대 중후반", "40대 초", "40대 중후반", "50대 이상"];
  const companionTypeOptions = ["전 일정", "식사", "카페", "사진", "투어", "부분"];
  
  const planningStyleOptions = [
    { label: "초계획형", desc: "여행 전 일정표를 만들어두고, 맛집/동선/예산까지 정해요." },
    { label: "계획형", desc: "하루 단위로 오전/오후 핵심 일정을 정해두고 움직여요." },
    { label: "반반형", desc: "하루 단위로 큰 틀 1~2개만 잡고, 나머진 즉흥으로 정해요." },
    { label: "즉흥형", desc: "후보 리스트는 있지만, 현장 분위기 보고 골라요." },
    { label: "완전 즉흥형", desc: "거의 정하지 않고, 도착해서 오늘 뭐하지?부터 시작해요." }
  ];
  
  const factorOptions = ["좋은 숙소", "맛있는 음식", "활동적인 경험", "멋진 사진", "휴식", "일정의 여유로움"];
  const stepOptions = ["0 ~ 5,000", "5,000 ~ 10,000", "10,000 ~ 15,000", "15,000 ~ 20,000", "20,000 이상"];
  const accommodationOptions = ["호텔", "호스텔(게스트 하우스)", "비즈니스 호텔 / 모텔", "에어비앤비"];
  const destinationOptions = ["산", "바다", "도시", "시골", "소도시"];
  const travelTypeOptions = ["액티비티", "정적인", "많이 돌아다니는", "페스티벌", "투어", "랜드마크", "관광", "휴양", "카페", "스파", "미식 여행", "쇼핑", "박물관", "갤러리"];

  const handleToggle = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, limit?: number) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      if (limit && list.length >= limit) return;
      setList([...list, item]);
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage]);
      setNewLanguage("");
    }
  };

  const handleAddCountry = () => {
    if (newCountry && !visitedCountries.includes(newCountry)) {
      setVisitedCountries([...visitedCountries, newCountry]);
      setNewCountry("");
    }
  };

  const handleComplete = async () => {
    if (!name.trim()) {
      alert("이름을 입력해 주세요!");
      setStep(1);
      return;
    }

    setLoading(true);

    const userProfile: UserProfile = {
      id: `user-1-${Date.now()}`,
      name,
      avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      gender,
      age_group: ageGroup,
      mbti: mbti.toUpperCase(),
      self_intro: selfIntro || "반갑습니다! 함께 즐거운 여행을 계획하고 싶어요.",
      languages,
      trust_score: 80,
      is_identity_verified: false,
      is_org_verified: false
    };

    const userPref: TravelPreferences = {
      travel_status: travelStatus,
      smoking,
      drinking,
      companion_ages: companionAges,
      companion_types: companionTypes,
      planning_style: planningStyle,
      visited_countries: visitedCountries,
      important_factors: importantFactors,
      max_steps: maxSteps,
      accommodation_types: accommodationTypes,
      travel_destinations: travelDestinations,
      travel_types: travelTypes
    };

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userProfile.name,
          gender: userProfile.gender,
          age_group: userProfile.age_group,
          mbti: userProfile.mbti,
          preferences: userPref
        })
      });

      if (response.ok) {
        const aiResult = await response.json();
        userPref.ai_summary = aiResult.character;
        userPref.ai_details = {
          character: aiResult.character,
          description: aiResult.description,
          tips: aiResult.tips
        };
      }
    } catch (e) {
      console.error("AI Analysis failed, saving default profiles", e);
      userPref.ai_summary = "자유로운 탐험가";
    }

    storage.saveProfile(userProfile);
    storage.savePreferences(userPref);
    
    // Seed code disabled to provide a clean slate for chats
    // storage.createChatRoom("user-2");
    // storage.createChatRoom("user-3");

    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1800); // smooth loading simulation
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          <Sparkles className="w-8 h-8 text-primary animate-pulse mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">여행 성향 분석 중</h2>
          <p className="text-sm text-gray-500 max-w-xs">
            AI가 입력하신 정보를 바탕으로 여행 성향 리포트와 매칭 점수를 계산하고 있습니다...
          </p>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : router.push("/")}
          className="p-1 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <span className="font-extrabold text-base text-gray-900">
          {step === 1 ? "기본 정보" : step === 2 ? "라이프 스타일" : "여행 스타일"}
        </span>
        <div className="w-8"></div>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        
        {/* Step 1: 기본 정보 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">기본 정보를 입력해 주세요</h3>
              <p className="text-xs text-gray-500">동행들이 나를 알아볼 수 있도록 이름을 정해 주세요.</p>
            </div>

            {/* 이름 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">닉네임 / 이름 *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="예: 단호한윌리64"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
              />
            </div>

            {/* 성별 & 연령대 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">성별</label>
                <div className="grid grid-cols-2 gap-2">
                  {["남자", "여자"].map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`p-3 text-sm rounded-xl border font-medium transition ${
                        gender === g
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">연령대</label>
                <select
                  value={ageGroup}
                  onChange={e => setAgeGroup(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm bg-white"
                >
                  <option value="20대 초반">20대 초반</option>
                  <option value="20대 중반">20대 중반</option>
                  <option value="20대 후반">20대 후반</option>
                  <option value="30대 초반">30대 초반</option>
                  <option value="30대 중후반">30대 중후반</option>
                  <option value="40대 이상">40대 이상</option>
                </select>
              </div>
            </div>

            {/* MBTI */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">MBTI</label>
              <input
                type="text"
                maxLength={4}
                value={mbti}
                onChange={e => setMbti(e.target.value.toUpperCase())}
                placeholder="예: ENFP"
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm uppercase"
              />
            </div>

            {/* 구사 언어 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">구사 가능한 언어</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={e => setNewLanguage(e.target.value)}
                  placeholder="예: 영어, 일본어"
                  className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                  onKeyDown={e => e.key === "Enter" && handleAddLanguage()}
                />
                <button
                  onClick={handleAddLanguage}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition text-sm font-bold"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {languages.map(lang => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600"
                  >
                    {lang}
                    <button onClick={() => setLanguages(languages.filter(l => l !== lang))}>
                      <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 한줄 소개 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">자기소개</label>
              <textarea
                value={selfIntro}
                onChange={e => setSelfIntro(e.target.value)}
                placeholder="자기소개를 간단히 적어주세요. (예: 풍경과 미식을 좋아하는 20대 여행자입니다!)"
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
              />
            </div>
          </div>
        )}

        {/* Step 2: 라이프 스타일 */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Essential highlight banner (Image Reference 2) */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-emerald-800 text-xs font-semibold flex items-start gap-2">
              <span className="text-emerald-600 font-black">✓ (필수)</span>
              <p className="leading-relaxed">입력한 정보는 더 잘 맞는 동행을 추천하기 위해 사용돼요.</p>
            </div>

            {/* 여행 상태 */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">🛫 여행 상태를 선택해주세요.*</label>
              <div className="space-y-2">
                {[
                  "지금 여행중이에요",
                  "여행이 예정되어있어요",
                  "여행을 같이 계획하고 싶어요"
                ].map(status => (
                  <button
                    key={status}
                    onClick={() => setTravelStatus(status)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs font-black transition flex items-center justify-between ${
                      travelStatus === status
                        ? "border-emerald-500 bg-emerald-50/20 text-emerald-700"
                        : "border-gray-100 bg-gray-50 text-gray-500"
                    }`}
                  >
                    <span>{status}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                      travelStatus === status
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-gray-300 bg-white"
                    }`}>
                      {travelStatus === status && <span className="text-[10px] font-black">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 흡연 & 음주 */}
            <div className="space-y-4">
              <div className="space-y-3.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">💨 흡연 유무를 선택해주세요.*</label>
                <div className="flex flex-wrap gap-2">
                  {smokingOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setSmoking(option)}
                      className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition ${
                        smoking === option
                          ? "border-emerald-500 bg-emerald-50/15 text-emerald-600 font-extrabold"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">🍺 음주 여부를 알려주세요.*</label>
                <div className="flex flex-wrap gap-2">
                  {drinkingOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setDrinking(option)}
                      className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition ${
                        drinking === option
                          ? "border-emerald-500 bg-emerald-50/15 text-emerald-600 font-extrabold"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 원하는 동행 연령대 */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">👥 원하는 동행 연령대 *</label>
              <div className="flex flex-wrap gap-2">
                {companionAgeOptions.map(age => {
                  const selected = companionAges.includes(age);
                  return (
                    <button
                      key={age}
                      onClick={() => handleToggle(age, companionAges, setCompanionAges)}
                      className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition ${
                        selected
                          ? "border-emerald-500 bg-emerald-50/15 text-emerald-600 font-extrabold"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      {age}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 찾고 있는 동행 역할 */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider">🤝 내가 찾고 있는 동행 역할 *</label>
              <div className="flex flex-wrap gap-2">
                {companionTypeOptions.map(type => {
                  const selected = companionTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => handleToggle(type, companionTypes, setCompanionTypes)}
                      className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition ${
                        selected
                          ? "border-emerald-500 bg-emerald-50/15 text-emerald-600 font-extrabold"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 여행 스타일 */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">여행 스타일 세부 선택</h3>
              <p className="text-xs text-gray-500">AI가 당신의 답변을 기반으로 상세한 추천 사유를 완성합니다.</p>
            </div>

            {/* 계획 스타일 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">여행 계획 스타일 *</label>
              <div className="space-y-2">
                {planningStyleOptions.map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => setPlanningStyle(opt.label)}
                    className={`w-full p-3 rounded-xl border text-left transition ${
                      planningStyle === opt.label
                        ? "border-primary bg-primary/5"
                        : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${planningStyle === opt.label ? "text-primary" : "text-gray-800"}`}>
                        {opt.label}
                      </span>
                      {planningStyle === opt.label && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 다녀온 나라 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">다녀온 나라</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCountry}
                  onChange={e => setNewCountry(e.target.value)}
                  placeholder="예: 일본, 미국, 태국"
                  className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                  onKeyDown={e => e.key === "Enter" && handleAddCountry()}
                />
                <button
                  onClick={handleAddCountry}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition text-sm font-bold"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {visitedCountries.map(country => (
                  <span
                    key={country}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600"
                  >
                    {country}
                    <button onClick={() => setVisitedCountries(visitedCountries.filter(c => c !== country))}>
                      <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 중요 요소 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">여행에서 가장 중요하게 생각하는 것 (최대 2개) *</label>
              <div className="flex flex-wrap gap-2">
                {factorOptions.map(factor => {
                  const selected = importantFactors.includes(factor);
                  return (
                    <button
                      key={factor}
                      onClick={() => handleToggle(factor, importantFactors, setImportantFactors, 2)}
                      className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition ${
                        selected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      {factor}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 걸음 수 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">하루 최대 선호 걸음 수 *</label>
              <div className="grid grid-cols-2 gap-2">
                {stepOptions.map(steps => (
                  <button
                    key={steps}
                    onClick={() => setMaxSteps(steps)}
                    className={`p-3 text-xs rounded-xl border font-semibold transition ${
                      maxSteps === steps
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 bg-white text-gray-600"
                    }`}
                  >
                    {steps}
                  </button>
                ))}
              </div>
            </div>

            {/* 숙소 타입 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">선호 숙소 타입 *</label>
              <div className="grid grid-cols-2 gap-2">
                {accommodationOptions.map(acc => {
                  const selected = accommodationTypes.includes(acc);
                  return (
                    <button
                      key={acc}
                      onClick={() => handleToggle(acc, accommodationTypes, setAccommodationTypes)}
                      className={`p-3 text-xs rounded-xl border font-semibold text-center transition ${
                        selected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      {acc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 여행지 테마 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">선호하는 여행지 테마 *</label>
              <div className="flex flex-wrap gap-2">
                {destinationOptions.map(dest => {
                  const selected = travelDestinations.includes(dest);
                  return (
                    <button
                      key={dest}
                      onClick={() => handleToggle(dest, travelDestinations, setTravelDestinations)}
                      className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition ${
                        selected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      {dest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 추구하는 여행 타입 */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">추구하는 여행 타입 (태그) *</label>
              <div className="flex flex-wrap gap-2">
                {travelTypeOptions.map(type => {
                  const selected = travelTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => handleToggle(type, travelTypes, setTravelTypes)}
                      className={`px-3 py-2 rounded-full text-xs border transition ${
                        selected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Button Panel */}
      <div className="absolute bottom-0 inset-x-0 p-4 border-t border-gray-100 bg-white z-20 flex flex-col gap-3.5">
        {/* Progress and helper text (Image Reference 2) */}
        <div className="flex flex-col gap-2 px-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
            <span className="text-emerald-500">💬</span>
            <span>프로필 완성 시 <span className="text-emerald-600 font-extrabold">매칭률이 정확</span>해져요</span>
          </div>
          {/* Small progress bar */}
          <div className="h-1 bg-gray-100 w-full rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3.5 border border-gray-200 rounded-2xl text-xs font-black text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition text-center"
            >
              이전
            </button>
          )}
          <button
            onClick={step < 3 ? () => setStep(step + 1) : handleComplete}
            className="flex-[2] py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black active:scale-[0.99] transition flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/10"
          >
            {step === 3 ? "성향 분석 및 완료" : "다음"}
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
