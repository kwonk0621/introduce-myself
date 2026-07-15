// SyncTrip Local Storage & Mock Database Engine
// Provides persistent client-side database simulation for a zero-setup demo experience.

export interface UserProfile {
  id: string;
  name: string;
  avatar_url: string;
  gender: string;
  age_group: string;
  mbti: string;
  self_intro: string;
  languages: string[];
  trust_score: number;
  is_identity_verified: boolean;
  is_org_verified: boolean;
  org_name?: string;
}

export interface TravelPreferences {
  travel_status: string;
  smoking: string;
  drinking: string;
  companion_ages: string[];
  companion_types: string[];
  planning_style: string;
  visited_countries: string[];
  important_factors: string[];
  max_steps: string;
  accommodation_types: string[];
  travel_destinations: string[];
  travel_types: string[];
  ai_summary?: string;
  ai_details?: {
    character: string;
    description: string;
    tips: string[];
  };
}

export interface MockUser {
  profile: UserProfile;
  preferences: TravelPreferences;
}

// 1. Initial Mock Users representing reference images
export const INITIAL_MOCK_USERS: MockUser[] = [
  {
    profile: {
      id: "user-2",
      name: "선지국밥",
      avatar_url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 중반",
      mbti: "ENFP",
      self_intro: "맛있는 음식과 좋은 카페를 탐방하는 여행을 좋아합니다! 편하게 대화 나눠요.",
      languages: ["한국어", "영어"],
      trust_score: 94,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "네이버"
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["20대 초", "20대 중후반"],
      companion_types: ["식사", "카페"],
      planning_style: "반반형",
      visited_countries: ["일본", "태국"],
      important_factors: ["맛있는 음식", "멋진 사진"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["도시", "맛집"],
      travel_types: ["미식 여행", "카페", "쇼핑"],
      ai_summary: "감성 가득한 맛집 탐방가"
    }
  },
  {
    profile: {
      id: "user-3",
      name: "케댈",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
      gender: "남자",
      age_group: "30대 중후반",
      mbti: "INTP",
      self_intro: "일본 온천 여행 및 걷는 것을 좋아하는 여행자입니다. 조용한 일정도 괜찮아요.",
      languages: ["한국어", "일본어"],
      trust_score: 88,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "마시지 않음",
      companion_ages: ["30대 초", "30대 중후반"],
      companion_types: ["전 일정"],
      planning_style: "즉흥형",
      visited_countries: ["일본"],
      important_factors: ["휴식", "좋은 숙소"],
      max_steps: "20,000 이상",
      accommodation_types: ["호스텔(게스트 하우스)", "에어비앤비"],
      travel_destinations: ["바다", "도시"],
      travel_types: ["휴양", "스파", "정적인"],
      ai_summary: "사색을 즐기는 힐링 도보 여행가"
    }
  },
  {
    profile: {
      id: "user-4",
      name: "겸손한버디41",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 초",
      mbti: "ISTJ",
      self_intro: "철저히 계획하고 동선을 최적화해서 움직이는 여행을 선호합니다. 같이 알찬 여행 만들어요!",
      languages: ["한국어", "영어", "중국어"],
      trust_score: 98,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "서울대학교"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "마시지 않음",
      companion_ages: ["20대 초", "20대 중후반"],
      companion_types: ["전 일정"],
      planning_style: "초계획형",
      visited_countries: ["프랑스", "독일", "이탈리아"],
      important_factors: ["일정의 여유로움", "멋진 사진"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["호텔", "비즈니스 호텔 / 모텔"],
      travel_destinations: ["산", "도시"],
      travel_types: ["관광", "랜드마크", "박물관"],
      ai_summary: "동선과 예산이 철저한 플래너"
    }
  },
  {
    profile: {
      id: "user-5",
      name: "상담용",
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 중후반",
      mbti: "INFP",
      self_intro: "그때그때 마음에 드는 곳을 다니는 유연한 여행자입니다. 바다를 보며 멍때리는 걸 좋아해요.",
      languages: ["한국어", "영어"],
      trust_score: 85,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "카카오"
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "비흡연",
      drinking: "사회적 음주",
      companion_ages: ["20대 중후반", "30대 초"],
      companion_types: ["전 일정"],
      planning_style: "완전 즉흥형",
      visited_countries: ["베트남", "태국"],
      important_factors: ["휴식", "맛있는 음식"],
      max_steps: "5,000 ~ 10,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["바다", "소도시"],
      travel_types: ["휴양", "카페", "정적인"],
      ai_summary: "바다 뷰를 즐기는 느긋한 힐러"
    }
  },
  {
    profile: {
      id: "user-6",
      name: "무앙",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "30대 중후반",
      mbti: "INFP",
      self_intro: "천천히 걸으며 로컬 분위기를 느끼는 정적인 여행을 좋아합니다.",
      languages: ["한국어"],
      trust_score: 90,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "마시지 않음",
      companion_ages: ["30대 초", "30대 중후반"],
      companion_types: ["식사", "카페"],
      planning_style: "반반형",
      visited_countries: ["대만"],
      important_factors: ["맛있는 음식", "휴식"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["소도시", "시골"],
      travel_types: ["미식 여행", "정적인", "박물관"],
      ai_summary: "현지 감성을 찾는 감성주의자"
    }
  },
  {
    profile: {
      id: "user-8",
      name: "희소",
      avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "30대 초",
      mbti: "INFP",
      self_intro: "풍경 사진 찍고 숲길을 걷는 편안한 여행을 사랑합니다.",
      languages: ["한국어", "영어"],
      trust_score: 92,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "삼성전자"
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["20대 중후반", "30대 초"],
      companion_types: ["전 일정"],
      planning_style: "즉흥형",
      visited_countries: ["스위스", "오스트리아"],
      important_factors: ["좋은 숙소", "멋진 사진"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["산", "시골"],
      travel_types: ["관광", "휴양", "정적인"],
      ai_summary: "대자연을 사랑하는 풍경 헌터"
    }
  },
  {
    profile: {
      id: "user-9",
      name: "이도리",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 초반",
      mbti: "ENFP",
      self_intro: "사람들과 만나는 걸 매우 좋아합니다! 어디든 떠나서 밤새 얘기하는 재미를 아시는 분 구해요.",
      languages: ["한국어", "영어", "스페인어"],
      trust_score: 95,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "연세대학교"
    },
    preferences: {
      travel_status: "지금 여행중이에요",
      smoking: "비흡연",
      drinking: "즐겨 마심",
      companion_ages: ["20대 초반", "20대 중후반"],
      companion_types: ["식사", "카페", "투어"],
      planning_style: "완전 즉흥형",
      visited_countries: ["스페인", "멕시코"],
      important_factors: ["맛있는 음식", "활동적인 경험"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["호스텔(게스트 하우스)", "에어비앤비"],
      travel_destinations: ["도시", "바다"],
      travel_types: ["액티비티", "페스티벌", "미식 여행"],
      ai_summary: "활기차고 긍정적인 파티 투어러"
    }
  },
  {
    profile: {
      id: "user-10",
      name: "충격적인토미46",
      avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop",
      gender: "남자",
      age_group: "30대 중반",
      mbti: "ISTP",
      self_intro: "필요한 정보만 깔끔하게 주고받으며 자유시간은 따로 보내는 쿨한 동행을 선호합니다.",
      languages: ["한국어", "영어"],
      trust_score: 74,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "흡연 (전자담배)",
      drinking: "사회적 음주",
      companion_ages: ["20대 중후반", "30대 초반", "30대 중후반"],
      companion_types: ["식사", "부분"],
      planning_style: "즉흥형",
      visited_countries: ["영국", "프랑스"],
      important_factors: ["맛있는 음식", "좋은 숙소"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["호텔", "비즈니스 호텔 / 모텔"],
      travel_destinations: ["도시"],
      travel_types: ["쇼핑", "미식 여행", "스파"],
      ai_summary: "자유롭고 합리적인 개인주의 여행자"
    }
  },
  {
    profile: {
      id: "user-11",
      name: "오광락",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop",
      gender: "남자",
      age_group: "30대 중후반",
      mbti: "INFP",
      self_intro: "풍경 사진 찍어드리는 거 잘합니다. 자연 속에서 편안하게 산책하는 여행을 즐겨요.",
      languages: ["한국어"],
      trust_score: 87,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "LG전자"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["30대 초반", "30대 중후반"],
      companion_types: ["전 일정", "사진"],
      planning_style: "반반형",
      visited_countries: ["일본", "캐나다"],
      important_factors: ["멋진 사진", "휴식"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["산", "시골"],
      travel_types: ["관광", "정적인", "휴양"],
      ai_summary: "대자연을 렌즈에 담는 고요한 사색가"
    }
  },
  {
    profile: {
      id: "user-12",
      name: "지적인윌리36",
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 중반",
      mbti: "INFJ",
      self_intro: "각종 역사지, 미술관, 갤러리 투어를 좋아합니다. 가벼운 담소와 토론을 즐깁니다.",
      languages: ["한국어", "영어", "독일어"],
      trust_score: 93,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "고려대학교"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "마시지 않음",
      companion_ages: ["20대 초반", "20대 중후반", "30대 초반"],
      companion_types: ["전 일정", "투어"],
      planning_style: "계획형",
      visited_countries: ["독일", "오스트리아", "영국"],
      important_factors: ["일정의 여유로움", "좋은 숙소"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["도시", "소도시"],
      travel_types: ["관광", "박물관", "갤러리"],
      ai_summary: "역사와 예술을 따라 걷는 탐구자"
    }
  },
  {
    profile: {
      id: "user-13",
      name: "강력한윌리28",
      avatar_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 중반",
      mbti: "ENFP",
      self_intro: "지치지 않는 텐션! 등산, 액티비티, 로컬 클럽 투어 모두 좋아해요! 하이파이브하며 달려봐요!",
      languages: ["한국어", "영어"],
      trust_score: 82,
      is_identity_verified: false,
      is_org_verified: true,
      org_name: "우아한형제들"
    },
    preferences: {
      travel_status: "지금 여행중이에요",
      smoking: "다른 흡연자가 있을 때만",
      drinking: "즐겨 마심",
      companion_ages: ["20대 초반", "20대 중후반"],
      companion_types: ["전 일정", "투어"],
      planning_style: "완전 즉흥형",
      visited_countries: ["뉴질랜드", "태국"],
      important_factors: ["활동적인 경험", "맛있는 음식"],
      max_steps: "20,000 이상",
      accommodation_types: ["호스텔(게스트 하우스)"],
      travel_destinations: ["산", "바다"],
      travel_types: ["액티비티", "페스티벌", "투어"],
      ai_summary: "한계에 도전하는 아웃도어 탐험가"
    }
  },
  {
    profile: {
      id: "user-14",
      name: "시즌트레블러",
      avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "30대 초반",
      mbti: "ENTJ",
      self_intro: "철저한 노선 낭비 방지! 렌트카 예약 완료. 가성비 극대화 동행을 만드실 분 지원하세요.",
      languages: ["한국어", "영어"],
      trust_score: 96,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "구글코리아"
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "비흡연",
      drinking: "사회적 음주",
      companion_ages: ["20대 중후반", "30대 초반", "30대 중후반"],
      companion_types: ["전 일정"],
      planning_style: "초계획형",
      visited_countries: ["미국", "캐나다"],
      important_factors: ["좋은 숙소", "일정의 여유로움"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["호텔"],
      travel_destinations: ["도시"],
      travel_types: ["랜드마크", "쇼핑", "관광"],
      ai_summary: "동선 효율 100% 비즈니스 리더"
    }
  },
  {
    profile: {
      id: "user-15",
      name: "낙천적인위고23",
      avatar_url: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "30대 초반",
      mbti: "ISFP",
      self_intro: "조용히 이쁜 풍경 카페에 앉아 일기 쓰고 드로잉하는 소소한 여행을 추구합니다.",
      languages: ["한국어", "일본어"],
      trust_score: 91,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "마시지 않음",
      companion_ages: ["20대 중후반", "30대 초반"],
      companion_types: ["카페", "식사"],
      planning_style: "반반형",
      visited_countries: ["일본", "대만"],
      important_factors: ["휴식", "멋진 사진"],
      max_steps: "5,000 ~ 10,000",
      accommodation_types: ["에어비앤비"],
      travel_destinations: ["소도시", "시골"],
      travel_types: ["정적인", "카페", "휴양"],
      ai_summary: "소소한 일상 속 영감을 찾는 예술가"
    }
  },
  {
    profile: {
      id: "user-16",
      name: "토미40",
      avatar_url: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 후반",
      mbti: "ISTP",
      self_intro: "서핑이나 스노클링 같이 바다 스포츠 즐기실 분 구합니다! 운동 신경 좋으시면 환영해요.",
      languages: ["한국어", "영어"],
      trust_score: 84,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "나이키코리아"
    },
    preferences: {
      travel_status: "지금 여행중이에요",
      smoking: "비흡연",
      drinking: "사회적 음주",
      companion_ages: ["20대 초반", "20대 중후반", "30대 초반"],
      companion_types: ["투어", "부분"],
      planning_style: "즉흥형",
      visited_countries: ["필리핀", "호주", "인도네시아"],
      important_factors: ["활동적인 경험", "맛있는 음식"],
      max_steps: "20,000 이상",
      accommodation_types: ["호스텔(게스트 하우스)", "에어비앤비"],
      travel_destinations: ["바다"],
      travel_types: ["액티비티", "투어", "스파"],
      ai_summary: "바다를 누비는 액티브 서퍼"
    }
  },
  {
    profile: {
      id: "user-17",
      name: "칩쟁이",
      avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 중반",
      mbti: "ENTP",
      self_intro: "카자흐스탄/키르기스스탄 로드트립 동행 구합니다! 현지 오지 캠핑과 승마 투어 위주입니다.",
      languages: ["한국어", "러시아어", "영어"],
      trust_score: 89,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "흡연 (연초)",
      drinking: "즐겨 마심",
      companion_ages: ["20대 초반", "20대 중후반", "30대 초반"],
      companion_types: ["전 일정", "투어"],
      planning_style: "즉흥형",
      visited_countries: ["몽골", "카자흐스탄"],
      important_factors: ["활동적인 경험", "일정의 여유로움"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["호스텔(게스트 하우스)", "에어비앤비"],
      travel_destinations: ["산", "시골"],
      travel_types: ["액티비티", "투어", "페스티벌"],
      ai_summary: "유라시아 벌판을 꿈꾸는 개척자"
    }
  },
  {
    profile: {
      id: "user-18",
      name: "쪼아",
      avatar_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 초반",
      mbti: "ESFP",
      self_intro: "올랜도 디즈니월드 4박5일 같이 가실 분! 사진 1000장 찍어드리고 머리띠 맞춰 쓸 분 원해요!!",
      languages: ["한국어", "영어"],
      trust_score: 93,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "이화여자대학교"
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["20대 초반", "20대 중후반"],
      companion_types: ["전 일정", "사진"],
      planning_style: "계획형",
      visited_countries: ["미국", "홍콩"],
      important_factors: ["멋진 사진", "맛있는 음식"],
      max_steps: "20,000 이상",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["도시"],
      travel_types: ["랜드마크", "관광", "페스티벌"],
      ai_summary: "놀이공원 정복을 꿈꾸는 에너자이저"
    }
  },
  {
    profile: {
      id: "user-19",
      name: "잔잔한위고26",
      avatar_url: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "30대 중반",
      mbti: "INFJ",
      self_intro: "복잡한 도심을 피해 조용한 시골 온천 마을을 찾아 힐링하고 글을 씁니다. 정적이 편해요.",
      languages: ["한국어", "일본어"],
      trust_score: 92,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "한글과컴퓨터"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "마시지 않음",
      companion_ages: ["30대 초반", "30대 중후반", "40대 초반"],
      companion_types: ["전 일정"],
      planning_style: "계획형",
      visited_countries: ["일본"],
      important_factors: ["휴식", "좋은 숙소"],
      max_steps: "5,000 ~ 10,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["시골", "소도시"],
      travel_types: ["스파", "정적인", "휴양"],
      ai_summary: "시골 온천가에서 쉬어가는 몽상가"
    }
  },
  {
    profile: {
      id: "user-20",
      name: "캐네딘죠니",
      avatar_url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop",
      gender: "남자",
      age_group: "30대 초반",
      mbti: "ESTP",
      self_intro: "강원도 삼척/양양 1박 2일로 차 타고 서핑 및 계곡 가실 남녀 분 구합니다. 물놀이에 진심인 분!",
      languages: ["한국어"],
      trust_score: 86,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "현대자동차"
    },
    preferences: {
      travel_status: "지금 여행중이에요",
      smoking: "다른 흡연자가 있을 때만",
      drinking: "즐겨 마심",
      companion_ages: ["20대 중후반", "30대 초반"],
      companion_types: ["전 일정", "투어"],
      planning_style: "완전 즉흥형",
      visited_countries: ["필리핀", "미국"],
      important_factors: ["활동적인 경험", "맛있는 음식"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["에어비앤비", "비즈니스 호텔 / 모텔"],
      travel_destinations: ["바다", "산"],
      travel_types: ["액티비티", "미식 여행", "투어"],
      ai_summary: "전국 방방곡곡 물 찾아 떠나는 스포츠맨"
    }
  },
  {
    profile: {
      id: "user-21",
      name: "사려깊은버디74",
      avatar_url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 초반",
      mbti: "ISFJ",
      self_intro: "터키 카파도키아 벌룬 투어 일정 조율할 메이트 구합니다. 유적지 설명 듣는 것 좋아해요.",
      languages: ["한국어", "영어"],
      trust_score: 94,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "경희대학교"
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "비흡연",
      drinking: "마시지 않음",
      companion_ages: ["20대 초반", "20대 중후반"],
      companion_types: ["전 일정", "투어"],
      planning_style: "계획형",
      visited_countries: ["튀르키예", "그리스"],
      important_factors: ["좋은 숙소", "멋진 사진"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["도시", "소도시"],
      travel_types: ["관광", "랜드마크", "역사/유적"],
      ai_summary: "역사 속 낭만을 기록하는 기록가"
    }
  },
  {
    profile: {
      id: "user-22",
      name: "낭만탐험가",
      avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop",
      gender: "남자",
      age_group: "40대 초반",
      mbti: "ENFJ",
      self_intro: "일하느라 고생한 스스로에게 오로라 뷰 글램핑 휴양을 선물하려 합니다. 감성 동행 연락 환영해요.",
      languages: ["한국어", "영어"],
      trust_score: 97,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "SK텔레콤"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "사회적 음주",
      companion_ages: ["30대 초반", "30대 중후반", "40대 초반"],
      companion_types: ["전 일정"],
      planning_style: "반반형",
      visited_countries: ["아이슬란드", "노르웨이"],
      important_factors: ["휴식", "좋은 숙소"],
      max_steps: "5,000 ~ 10,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["산", "시골"],
      travel_types: ["휴양", "스파", "정적인"],
      ai_summary: "북유럽 감성에 젖는 로맨티스트"
    }
  },
  {
    profile: {
      id: "user-23",
      name: "산들바람",
      avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "50대 초반",
      mbti: "ESFJ",
      self_intro: "자연 경관이 수려한 알프스 트래킹을 천천히 걷고 현지 오두막에서 도란도란 맛난 식사할 분들 찾아요.",
      languages: ["한국어", "영어"],
      trust_score: 95,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["40대 초반", "40대 중후반", "50대 이상"],
      companion_types: ["전 일정", "식사"],
      planning_style: "계획형",
      visited_countries: ["스위스", "오스트리아"],
      important_factors: ["일정의 여유로움", "맛있는 음식"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["산", "시골"],
      travel_types: ["관광", "휴양", "정적인"],
      ai_summary: "알프스의 푸른 숨결을 찾는 여유주의자"
    }
  },
  {
    profile: {
      id: "user-24",
      name: "자전거맨",
      avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 후반",
      mbti: "ESTJ",
      self_intro: "일본 자전거 종주 코스 완주를 목표로 삼고 달리는 스포츠 여행러입니다. 함께 땀 흘려요!",
      languages: ["한국어", "영어", "일본어"],
      trust_score: 90,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "삼천리자전거"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "마시지 않음",
      companion_ages: ["20대 초반", "20대 중후반", "30대 초반"],
      companion_types: ["전 일정", "투어"],
      planning_style: "초계획형",
      visited_countries: ["일본"],
      important_factors: ["활동적인 경험", "일정의 여유로움"],
      max_steps: "20,000 이상",
      accommodation_types: ["호스텔(게스트 하우스)"],
      travel_destinations: ["산", "시골", "소도시"],
      travel_types: ["액티비티", "투어"],
      ai_summary: "두 바퀴로 한계를 돌파하는 바이크맨"
    }
  },
  {
    profile: {
      id: "user-25",
      name: "갤러리도슨트",
      avatar_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "30대 중반",
      mbti: "INTJ",
      self_intro: "유럽 미술관 작품 가이드 투어 및 도슨트 설명 듣는 걸 최우선으로 일정을 짭니다. 심오한 대화 좋아해요.",
      languages: ["한국어", "영어", "프랑스어"],
      trust_score: 94,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "국립현대미술관"
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["20대 후반", "30대 초반", "30대 중후반"],
      companion_types: ["투어", "식사"],
      planning_style: "초계획형",
      visited_countries: ["프랑스", "이탈리아"],
      important_factors: ["맛있는 음식", "좋은 숙소"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["도시"],
      travel_types: ["관광", "박물관", "갤러리"],
      ai_summary: "명화 앞의 침묵을 사랑하는 학구파"
    }
  },
  {
    profile: {
      id: "user-26",
      name: "글로벌방랑자",
      avatar_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop",
      gender: "남자",
      age_group: "30대 초반",
      mbti: "ENTP",
      self_intro: "전 세계 디지털 노마드로 살아가고 있습니다. 현지 한인 타운이나 코워킹 스페이스 근처 동행 환영해요.",
      languages: ["한국어", "영어", "베트남어"],
      trust_score: 87,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "라인플러스"
    },
    preferences: {
      travel_status: "지금 여행중이에요",
      smoking: "흡연 (전자담배)",
      drinking: "즐겨 마심",
      companion_ages: ["20대 중후반", "30대 초반", "30대 중후반"],
      companion_types: ["카페", "식사"],
      planning_style: "반반형",
      visited_countries: ["태국", "베트남", "인도네시아"],
      important_factors: ["맛있는 음식", "휴식"],
      max_steps: "5,000 ~ 10,000",
      accommodation_types: ["에어비앤비", "호텔"],
      travel_destinations: ["도시", "바다"],
      travel_types: ["휴양", "카페", "쇼핑"],
      ai_summary: "노트북 하나 들고 방랑하는 디지털 유목민"
    }
  },
  {
    profile: {
      id: "user-27",
      name: "맥주매니아",
      avatar_url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 후반",
      mbti: "ENFP",
      self_intro: "독일 옥토버페스트(맥주 축제) 메이트 구합니다! 활달하게 현지 축제 분위기 같이 흠뻑 즐겨요!",
      languages: ["한국어", "영어"],
      trust_score: 91,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "음주 시",
      drinking: "즐겨 마심",
      companion_ages: ["20대 초반", "20대 중후반", "30대 초반"],
      companion_types: ["전 일정", "식사"],
      planning_style: "완전 즉흥형",
      visited_countries: ["독일"],
      important_factors: ["맛있는 음식", "활동적인 경험"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["호스텔(게스트 하우스)", "에어비앤비"],
      travel_destinations: ["도시", "소도시"],
      travel_types: ["페스티벌", "미식 여행", "액티비티"],
      ai_summary: "황금빛 맥주 거품 속 낭만주의자"
    }
  },
  {
    profile: {
      id: "user-28",
      name: "액티브라이더",
      avatar_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop",
      gender: "남자",
      age_group: "30대 초반",
      mbti: "ESTP",
      self_intro: "패러글라이딩, 스카이다이빙 등 고자극 아드레날린 여행 메이트 적극적으로 모집합니다!",
      languages: ["한국어", "영어"],
      trust_score: 83,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "한화시스템"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "사회적 음주",
      companion_ages: ["20대 중후반", "30대 초반", "30대 중후반"],
      companion_types: ["투어", "부분"],
      planning_style: "즉흥형",
      visited_countries: ["스위스", "호주"],
      important_factors: ["활동적인 경험", "멋진 사진"],
      max_steps: "20,000 이상",
      accommodation_types: ["호스텔(게스트 하우스)", "에어비앤비"],
      travel_destinations: ["산", "바다"],
      travel_types: ["액티비티", "투어", "관광"],
      ai_summary: "아드레날린에 중독된 하드코어 스포터"
    }
  },
  {
    profile: {
      id: "user-29",
      name: "소소한행복",
      avatar_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&auto=format&fit=crop",
      gender: "여자",
      age_group: "40대 중후반",
      mbti: "ISFJ",
      self_intro: "아이들 다 키우고 혼자 조용히 갤러리와 고성 투어를 다니며 명상하는 시간을 보냅니다.",
      languages: ["한국어", "영어"],
      trust_score: 96,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "비흡연",
      drinking: "마시지 않음",
      companion_ages: ["30대 중후반", "40대 초반", "40대 중후반", "50대 이상"],
      companion_types: ["전 일정", "식사"],
      planning_style: "계획형",
      visited_countries: ["프랑스", "영국"],
      important_factors: ["일정의 여유로움", "휴식"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["호텔"],
      travel_destinations: ["도시", "소도시"],
      travel_types: ["정적인", "박물관", "갤러리"],
      ai_summary: "조용한 박물관 회랑을 음미하는 사색가"
    }
  },
  {
    profile: {
      id: "user-30",
      name: "캠핑러버",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
      gender: "남자",
      age_group: "30대 중후반",
      mbti: "ISTJ",
      self_intro: "일본 홋카이도 캠핑장 순례 및 자연 글램핑 동행 구합니다. 텐트 설치 및 장비 보유 중입니다.",
      languages: ["한국어", "일본어"],
      trust_score: 94,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "코오롱스포츠"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["30대 초반", "30대 중후반", "40대 초반"],
      companion_types: ["전 일정"],
      planning_style: "초계획형",
      visited_countries: ["일본"],
      important_factors: ["휴식", "활동적인 경험"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["에어비앤비"],
      travel_destinations: ["산", "시골"],
      travel_types: ["휴양", "액티비티", "정적인"],
      ai_summary: "철저히 세팅된 홋카이도 숲속 쉘터의 주인"
    }
  }
];

// Helper to calculate match percentage based on styles
export function calculateMatchPercentage(
  myPref: TravelPreferences,
  otherPref: TravelPreferences,
  myMbti?: string,
  otherMbti?: string
): number {
  let score = 50; // base score

  // 1. Planning style compatibility (up to 15%)
  if (myPref.planning_style && otherPref.planning_style) {
    if (myPref.planning_style === otherPref.planning_style) {
      score += 15;
    } else {
      const styles = ["초계획형", "계획형", "반반형", "즉흥형", "완전 즉흥형"];
      const diff = Math.abs(styles.indexOf(myPref.planning_style) - styles.indexOf(otherPref.planning_style));
      if (diff === 1) score += 10;
      else if (diff === 2) score += 5;
    }
  }

  // 2. Smoking compatibility (up to 10% - crucial for comfort!)
  if (myPref.smoking && otherPref.smoking) {
    if (myPref.smoking === "비흡연" && otherPref.smoking === "비흡연") {
      score += 10;
    } else if (myPref.smoking.includes("흡연") && otherPref.smoking.includes("흡연")) {
      score += 8;
    } else if (myPref.smoking === "비흡연" && otherPref.smoking.includes("흡연")) {
      score -= 10; // penalty
    }
  }

  // 3. Drinking compatibility (up to 5%)
  if (myPref.drinking && otherPref.drinking) {
    if (myPref.drinking === otherPref.drinking) score += 5;
    else if (myPref.drinking !== "마시지 않음" && otherPref.drinking !== "마시지 않음") score += 3;
  }

  // 4. Common destinations/vibe (up to 15%)
  if (myPref.travel_destinations && otherPref.travel_destinations) {
    const intersection = myPref.travel_destinations.filter(x => otherPref.travel_destinations.includes(x));
    score += Math.min(15, intersection.length * 5);
  }

  // 5. Common travel types (up to 15%)
  if (myPref.travel_types && otherPref.travel_types) {
    const intersection = myPref.travel_types.filter(x => otherPref.travel_types.includes(x));
    score += Math.min(15, intersection.length * 4);
  }

  // 6. Steps compatibility (up to 5%)
  if (myPref.max_steps && otherPref.max_steps) {
    if (myPref.max_steps === otherPref.max_steps) score += 5;
  }

  // 7. MBTI chemistry (up to 10%)
  if (myMbti && otherMbti) {
    const myE = myMbti[0] === "E";
    const otherE = otherMbti[0] === "E";
    const myP = myMbti[3] === "P";
    const otherP = otherMbti[3] === "P";

    // E/I balance (usually E with I or P with P matches well)
    if (myE !== otherE) score += 5; // Opposites attract!
    if (myP === otherP) score += 5; // Planning compatibility!
  }

  return Math.min(99, Math.max(45, score));
}

// Client Side Storage Actions
const STORAGE_KEYS = {
  USER_PROFILE: "synctrip_user_profile",
  USER_PREFERENCES: "synctrip_user_pref",
  CHAT_ROOMS: "synctrip_chat_rooms",
  CHAT_MESSAGES: "synctrip_chat_messages",
  MATCHES: "synctrip_matches",
  VERIFICATIONS: "synctrip_verifications"
};

export const storage = {
  getProfile(): UserProfile | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  },

  saveProfile(profile: UserProfile): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getPreferences(): TravelPreferences | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return data ? JSON.parse(data) : null;
  },

  savePreferences(pref: TravelPreferences): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(pref));
  },

  getMockUsersWithScores(): MockUser[] {
    const userPref = this.getPreferences();
    const userProfile = this.getProfile();
    
    if (!userPref) return INITIAL_MOCK_USERS;

    return INITIAL_MOCK_USERS.map(mock => {
      const matchPct = calculateMatchPercentage(
        userPref,
        mock.preferences,
        userProfile?.mbti,
        mock.profile.mbti
      );
      // Attach calculated score to the mock user profile
      return {
        ...mock,
        profile: {
          ...mock.profile,
          trust_score: Math.round((mock.profile.trust_score * 0.7 + matchPct * 0.3)) // scale matching influence on score for visuals
        },
        matchScore: matchPct
      };
    }).sort((a, b) => ((b as any).matchScore || 0) - ((a as any).matchScore || 0));
  },

  getMatches(): any[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.MATCHES);
    return data ? JSON.parse(data) : [];
  },

  createMatchRequest(otherUserId: string): boolean {
    if (typeof window === "undefined") return false;
    const matches = this.getMatches();
    const profile = this.getProfile();
    if (!profile) return false;

    // Check if exists
    const exists = matches.some(m => m.receiver_id === otherUserId && m.requester_id === profile.id);
    if (exists) {
      this.createChatRoom(otherUserId);
      return true;
    }

    // Simulate auto-accepting match after 1 second for demo purposes!
    const newMatch = {
      id: `match-${Date.now()}`,
      requester_id: profile.id,
      receiver_id: otherUserId,
      status: "accepted", // Auto-accept to enable chat immediately for smooth demo
      created_at: new Date().toISOString()
    };

    matches.push(newMatch);
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));

    // Also auto-create a chat room for them
    this.createChatRoom(otherUserId);
    return true;
  },

  getChatRooms(): any[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.CHAT_ROOMS);
    let rooms = data ? JSON.parse(data) : [];
    
    // Enrich with partner profile
    const profile = this.getProfile();
    if (!profile) return [];

    // Deduplicate by room ID and by participant pairs, and repair database in localStorage if needed
    const uniqueRooms: any[] = [];
    const seenIds = new Set();
    const seenParticipants = new Set();
    let hasDuplicates = false;

    for (const room of rooms) {
      if (!room || !room.id || !room.participants) {
        hasDuplicates = true;
        continue;
      }
      
      if (seenIds.has(room.id)) {
        hasDuplicates = true;
        continue;
      }

      const sortedParts = [...room.participants].sort().join("|");
      if (seenParticipants.has(sortedParts)) {
        hasDuplicates = true;
        continue;
      }

      seenIds.add(room.id);
      seenParticipants.add(sortedParts);
      uniqueRooms.push(room);
    }

    if (hasDuplicates) {
      localStorage.setItem(STORAGE_KEYS.CHAT_ROOMS, JSON.stringify(uniqueRooms));
    }

    return uniqueRooms.map((room: any) => {
      const partnerId = room.participants.find((p: string) => p !== profile.id);
      const partner = INITIAL_MOCK_USERS.find(u => u.profile.id === partnerId)?.profile;
      const lastMsg = this.getLastMessage(room.id);
      return {
        id: room.id,
        partner,
        lastMessage: lastMsg?.message || "대화방이 개설되었습니다.",
        lastMessageTime: lastMsg?.created_at || room.created_at,
        unreadCount: 0
      };
    });
  },

  createChatRoom(partnerId: string): string {
    if (typeof window === "undefined") return "";
    const profile = this.getProfile();
    if (!profile) return "";

    const data = localStorage.getItem(STORAGE_KEYS.CHAT_ROOMS);
    let rooms = data ? JSON.parse(data) : [];

    // Check if room already exists
    const existing = rooms.find((r: any) => 
      r.participants && r.participants.includes(profile.id) && r.participants.includes(partnerId)
    );
    if (existing) return existing.id;

    const newRoomId = `room-${Date.now()}`;
    const newRoom = {
      id: newRoomId,
      participants: [profile.id, partnerId],
      created_at: new Date().toISOString()
    };

    rooms.push(newRoom);
    localStorage.setItem(STORAGE_KEYS.CHAT_ROOMS, JSON.stringify(rooms));
    return newRoomId;
  },

  deleteChatRoom(roomId: string): void {
    if (typeof window === "undefined") return;
    
    // 1. Remove from rooms list
    const roomsData = localStorage.getItem(STORAGE_KEYS.CHAT_ROOMS);
    if (roomsData) {
      const rooms = JSON.parse(roomsData);
      const filtered = rooms.filter((r: any) => r.id !== roomId);
      localStorage.setItem(STORAGE_KEYS.CHAT_ROOMS, JSON.stringify(filtered));
    }
    
    // 2. Remove messages associated with this room to save space
    const msgsData = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    if (msgsData) {
      const msgs = JSON.parse(msgsData);
      const filteredMsgs = msgs.filter((m: any) => m.room_id !== roomId);
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(filteredMsgs));
    }
  },

  getChatMessages(roomId: string): any[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    const allMsgs = data ? JSON.parse(data) : [];
    return allMsgs.filter((m: any) => m.room_id === roomId).sort((a: any, b: any) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  },

  getLastMessage(roomId: string): any | null {
    const msgs = this.getChatMessages(roomId);
    return msgs.length > 0 ? msgs[msgs.length - 1] : null;
  },

  sendChatMessage(roomId: string, messageText: string): any {
    if (typeof window === "undefined") return null;
    const profile = this.getProfile();
    if (!profile) return null;

    const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    const allMsgs = data ? JSON.parse(data) : [];

    const newMsg = {
      id: `msg-${Date.now()}`,
      room_id: roomId,
      sender_id: profile.id,
      message: messageText,
      created_at: new Date().toISOString()
    };

    allMsgs.push(newMsg);
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(allMsgs));

    // Trigger mock auto-reply for rich messaging demo!
    setTimeout(() => {
      this.triggerMockReply(roomId);
    }, 1500);

    return newMsg;
  },

  async triggerMockReply(roomId: string) {
    if (typeof window === "undefined") return;
    const profile = this.getProfile();
    if (!profile) return;
    
    // Find partner name
    const roomsData = localStorage.getItem(STORAGE_KEYS.CHAT_ROOMS);
    const rooms = roomsData ? JSON.parse(roomsData) : [];
    const room = rooms.find((r: any) => r.id === roomId);
    if (!room) return;

    const partnerId = room.participants.find((p: string) => p !== profile.id);
    const partner = INITIAL_MOCK_USERS.find(u => u.profile.id === partnerId);
    if (!partner) return;

    const messages = this.getChatMessages(roomId);

    try {
      const response = await fetch("/api/chat/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          messages,
          partner: {
            ...partner.profile,
            preferences: partner.preferences
          },
          userProfile: profile
        })
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.reply;

        const msgsData = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
        const allMsgs = msgsData ? JSON.parse(msgsData) : [];

        const partnerMsg = {
          id: `msg-reply-${Date.now()}`,
          room_id: roomId,
          sender_id: partnerId,
          message: replyText,
          created_at: new Date().toISOString()
        };

        allMsgs.push(partnerMsg);
        localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(allMsgs));

        // Custom Event to notify react pages to refresh messages instantly
        window.dispatchEvent(new CustomEvent("synctrip_new_message", { detail: { roomId } }));
      }
    } catch (err) {
      console.error("Failed to generate AI auto reply", err);
    }
  },

  resetAllData(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.CHAT_ROOMS);
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.MATCHES);
  }
};
