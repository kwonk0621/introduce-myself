// SyncTrip Local Storage & Mock Database Engine
// Provides persistent client-side database simulation for a zero-setup demo experience.
import { supabase } from "./supabaseClient";

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
  wish_countries?: string[];
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
      name: "반짝이는윌리67",
      avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 중후반",
      mbti: "ISFP",
      self_intro: "안녕하세용 8월달 일본 여행가실분 구합니다!",
      languages: ["한국어", "영어"],
      trust_score: 94,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "흡연에 자유로운 나라를 갈 때만",
      drinking: "즐겨 마심",
      companion_ages: ["20대 초", "20대 중후반", "30대 초"],
      companion_types: ["전 일정"],
      planning_style: "즉흥형",
      visited_countries: ["일본", "베트남"],
      important_factors: ["맛있는 음식", "활동적인 경험"],
      max_steps: "20,000 이상",
      accommodation_types: ["잠만 잘 수 있다면 어디든 좋아요!"],
      travel_destinations: ["바다", "소도시"],
      travel_types: ["액티비티", "휴양"],
      wish_countries: ["일본"],
      ai_summary: "자유로운 도보 여행 마니아"
    }
  },
  {
    profile: {
      id: "user-3",
      name: "놀라운토미35",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 중후반",
      mbti: "ENTP",
      self_intro: "안녕하세요",
      languages: ["한국어"],
      trust_score: 89,
      is_identity_verified: false,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "흡연 (연초)",
      drinking: "즐겨 마심",
      companion_ages: ["20대 중후반"],
      companion_types: ["전 일정", "식사", "카페", "사진", "투어", "부분"],
      planning_style: "",
      visited_countries: [],
      important_factors: ["맛있는 음식", "멋진 사진"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["호텔", "비즈니스 호텔 / 모텔"],
      travel_destinations: ["바다", "도시", "시골", "소도시"],
      travel_types: ["정적인", "페스티벌", "랜드마크", "관광", "휴양", "카페", "스파", "미식 여행", "쇼핑"],
      wish_countries: [],
      ai_summary: "트렌디한 감성의 탐험가"
    }
  },
  {
    profile: {
      id: "user-4",
      name: "느린토미56",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 초",
      mbti: "INFJ",
      self_intro: "",
      languages: ["한국어", "일본어", "영어"],
      trust_score: 92,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "흡연 (전자담배)",
      drinking: "가끔 마심",
      companion_ages: ["20대 초", "20대 중후반", "30대 초"],
      companion_types: ["식사", "사진", "투어", "부분"],
      planning_style: "계획형",
      visited_countries: ["일본", "필리핀", "이스라엘"],
      important_factors: ["맛있는 음식", "활동적인 경험"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["잠만 잘 수 있다면 어디든 좋아요!"],
      travel_destinations: ["산", "바다", "도시", "시골", "소도시"],
      travel_types: ["액티비티", "정적인", "많이 돌아다니는", "페스티벌", "투어", "랜드마크", "관광", "휴양", "카페", "스파", "미식 여행", "쇼핑", "박물관", "갤러리"],
      wish_countries: ["몽골", "일본", "스페인", "이집트", "필리핀"],
      ai_summary: "다채로운 경험을 좇는 인문학 여행자"
    }
  },
  {
    profile: {
      id: "user-5",
      name: "타르트",
      avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 초",
      mbti: "ISFJ",
      self_intro: "아기자기한 카페와 소품샵 투어를 좋아하는 직장인입니다!",
      languages: ["한국어"],
      trust_score: 96,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "배달의민족"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["20대 초", "20대 중후반"],
      companion_types: ["식사", "카페", "사진"],
      planning_style: "계획형",
      visited_countries: ["일본"],
      important_factors: ["맛있는 음식", "멋진 사진"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["잠만 잘 수 있다면 어디든 좋아요!"],
      travel_destinations: ["도시", "소도시"],
      travel_types: ["카페", "쇼핑"],
      wish_countries: [],
      ai_summary: "감성 충만 카페 순례자"
    }
  },
  {
    profile: {
      id: "user-6",
      name: "따스한윌리47",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "30대 초",
      mbti: "ISFP",
      self_intro: "자연을 사랑하고 조용한 바닷가 소도시에서 힐링하는 걸 선호해요.",
      languages: ["한국어", "영어"],
      trust_score: 91,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["20대 중후반", "30대 초", "30대 중후반"],
      companion_types: ["전 일정", "식사", "카페", "사진", "투어", "부분"],
      planning_style: "",
      visited_countries: [],
      important_factors: ["맛있는 음식", "멋진 사진"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["호텔", "비즈니스 호텔 / 모텔", "에어비앤비"],
      travel_destinations: ["바다", "도시", "시골", "소도시"],
      travel_types: ["투어", "랜드마크", "관광", "휴양", "카페", "쇼핑", "갤러리"],
      wish_countries: [],
      ai_summary: "바다와 갤러리를 좋아하는 로맨티스트"
    }
  },
  {
    profile: {
      id: "user-7",
      name: "달이s",
      avatar_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 초",
      mbti: "ENTP",
      self_intro: "안녕하세요 함께 즐거운 추억을 만들었으면 좋겠습니다! 잘 부탁드려요",
      languages: ["한국어", "영어"],
      trust_score: 88,
      is_identity_verified: false,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "사회적 음주",
      companion_ages: ["20대 초", "20대 중후반"],
      companion_types: ["전 일정", "식사", "카페", "사진", "부분"],
      planning_style: "반반형",
      visited_countries: ["일본", "홍콩", "싱가포르", "베트남", "태국", "이탈리아", "미국", "캐나다", "호주"],
      important_factors: ["맛있는 음식", "멋진 사진"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["바다", "도시", "시골", "소도시"],
      travel_types: ["액티비티", "페스티벌", "투어", "랜드마크", "관광", "휴양", "카페", "스파", "미식 여행", "쇼핑"],
      wish_countries: [],
      ai_summary: "프로 역마살 페스티벌 러버"
    }
  },
  {
    profile: {
      id: "user-8",
      name: "침착한위고13",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 중후반",
      mbti: "ENTJ",
      self_intro: "안녕하세요 여행다니면서 사진 찍는게 취미입니다",
      languages: ["한국어", "영어"],
      trust_score: 95,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "삼성전자"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "다른 흡연자가 있을 때만",
      drinking: "가끔 마심",
      companion_ages: ["20대 초", "20대 중후반", "30대 초"],
      companion_types: ["전 일정"],
      planning_style: "반반형",
      visited_countries: ["일본", "홍콩", "베트남", "태국"],
      important_factors: ["맛있는 음식", "휴식"],
      max_steps: "20,000 이상",
      accommodation_types: ["호텔", "호스텔(게스트 하우스)"],
      travel_destinations: ["산", "바다", "도시"],
      travel_types: ["액티비티", "정적인", "많이 돌아다니는", "페스티벌", "투어", "랜드마크", "관광", "휴양", "카페", "스파", "미식 여행", "쇼핑", "박물관", "갤러리"],
      wish_countries: [],
      ai_summary: "기록을 중요하게 생각하는 포토그래퍼"
    }
  },
  {
    profile: {
      id: "user-12",
      name: "맛있는소피23",
      avatar_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 중후반",
      mbti: "ENFJ",
      self_intro: "미식 여행을 떠나는 것을 가장 좋아해요! 로컬 맛집이나 디저트 카페 투어 함께해요.",
      languages: ["한국어", "영어"],
      trust_score: 93,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "네이버"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["20대 중후반", "30대 초"],
      companion_types: ["식사", "카페"],
      planning_style: "계획형",
      visited_countries: ["일본", "프랑스", "이탈리아"],
      important_factors: ["맛있는 음식", "휴식"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["도시", "소도시"],
      travel_types: ["카페", "미식 여행", "쇼핑"],
      wish_countries: ["이탈리아"],
      ai_summary: "로컬 맛집 사냥꾼"
    }
  },
  {
    profile: {
      id: "user-13",
      name: "유랑자토니",
      avatar_url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "30대 초",
      mbti: "INFP",
      self_intro: "트래킹하고 백패킹하는 모험을 좋아합니다. 조용한 자연 속에서 힐링하실 분!",
      languages: ["한국어", "영어"],
      trust_score: 86,
      is_identity_verified: false,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "비흡연",
      drinking: "마시지 않음",
      companion_ages: ["20대 중후반", "30대 초", "30대 중후반"],
      companion_types: ["전 일정", "투어"],
      planning_style: "즉흥형",
      visited_countries: ["네팔", "몽골", "스위스"],
      important_factors: ["활동적인 경험", "일정의 여유로움"],
      max_steps: "20,000 이상",
      accommodation_types: ["호스텔(게스트 하우스)", "잠만 잘 수 있다면 어디든 좋아요!"],
      travel_destinations: ["산", "시골"],
      travel_types: ["액티비티", "정적인", "많이 돌아다니는"],
      wish_countries: ["네팔"],
      ai_summary: "자연을 달리는 백패커"
    }
  },
  {
    profile: {
      id: "user-14",
      name: "쇼핑왕루이",
      avatar_url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 초",
      mbti: "ESTJ",
      self_intro: "도심 속 편집샵 쇼핑과 트렌디한 랜드마크 관광을 좋아합니다. 같이 쇼핑하고 코디해봐요!",
      languages: ["한국어", "영어", "일본어"],
      trust_score: 92,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "흡연 (전자담배)",
      drinking: "사회적 음주",
      companion_ages: ["20대 초", "20대 중후반"],
      companion_types: ["식사", "카페", "사진", "부분"],
      planning_style: "초계획형",
      visited_countries: ["일본", "홍콩", "싱가포르"],
      important_factors: ["맛있는 음식", "멋진 사진"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["호텔"],
      travel_destinations: ["도시"],
      travel_types: ["랜드마크", "카페", "쇼핑", "미식 여행"],
      wish_countries: ["일본"],
      ai_summary: "트렌드 리더 쇼퍼"
    }
  },
  {
    profile: {
      id: "user-15",
      name: "자연인메이",
      avatar_url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "30대 중후반",
      mbti: "INFJ",
      self_intro: "푸른 숲길을 걷거나 잔잔한 호수를 바라보는 조용하고 느린 호흡의 여행이 좋아요.",
      languages: ["한국어"],
      trust_score: 90,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "비흡연",
      drinking: "마시지 않음",
      companion_ages: ["30대 초", "30대 중후반", "40대 초"],
      companion_types: ["전 일정", "식사", "카페"],
      planning_style: "계획형",
      visited_countries: ["오스트리아", "스위스"],
      important_factors: ["휴식", "일정의 여유로움"],
      max_steps: "5,000 ~ 10,000",
      accommodation_types: ["에어비앤비", "호텔"],
      travel_destinations: ["산", "시골", "소도시"],
      travel_types: ["정적인", "휴양", "스파", "박물관"],
      wish_countries: ["스위스"],
      ai_summary: "슬로우 라이프 힐러"
    }
  },
  {
    profile: {
      id: "user-16",
      name: "페스티벌덕후",
      avatar_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 중후반",
      mbti: "ESFP",
      self_intro: "해외 유명 음악 페스티벌이나 현지 야시장 축제 보러 가실 흥 넘치는 분 구해요!",
      languages: ["한국어", "영어", "스페인어"],
      trust_score: 95,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "카카오"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "음주 시",
      drinking: "즐겨 마심",
      companion_ages: ["20대 초", "20대 중후반", "30대 초"],
      companion_types: ["전 일정", "부분", "식사", "투어"],
      planning_style: "즉흥형",
      visited_countries: ["미국", "스페인", "태국"],
      important_factors: ["활동적인 경험", "맛있는 음식"],
      max_steps: "20,000 이상",
      accommodation_types: ["호스텔(게스트 하우스)", "잠만 잘 수 있다면 어디든 좋아요!"],
      travel_destinations: ["도시", "바다"],
      travel_types: ["액티비티", "많이 돌아다니는", "페스티벌", "미식 여행"],
      wish_countries: ["스페인"],
      ai_summary: "축제 중독 페스티벌 마니아"
    }
  },
  {
    profile: {
      id: "user-17",
      name: "박물관매니아",
      avatar_url: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "30대 초",
      mbti: "INTJ",
      self_intro: "유명 미술관과 대형 박물관에서 오디오 가이드 들으며 인문학적인 감성을 나누고 싶습니다.",
      languages: ["한국어", "영어", "프랑스어"],
      trust_score: 94,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "서울대학교"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["20대 중후반", "30대 초", "30대 중후반"],
      companion_types: ["식사", "투어", "부분"],
      planning_style: "초계획형",
      visited_countries: ["프랑스", "영국", "이탈리아", "그리스"],
      important_factors: ["휴식", "일정의 여유로움"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["도시", "소도시"],
      travel_types: ["정적인", "관광", "박물관", "갤러리"],
      wish_countries: ["프랑스"],
      ai_summary: "역사와 미술을 기록하는 아키비스트"
    }
  },
  {
    profile: {
      id: "user-18",
      name: "액티비티마스터",
      avatar_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 중후반",
      mbti: "ESTP",
      self_intro: "패러글라이딩, 서핑, 스쿠버다이빙 등 전세계 모든 짜릿한 레포츠 도장 깨기 하실 분!",
      languages: ["한국어", "영어"],
      trust_score: 89,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "흡연 (연초)",
      drinking: "즐겨 마심",
      companion_ages: ["20대 초", "20대 중후반", "30대 초"],
      companion_types: ["전 일정", "투어"],
      planning_style: "즉흥형",
      visited_countries: ["필리핀", "인도네시아", "스위스", "호주"],
      important_factors: ["활동적인 경험", "맛있는 음식"],
      max_steps: "20,000 이상",
      accommodation_types: ["호스텔(게스트 하우스)", "잠만 잘 수 있다면 어디든 좋아요!"],
      travel_destinations: ["바다", "산"],
      travel_types: ["액티비티", "많이 돌아다니는", "투어"],
      wish_countries: ["호주"],
      ai_summary: "한계에 도전하는 익스트림 스포츠 맨"
    }
  },
  {
    profile: {
      id: "user-19",
      name: "휴양조아소라",
      avatar_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 중후반",
      mbti: "ISFJ",
      self_intro: "풀빌라에서 호캉스하거나 따뜻한 해변 베드에 누워 칵테일 마시며 멍때리는 휴식 동행 구합니다.",
      languages: ["한국어", "영어"],
      trust_score: 92,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["20대 초", "20대 중후반", "30대 초"],
      companion_types: ["전 일정", "식사", "카페", "사진"],
      planning_style: "계획형",
      visited_countries: ["태국", "베트남", "괌"],
      important_factors: ["좋은 숙소", "휴식"],
      max_steps: "0 ~ 5,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["바다", "도시"],
      travel_types: ["휴양", "스파", "미식 여행"],
      wish_countries: ["태국"],
      ai_summary: "해변의 선베드를 사랑하는 쉼표 여행자"
    }
  },
  {
    profile: {
      id: "user-20",
      name: "포토그래퍼림",
      avatar_url: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 중후반",
      mbti: "INFP",
      self_intro: "필름 카메라로 여행지의 감성적인 골목과 순간을 담는 걸 좋아합니다. 예쁜 인물사진 남겨드릴게요!",
      languages: ["한국어", "영어"],
      trust_score: 95,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "배달의민족"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "사회적 음주",
      companion_ages: ["20대 초", "20대 중후반", "30대 초"],
      companion_types: ["식사", "카페", "사진", "부분"],
      planning_style: "반반형",
      visited_countries: ["일본", "대만", "이탈리아"],
      important_factors: ["멋진 사진", "맛있는 음식"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["소도시", "도시", "시골"],
      travel_types: ["카페", "관광", "갤러리"],
      wish_countries: ["이탈리아"],
      ai_summary: "뷰파인더로 세상을 엮는 예술가"
    }
  },
  {
    profile: {
      id: "user-21",
      name: "길치탈출기",
      avatar_url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 초",
      mbti: "ENFP",
      self_intro: "유쾌하고 긍정적인 파트너 구해요! 길치지만 여행 에너지는 만렙이라 즐거운 추억 보장합니다.",
      languages: ["한국어"],
      trust_score: 85,
      is_identity_verified: false,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "즐겨 마심",
      companion_ages: ["20대 초", "20대 중후반"],
      companion_types: ["전 일정", "식사", "카페"],
      planning_style: "완전 즉흥형",
      visited_countries: ["일본", "태국"],
      important_factors: ["맛있는 음식", "활동적인 경험"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["호스텔(게스트 하우스)", "에어비앤비"],
      travel_destinations: ["도시", "바다"],
      travel_types: ["카페", "액티비티", "랜드마크"],
      wish_countries: ["태국"],
      ai_summary: "길은 잃어도 흥은 잃지 않는 에너지파"
    }
  },
  {
    profile: {
      id: "user-22",
      name: "역사탐방러",
      avatar_url: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "30대 중후반",
      mbti: "ISTJ",
      self_intro: "역사 유적지와 건축물 투어를 좋아합니다. 꼼꼼하게 사전 지식 조사 후 가이드처럼 설명해드릴게요.",
      languages: ["한국어", "영어"],
      trust_score: 93,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "삼성전자"
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "비흡연",
      drinking: "마시지 않음",
      companion_ages: ["20대 중후반", "30대 초", "30대 중후반"],
      companion_types: ["투어", "식사"],
      planning_style: "초계획형",
      visited_countries: ["이탈리아", "이집트", "터키", "중국"],
      important_factors: ["일정의 여유로움", "휴식"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["호텔"],
      travel_destinations: ["도시", "소도시"],
      travel_types: ["관광", "투어", "박물관"],
      wish_countries: ["이집트"],
      ai_summary: "철저한 서칭을 즐기는 역사 가이드"
    }
  },
  {
    profile: {
      id: "user-23",
      name: "스파매니아정",
      avatar_url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "40대 초",
      mbti: "INFJ",
      self_intro: "추운 나라로 온천 여행을 가거나 따뜻한 스파 웰니스 힐링 여행 같이 가실 룸메 구합니다.",
      languages: ["한국어", "일본어"],
      trust_score: 91,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["30대 초", "30대 중후반", "40대 초", "40대 중후반"],
      companion_types: ["전 일정", "식사"],
      planning_style: "계획형",
      visited_countries: ["일본", "헝가리", "대만"],
      important_factors: ["휴식", "좋은 숙소"],
      max_steps: "5,000 ~ 10,000",
      accommodation_types: ["호텔"],
      travel_destinations: ["소도시", "시골"],
      travel_types: ["스파", "휴양", "정적인"],
      wish_countries: ["일본"],
      ai_summary: "뜨끈한 탕 속 쉼표를 사랑하는 온천 마니아"
    }
  },
  {
    profile: {
      id: "user-24",
      name: "캠퍼지니",
      avatar_url: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 초",
      mbti: "ENFP",
      self_intro: "별이 쏟아지는 밤하늘 아래 모닥불 피워놓고 감성 캠핑 즐길 메이트 찾아요!",
      languages: ["한국어"],
      trust_score: 87,
      is_identity_verified: false,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "사회적 음주",
      companion_ages: ["20대 초", "20대 중후반"],
      companion_types: ["전 일정", "식사", "사진"],
      planning_style: "반반형",
      visited_countries: ["몽골", "뉴질랜드"],
      important_factors: ["활동적인 경험", "멋진 사진"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["에어비앤비", "잠만 잘 수 있다면 어디든 좋아요!"],
      travel_destinations: ["산", "시골", "바다"],
      travel_types: ["액티비티", "페스티벌", "휴양"],
      wish_countries: ["몽골"],
      ai_summary: "오로라를 꿈꾸는 낭만 캠핑족"
    }
  },
  {
    profile: {
      id: "user-25",
      name: "갤러리큐레이터",
      avatar_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "30대 초",
      mbti: "ISFP",
      self_intro: "각 도시에 있는 감성 편집샵이나 현대미술 전시회 함께 관람하며 느긋하게 대화해요.",
      languages: ["한국어", "영어"],
      trust_score: 93,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "KAIST"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["20대 중후반", "30대 초", "30대 중후반"],
      companion_types: ["카페", "사진", "부분"],
      planning_style: "반반형",
      visited_countries: ["프랑스", "미국", "영국"],
      important_factors: ["멋진 사진", "휴식"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["도시", "소도시"],
      travel_types: ["정적인", "카페", "갤러리"],
      wish_countries: ["프랑스"],
      ai_summary: "모던 아트와 커피 한 잔의 예술주의자"
    }
  },
  {
    profile: {
      id: "user-26",
      name: "맥주공장투어러",
      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "30대 초",
      mbti: "ISTP",
      self_intro: "뮌헨 옥토버페스트나 포틀랜드 수제맥주 양조장 투어에 관심 있으신 애주가 메이트 구해요!",
      languages: ["한국어", "영어", "독일어"],
      trust_score: 92,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "다른 흡연자가 있을 때만",
      drinking: "즐겨 마심",
      companion_ages: ["20대 중후반", "30대 초", "30대 중후반"],
      companion_types: ["식사", "부분"],
      planning_style: "즉흥형",
      visited_countries: ["독일", "미국", "체코"],
      important_factors: ["맛있는 음식", "활동적인 경험"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["호스텔(게스트 하우스)", "호텔"],
      travel_destinations: ["도시", "소도시"],
      travel_types: ["미식 여행", "페스티벌", "관광"],
      wish_countries: ["독일"],
      ai_summary: "쌉싸름한 홉 향을 쫓는 브루어리 탐험가"
    }
  },
  {
    profile: {
      id: "user-27",
      name: "도시여행자키미",
      avatar_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 중후반",
      mbti: "ESTJ",
      self_intro: "뉴욕이나 런던 같은 대도시의 야경, 뮤지컬 공연 관람, 야경 루프탑 바를 정복하는 여행 스타일입니다.",
      languages: ["한국어", "영어"],
      trust_score: 94,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "연세대학교"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "사회적 음주",
      companion_ages: ["20대 중후반", "30대 초"],
      companion_types: ["전 일정", "식사", "카페", "사진"],
      planning_style: "초계획형",
      visited_countries: ["미국", "영국", "싱가포르"],
      important_factors: ["맛있는 음식", "좋은 숙소"],
      max_steps: "20,000 이상",
      accommodation_types: ["호텔"],
      travel_destinations: ["도시"],
      travel_types: ["관광", "랜드마크", "쇼핑", "갤러리"],
      wish_countries: ["미국"],
      ai_summary: "도시의 화려한 스카이라인을 사랑하는 플래너"
    }
  },
  {
    profile: {
      id: "user-28",
      name: "소도시기찻길",
      avatar_url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "20대 초",
      mbti: "ISFP",
      self_intro: "스위스 융프라우 산악열차나 유럽 골목 소도시들을 느긋하게 산책하는 로맨틱한 기차 여행 로망이 있어요.",
      languages: ["한국어", "영어"],
      trust_score: 89,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["20대 초", "20대 중후반"],
      companion_types: ["식사", "카페", "사진", "투어"],
      planning_style: "반반형",
      visited_countries: ["스위스", "이탈리아", "체코"],
      important_factors: ["멋진 사진", "휴식"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["에어비앤비", "호텔"],
      travel_destinations: ["소도시", "시골", "산"],
      travel_types: ["정적인", "휴양", "관광"],
      wish_countries: ["스위스"],
      ai_summary: "창밖 알프스 뷰를 사랑하는 기차 여행 작가"
    }
  },
  {
    profile: {
      id: "user-29",
      name: "해상레저선장",
      avatar_url: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 중후반",
      mbti: "DYNAMIC_MBTI",
      self_intro: "필리핀 보라카이에서 요트 선셋 세일링하고 스노클링 마음껏 즐기실 바다 메이트 구해요!",
      languages: ["한국어", "영어"],
      trust_score: 90,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "비흡연",
      drinking: "사회적 음주",
      companion_ages: ["20대 초", "20대 중후반", "30대 초"],
      companion_types: ["전 일정", "투어"],
      planning_style: "즉흥형",
      visited_countries: ["필리핀", "태국"],
      important_factors: ["활동적인 경험", "맛있는 음식"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["호텔", "잠만 잘 수 있다면 어디든 좋아요!"],
      travel_destinations: ["바다"],
      travel_types: ["액티비티", "투어", "휴양"],
      wish_countries: ["필리핀"],
      ai_summary: "에메랄드빛 바다 속 스노클링 챔피언"
    }
  },
  {
    profile: {
      id: "user-30",
      name: "유랑시인달팽",
      avatar_url: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600&auto=format&fit=crop",
      gender: "여자",
      age_group: "30대 중후반",
      mbti: "DYNAMIC_MBTI",
      self_intro: "관광지 도장깨기 대신 해질녘 잔디밭에 돗자리 펴고 노을 바라보며 시 한 편 읽는 쉼표를 사랑합니다.",
      languages: ["한국어"],
      trust_score: 93,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "네이버"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["20대 중후반", "30대 초", "30대 중후반", "40대 초"],
      companion_types: ["식사", "카페", "사진", "부분"],
      planning_style: "완전 즉흥형",
      visited_countries: ["프랑스", "이탈리아", "스페인"],
      important_factors: ["휴식", "일정의 여유로움"],
      max_steps: "5,000 ~ 10,000",
      accommodation_types: ["에어비앤비", "호텔"],
      travel_destinations: ["시골", "소도시", "바다"],
      travel_types: ["정적인", "휴양", "카페"],
      wish_countries: ["스페인"],
      ai_summary: "황금빛 노을 아래 돗자리를 펴는 예술가"
    }
  },
  {
    profile: {
      id: "user-31",
      name: "알프스마운틴",
      avatar_url: "https://images.unsplash.com/photo-1531219572328-a0171b4448a3?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 중후반",
      mbti: "DYNAMIC_MBTI",
      self_intro: "스위스 인터라켄에서 패러글라이딩 뛰어내리고 피르스트 하이킹 즐길 분 구해요!",
      languages: ["한국어", "영어"],
      trust_score: 94,
      is_identity_verified: true,
      is_org_verified: true,
      org_name: "삼성전자"
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "사회적 음주",
      companion_ages: ["20대 초", "20대 중후반", "30대 초"],
      companion_types: ["전 일정", "투어"],
      planning_style: "계획형",
      visited_countries: ["스위스", "독일"],
      important_factors: ["활동적인 경험", "멋진 사진"],
      max_steps: "20,000 이상",
      accommodation_types: ["호스텔(게스트 하우스)", "에어비앤비"],
      travel_destinations: ["산", "소도시"],
      travel_types: ["액티비티", "투어", "휴양"],
      wish_countries: ["스위스"],
      ai_summary: "알프스 만년설 하이킹 가이드"
    }
  }
,
  {
    profile: {
      id: "user-9",
      name: "민상",
      avatar_url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 중후반",
      mbti: "DYNAMIC_MBTI",
      self_intro: "교토의 조용하고 아기자기한 골목들을 걸어다니는 도보 여행을 좋아해요!",
      languages: ["한국어", "영어"],
      trust_score: 91,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "비흡연",
      drinking: "가끔 마심",
      companion_ages: ["20대 초", "20대 중후반"],
      companion_types: ["전 일정", "식사", "카페"],
      planning_style: "계획형",
      visited_countries: ["일본"],
      important_factors: ["맛있는 음식", "휴식"],
      max_steps: "15,000 ~ 20,000",
      accommodation_types: ["호텔", "에어비앤비"],
      travel_destinations: ["도시", "소도시"],
      travel_types: ["카페", "랜드마크", "관광"],
      wish_countries: ["일본"],
      ai_summary: "교토 골목길을 사랑하는 산책자"
    }
  },
  {
    profile: {
      id: "user-10",
      name: "생기있는윌리58",
      avatar_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 중후반",
      mbti: "DYNAMIC_MBTI",
      self_intro: "자연 경관이 멋진 곳으로 등산이나 캠핑 떠나는 여행을 선호합니다!",
      languages: ["한국어", "영어"],
      trust_score: 93,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행이 예정되어있어요",
      smoking: "비흡연",
      drinking: "사회적 음주",
      companion_ages: ["20대 중후반", "30대 초"],
      companion_types: ["전 일정", "투어"],
      planning_style: "반반형",
      visited_countries: ["미국", "캐나다"],
      important_factors: ["활동적인 경험", "멋진 사진"],
      max_steps: "20,000 이상",
      accommodation_types: ["에어비앤비", "호스텔(게스트 하우스)"],
      travel_destinations: ["산", "바다"],
      travel_types: ["액티비티", "투어"],
      wish_countries: ["미국"],
      ai_summary: "자연을 찾아 떠나는 등산 애호가"
    }
  },
  {
    profile: {
      id: "user-11",
      name: "성급한위고7",
      avatar_url: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?w=600&auto=format&fit=crop",
      gender: "남자",
      age_group: "20대 초",
      mbti: "DYNAMIC_MBTI",
      self_intro: "기차 타고 시골이나 소도시로 정처없이 돌아다니는 즉흥 여행을 좋아해요.",
      languages: ["한국어"],
      trust_score: 87,
      is_identity_verified: true,
      is_org_verified: false
    },
    preferences: {
      travel_status: "여행을 같이 계획하고 싶어요",
      smoking: "흡연 (전자담배)",
      drinking: "사회적 음주",
      companion_ages: ["20대 초", "20대 중후반"],
      companion_types: ["식사", "카페", "사진"],
      planning_style: "즉흥형",
      visited_countries: ["일본", "대만"],
      important_factors: ["맛있는 음식", "일정의 여유로움"],
      max_steps: "10,000 ~ 15,000",
      accommodation_types: ["잠만 잘 수 있다면 어디든 좋아요!"],
      travel_destinations: ["시골", "소도시"],
      travel_types: ["정적인", "휴양", "카페"],
      wish_countries: ["대만"],
      ai_summary: "정처없이 떠나는 즉흥 기차 여행자"
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
  let categories = 0;
  let matches = 0;

  // 1. Planning style
  if (myPref.planning_style && otherPref.planning_style) {
    categories++;
    if (myPref.planning_style === otherPref.planning_style) {
      matches += 1.0;
    } else {
      const styles = ["초계획형", "계획형", "반반형", "즉흥형", "완전 즉흥형"];
      const diff = Math.abs(styles.indexOf(myPref.planning_style) - styles.indexOf(otherPref.planning_style));
      if (diff === 1) matches += 0.5;
    }
  }

  // 2. Smoking
  if (myPref.smoking && otherPref.smoking) {
    categories++;
    if (myPref.smoking === otherPref.smoking) {
      matches += 1.0;
    } else if (myPref.smoking === "비흡연" && otherPref.smoking.includes("흡연")) {
      // severe mismatch, don't add score
    } else if (myPref.smoking.includes("흡연") && otherPref.smoking.includes("흡연")) {
      matches += 0.8;
    }
  }

  // 3. Drinking
  if (myPref.drinking && otherPref.drinking) {
    categories++;
    if (myPref.drinking === otherPref.drinking) {
      matches += 1.0;
    } else if (myPref.drinking !== "마시지 않음" && otherPref.drinking !== "마시지 않음") {
      matches += 0.5;
    }
  }

  // 4. Max steps
  if (myPref.max_steps && otherPref.max_steps) {
    categories++;
    if (myPref.max_steps === otherPref.max_steps) {
      matches += 1.0;
    }
  }

  // 5. Travel Destinations (Terrains)
  if (myPref.travel_destinations && otherPref.travel_destinations && otherPref.travel_destinations.length > 0) {
    categories++;
    const overlap = otherPref.travel_destinations.filter(x => myPref.travel_destinations.includes(x)).length;
    matches += overlap / otherPref.travel_destinations.length;
  }

  // 6. Travel Types
  if (myPref.travel_types && otherPref.travel_types && otherPref.travel_types.length > 0) {
    categories++;
    const overlap = otherPref.travel_types.filter(x => myPref.travel_types.includes(x)).length;
    matches += overlap / otherPref.travel_types.length;
  }

  // 7. Companion Ages
  if (myPref.companion_ages && otherPref.companion_ages && otherPref.companion_ages.length > 0) {
    categories++;
    const overlap = otherPref.companion_ages.filter(x => myPref.companion_ages.includes(x)).length;
    matches += overlap / otherPref.companion_ages.length;
  }

  // 8. Companion Types
  if (myPref.companion_types && otherPref.companion_types && otherPref.companion_types.length > 0) {
    categories++;
    const overlap = otherPref.companion_types.filter(x => myPref.companion_types.includes(x)).length;
    matches += overlap / otherPref.companion_types.length;
  }

  // 9. Visited Countries
  if (myPref.visited_countries && otherPref.visited_countries && otherPref.visited_countries.length > 0 && myPref.visited_countries.length > 0) {
    categories++;
    const overlap = otherPref.visited_countries.filter(x => myPref.visited_countries.includes(x)).length;
    matches += overlap / otherPref.visited_countries.length;
  }

  // 10. Important Factors
  if (myPref.important_factors && otherPref.important_factors && otherPref.important_factors.length > 0) {
    categories++;
    const overlap = otherPref.important_factors.filter(x => myPref.important_factors.includes(x)).length;
    matches += overlap / otherPref.important_factors.length;
  }

  // 11. Accommodation Types
  if (myPref.accommodation_types && otherPref.accommodation_types && otherPref.accommodation_types.length > 0) {
    categories++;
    const overlap = otherPref.accommodation_types.filter(x => myPref.accommodation_types.includes(x)).length;
    matches += overlap / otherPref.accommodation_types.length;
  }

  // 12. Wish Countries
  const myWish = myPref.wish_countries;
  if (myWish && otherPref.wish_countries && otherPref.wish_countries.length > 0 && myWish.length > 0) {
    categories++;
    const overlap = otherPref.wish_countries.filter(x => myWish.includes(x)).length;
    matches += overlap / otherPref.wish_countries.length;
  }

  // 13. MBTI Chemistry
  if (myMbti && otherMbti) {
    categories++;
    let mbtiScore = 0;
    const myE = myMbti[0] === "E";
    const otherE = otherMbti[0] === "E";
    const myP = myMbti[3] === "P";
    const otherP = otherMbti[3] === "P";

    if (myE !== otherE) mbtiScore += 0.5; // Opposites attract
    if (myP === otherP) mbtiScore += 0.5; // Planning compatibility
    matches += mbtiScore;
  }

  if (categories === 0) return 50;
  const ratio = matches / categories;
  // Map ratio [0, 1] to match percentage [45, 99]
  return Math.round(45 + ratio * 54);
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

    if (supabase) {
      supabase
        .from("profiles")
        .upsert({
          id: profile.id,
          name: profile.name,
          avatar_url: profile.avatar_url,
          gender: profile.gender,
          age_group: profile.age_group,
          mbti: profile.mbti,
          self_intro: profile.self_intro,
          languages: profile.languages,
          trust_score: profile.trust_score,
          is_identity_verified: profile.is_identity_verified,
          is_org_verified: profile.is_org_verified,
          org_name: profile.org_name
        })
        .then(({ error }) => {
          if (error) console.error("Error saving profile to Supabase:", error);
        });
    }
  },

  getPreferences(): TravelPreferences | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return data ? JSON.parse(data) : null;
  },

  savePreferences(pref: TravelPreferences): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(pref));

    if (supabase) {
      const profile = this.getProfile();
      if (profile) {
        supabase
          .from("travel_preferences")
          .upsert({
            profile_id: profile.id,
            travel_status: pref.travel_status,
            smoking: pref.smoking,
            drinking: pref.drinking,
            companion_ages: pref.companion_ages,
            companion_types: pref.companion_types,
            planning_style: pref.planning_style,
            visited_countries: pref.visited_countries,
            important_factors: pref.important_factors,
            max_steps: pref.max_steps,
            accommodation_types: pref.accommodation_types,
            travel_destinations: pref.travel_destinations,
            travel_types: pref.travel_types,
            ai_summary: pref.ai_summary,
            ai_details: pref.ai_details
          })
          .then(({ error }) => {
            if (error) console.error("Error saving preferences to Supabase:", error);
          });
      }
    }
  },

  getMockUsersWithScores(): MockUser[] {
    const userPref = this.getPreferences();
    const userProfile = this.getProfile();
    
    const myMbti = userProfile?.mbti || "ENFP";
    const mappedMocks = INITIAL_MOCK_USERS.map(mock => {
      const updatedMbti = mock.profile.mbti === "DYNAMIC_MBTI" ? myMbti : mock.profile.mbti;
      return {
        ...mock,
        profile: {
          ...mock.profile,
          mbti: updatedMbti
        }
      };
    });

    if (!userPref) return mappedMocks;

    return mappedMocks.map(mock => {
      const matchPct = calculateMatchPercentage(
        userPref,
        mock.preferences,
        myMbti,
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
  },  getMatches(): any[] {
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

    const newRoomId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });

    const newRoom = {
      id: newRoomId,
      participants: [profile.id, partnerId],
      created_at: new Date().toISOString()
    };

    rooms.push(newRoom);
    localStorage.setItem(STORAGE_KEYS.CHAT_ROOMS, JSON.stringify(rooms));

    // Supabase write
    if (supabase) {
      const client = supabase; // Capture non-nullable client
      const partner = INITIAL_MOCK_USERS.find(u => u.profile.id === partnerId);
      
      const insertProfilesAndRoom = async () => {
        try {
          // Upsert profiles to prevent foreign key violation
          await client.from("profiles").upsert({
            id: profile.id,
            name: profile.name,
            avatar_url: profile.avatar_url,
            gender: profile.gender,
            age_group: profile.age_group,
            mbti: profile.mbti,
            self_intro: profile.self_intro,
            languages: profile.languages,
            trust_score: profile.trust_score,
            is_identity_verified: profile.is_identity_verified,
            is_org_verified: profile.is_org_verified,
            org_name: profile.org_name
          });

          if (partner) {
            await client.from("profiles").upsert({
              id: partner.profile.id,
              name: partner.profile.name,
              avatar_url: partner.profile.avatar_url,
              gender: partner.profile.gender,
              age_group: partner.profile.age_group,
              mbti: partner.profile.mbti,
              self_intro: partner.profile.self_intro,
              languages: partner.profile.languages,
              trust_score: partner.profile.trust_score,
              is_identity_verified: partner.profile.is_identity_verified,
              is_org_verified: partner.profile.is_org_verified,
              org_name: partner.profile.org_name
            });
          }

          // Insert room
          const { error: rError } = await client.from("chat_rooms").insert({
            id: newRoomId,
            created_at: newRoom.created_at
          });

          if (!rError) {
            // Insert participants
            await client.from("chat_participants").insert([
              { room_id: newRoomId, profile_id: profile.id },
              { room_id: newRoomId, profile_id: partnerId }
            ]);
          }
        } catch (err) {
          console.error("Supabase insertProfilesAndRoom failed:", err);
        }
      };

      insertProfilesAndRoom();
    }

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

    // Supabase write
    if (supabase) {
      supabase.from("chat_rooms").delete().eq("id", roomId).then(({ error }) => {
        if (error) console.error("Error deleting room from Supabase:", error);
      });
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

    const newMsgId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });

    const newMsg = {
      id: newMsgId,
      room_id: roomId,
      sender_id: profile.id,
      message: messageText,
      created_at: new Date().toISOString()
    };

    allMsgs.push(newMsg);
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(allMsgs));

    // Supabase write
    if (supabase) {
      supabase
        .from("chat_messages")
        .insert({
          id: newMsgId,
          room_id: roomId,
          sender_id: profile.id,
          message: messageText,
          created_at: newMsg.created_at
        })
        .then(({ error }) => {
          if (error) console.error("Error saving chat message to Supabase:", error);
        });
    }

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

        const partnerMsgId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
          ? crypto.randomUUID() 
          : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            });

        const partnerMsg = {
          id: partnerMsgId,
          room_id: roomId,
          sender_id: partnerId,
          message: replyText,
          created_at: new Date().toISOString()
        };

        allMsgs.push(partnerMsg);
        localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(allMsgs));

        // Supabase write
        if (supabase) {
          supabase
            .from("chat_messages")
            .insert({
              id: partnerMsgId,
              room_id: roomId,
              sender_id: partnerId,
              message: replyText,
              created_at: partnerMsg.created_at
            })
            .then(({ error }) => {
              if (error) console.error("Error saving AI reply to Supabase:", error);
            });
        }

        // Custom Event to notify react pages to refresh messages instantly
        window.dispatchEvent(new CustomEvent("synctrip_new_message", { detail: { roomId } }));
      }
    } catch (err) {
      console.error("Failed to generate AI auto reply", err);
    }
  },

  receiveIncomingChatRequest(): any {
    if (typeof window === "undefined") return null;
    const profile = this.getProfile();
    if (!profile) return null;

    // Pick a random mock user who we don't have an active chat room with
    const rooms = this.getChatRooms();
    const activePartnerIds = rooms.map(r => r.partner?.id);
    const potentialPartners = INITIAL_MOCK_USERS.filter(u => !activePartnerIds.includes(u.profile.id));
    if (potentialPartners.length === 0) return null;

    const randomUser = potentialPartners[Math.floor(Math.random() * potentialPartners.length)];
    
    // Create the chat room
    const roomId = this.createChatRoom(randomUser.profile.id);

    // Write a first greeting message from the random user
    const firstMessages = [
      "안녕하세요! 프로필 보다가 성향이 너무 잘 맞으시는 것 같아서 인사드려요! 😊",
      "반가워요! 이번에 여행 계획하시는 국가가 저랑 겹쳐서 그런데, 같이 일정 짜보실래요?",
      "안녕하세요~ 혹시 여행 일정 중에 카페 투어나 맛집 탐방 같이하실 생각 있으신가요? ☕",
      "반갑습니다! 저랑 매칭률이 되게 높게 뜨셔서 신기해서 메시지 드려요 ㅎㅎ",
      "안녕하세요! 혹시 이번에 가시는 여행지에 숙소나 교통편은 다 정하셨나요?"
    ];
    const greetingText = firstMessages[Math.floor(Math.random() * firstMessages.length)];

    const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    const allMsgs = data ? JSON.parse(data) : [];

    const partnerMsgId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
      ? crypto.randomUUID() 
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });

    const partnerMsg = {
      id: partnerMsgId,
      room_id: roomId,
      sender_id: randomUser.profile.id,
      message: greetingText,
      created_at: new Date().toISOString()
    };

    allMsgs.push(partnerMsg);
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(allMsgs));

    // Supabase write
    if (supabase) {
      supabase
        .from("chat_messages")
        .insert({
          id: partnerMsgId,
          room_id: roomId,
          sender_id: randomUser.profile.id,
          message: greetingText,
          created_at: partnerMsg.created_at
        })
        .then(({ error }) => {
          if (error) console.error("Error saving incoming greeting message to Supabase:", error);
        });
    }

    // Dispatch a global custom event to notify components that a new message arrived
    window.dispatchEvent(new CustomEvent("synctrip_new_message", {
      detail: { 
        roomId, 
        incoming: true, 
        partnerName: randomUser.profile.name, 
        partnerAvatar: randomUser.profile.avatar_url,
        message: greetingText
      }
    }));

    return {
      roomId,
      partner: randomUser.profile,
      message: greetingText
    };
  },

  async syncWithSupabase() {
    if (typeof window === "undefined" || !supabase) return;
    const profile = this.getProfile();
    if (!profile) return;

    try {
      // 1. Sync User Profile
      const { data: dbProfile, error: pError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .single();
        
      if (dbProfile) {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(dbProfile));
      }
      
      // 2. Sync Preferences
      const { data: dbPref, error: prError } = await supabase
        .from("travel_preferences")
        .select("*")
        .eq("profile_id", profile.id)
        .single();
        
      if (dbPref) {
        const mappedPref = {
          travel_status: dbPref.travel_status,
          smoking: dbPref.smoking,
          drinking: dbPref.drinking,
          companion_ages: dbPref.companion_ages,
          companion_types: dbPref.companion_types,
          planning_style: dbPref.planning_style,
          visited_countries: dbPref.visited_countries,
          important_factors: dbPref.important_factors,
          max_steps: dbPref.max_steps,
          accommodation_types: dbPref.accommodation_types,
          travel_destinations: dbPref.travel_destinations,
          travel_types: dbPref.travel_types,
          ai_summary: dbPref.ai_summary,
          ai_details: dbPref.ai_details
        };
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(mappedPref));
      }

      // 3. Sync Chat history (rooms & messages)
      await this.syncChatWithSupabase();
    } catch (err) {
      console.error("Supabase sync failed:", err);
    }
  },

  async syncChatWithSupabase() {
    if (typeof window === "undefined" || !supabase) return;
    const profile = this.getProfile();
    if (!profile) return;

    try {
      const { data: participants, error: partError } = await supabase
        .from("chat_participants")
        .select("room_id")
        .eq("profile_id", profile.id);

      if (partError || !participants) return;
      const roomIds = participants.map(p => p.room_id);
      if (roomIds.length === 0) return;

      const { data: allParts, error: allPartError } = await supabase
        .from("chat_participants")
        .select("room_id, profile_id")
        .in("room_id", roomIds);

      if (allPartError || !allParts) return;

      const participantsByRoom: { [key: string]: string[] } = {};
      allParts.forEach(p => {
        if (!participantsByRoom[p.room_id]) {
          participantsByRoom[p.room_id] = [];
        }
        participantsByRoom[p.room_id].push(p.profile_id);
      });

      const { data: dbRooms, error: roomError } = await supabase
        .from("chat_rooms")
        .select("*")
        .in("id", roomIds);

      if (roomError || !dbRooms) return;

      const localRooms = dbRooms.map(r => ({
        id: r.id,
        participants: participantsByRoom[r.id] || [],
        created_at: r.created_at
      }));
      localStorage.setItem(STORAGE_KEYS.CHAT_ROOMS, JSON.stringify(localRooms));

      const { data: dbMessages, error: msgError } = await supabase
        .from("chat_messages")
        .select("*")
        .in("room_id", roomIds);

      if (msgError || !dbMessages) return;

      const localMsgs = dbMessages.map(m => ({
        id: m.id,
        room_id: m.room_id,
        sender_id: m.sender_id,
        message: m.message,
        created_at: m.created_at
      }));
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(localMsgs));
      
      window.dispatchEvent(new CustomEvent("synctrip_new_message", { detail: { roomId: "all" } }));
    } catch (err) {
      console.error("Failed to sync chats with Supabase:", err);
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
