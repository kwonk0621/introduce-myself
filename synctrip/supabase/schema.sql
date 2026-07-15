-- SyncTrip Database Schema (PostgreSQL for Supabase)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    gender VARCHAR(10),
    age_group VARCHAR(20),
    mbti VARCHAR(4),
    self_intro TEXT,
    languages TEXT[], -- 구사 가능한 언어
    trust_score INT DEFAULT 80, -- 신뢰도 점수 (기본 80점)
    is_identity_verified BOOLEAN DEFAULT FALSE, -- 본인인증 여부
    is_org_verified BOOLEAN DEFAULT FALSE, -- 직장/학교 인증 여부
    org_name VARCHAR(100), -- 인증된 직장/학교명
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Travel Preferences (성향 정보)
CREATE TABLE IF NOT EXISTS public.travel_preferences (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    travel_status VARCHAR(50), -- 여행 상태 (지금 여행중, 예정됨, 같이 계획 등)
    smoking VARCHAR(50), -- 흡연 여부
    drinking VARCHAR(50), -- 음주 여부
    companion_ages TEXT[], -- 희망 동행 연령대
    companion_types TEXT[], -- 찾고 있는 동행 종류 (식사, 카페, 전일정 등)
    planning_style VARCHAR(50), -- 계획 스타일 (초계획형, 즉흥형 등)
    visited_countries TEXT[], -- 다녀온 나라
    important_factors TEXT[], -- 여행에서 중요한 것 (숙소, 음식, 사진 등)
    max_steps VARCHAR(50), -- 하루 최대 걸음 수
    accommodation_types TEXT[], -- 선호 숙소 타입
    travel_destinations TEXT[], -- 선호하는 여행지 테마 (산, 바다, 도시 등)
    travel_types TEXT[], -- 추구하는 여행 타입 (액티비티, 휴양, 쇼핑 등)
    ai_summary TEXT, -- AI가 요약한 여행자 한줄평
    ai_details JSONB, -- AI 여행 성향 분석 레포트 상세
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Chat Rooms (채팅방)
CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Chat Room Participants (채팅 참여자)
CREATE TABLE IF NOT EXISTS public.chat_participants (
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (room_id, profile_id)
);

-- 5. Chat Messages (채팅 메시지)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Companions / Matches (동행 매칭 관계)
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_match_pair UNIQUE (requester_id, receiver_id)
);
