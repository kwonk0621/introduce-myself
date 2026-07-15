import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, gender, age_group, mbti, preferences } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Default mock response generator for quick fallbacks
    const generateMockReport = () => {
      let character = "자유로운 영혼의 모험가";
      let description = "계획에 얽매이지 않고 발길 닿는 대로 움직이며 여행지 특유의 여유로운 감성을 만끽하는 여행자입니다.";
      let tips = [
        "일정을 빽빽하게 채우기보다 매일 1-2곳의 랜드마크만 지정하고 남은 시간은 골목 탐방에 써보세요.",
        "식사나 카페는 웨이팅이 길고 유명한 곳보다 구글 지도 평점이 좋은 현지 노포를 탐방해 보는걸 추천합니다.",
        "성향이 다른 계획형 동행과 다닐 때는 주요 동선 한두 개 정도는 미리 합의하는 배려가 필요합니다."
      ];

      // Customizing based on input data
      if (preferences.planning_style === "초계획형" || preferences.planning_style === "계획형") {
        character = "철두철미한 인간 내비게이션";
        description = "여행지의 동선, 맛집, 예산 계획을 꼼꼼하게 짜두어 버리는 시간 없이 알차고 효율적인 일정을 추구하는 여행자입니다.";
        tips = [
          "계획에 없는 돌발 상황도 여행의 일부로 유연하게 넘길 수 있는 여유를 가져보세요.",
          "맛집 예약이나 대중교통 티켓 등은 미리 예매하여 여행지의 웨이팅 시간을 최소화하세요.",
          "즉흥적인 성향의 동행과 매칭되었다면 오전 일정은 함께 짜고, 오후는 자유 동선으로 움직여 보세요."
        ];
      } else if (preferences.important_factors?.includes("맛있는 음식")) {
        character = "삼시세끼 미식 탐험가";
        description = "여행의 가장 큰 목적은 먹는 즐거움! 현지 시장부터 파인다이닝까지 다양한 식문화를 맛보는 데 집중하는 미식 여행자입니다.";
        tips = [
          "식사 동선이 꼬이지 않도록 가고 싶은 식당의 브레이크 타임과 정기 휴무일을 꼭 미리 확인하세요.",
          "현지 길거리 음식이나 시장을 방문할 때는 소화제 등 비상약을 챙기는 것을 잊지 마세요.",
          "미식 취향이 비슷한 동행을 구하면 여러 메뉴를 시켜서 나누어 먹기 좋습니다."
        ];
      } else if (preferences.max_steps === "20,000 이상") {
        character = "강철 체력의 뚜벅이 방랑자";
        description = "대중교통보다 두 발로 직접 걸어 다니며 구석구석 숨겨진 명소를 온몸으로 체감하는 강한 에너지를 지닌 여행자입니다.";
        tips = [
          "하루 2만 보 이상의 활동량을 커버하기 위해 무엇보다 편하고 쿠션감이 좋은 워킹화를 신으세요.",
          "중간중간 수분 섭취를 자주 하고, 카페 투어나 스파 등을 일정 중간에 넣어 피로를 풀어주세요.",
          "체력 조건이 비슷하게 뛰어난 동행과 함께 다녀야 서로 지치지 않고 즐겁게 완주할 수 있습니다."
        ];
      } else if (mbti) {
        if (mbti.startsWith("I")) {
          character = "조용하고 한적한 힐링 마스터";
          description = "사람이 붐비는 시끄러운 관광지 대신 조용한 동네 골목이나 오션 뷰 숙소에서 푹 쉬며 에너지를 충전하는 것을 좋아하는 힐러입니다.";
          tips = [
            "관광 명소 방문은 이른 아침 시간을 활용해 한적하게 감상하고 오세요.",
            "전망이 좋은 아늑한 북카페나 독채 에어비앤비 숙소 예약을 우선적으로 고려해 보세요.",
            "지나치게 에너지가 넘치거나 매 순간 대화를 원하는 동행보다는 서로 침묵이 편안한 동행을 구하세요."
          ];
        }
      }

      return { character, description, tips };
    };

    // If Gemini API Key is available, fetch real AI propensity report
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
당신은 전문 여행 성향 분석가입니다. 아래 여행자의 프로필 정보와 라이프스타일/여행스타일 설문 답변을 기반으로, 이 사용자의 여행 성향 페르소나를 도출하고 맞춤 분석 리포트를 작성해야 합니다.

사용자 기본 정보:
- 이름: ${name}
- 성별: ${gender}
- 연령대: ${age_group}
- MBTI: ${mbti}

여행 성향 설문 정보:
- 여행 상태: ${preferences.travel_status}
- 흡연 여부: ${preferences.smoking}
- 음주 여부: ${preferences.drinking}
- 원하는 동행 유형: ${preferences.companion_types?.join(", ")}
- 원하는 동행 연령대: ${preferences.companion_ages?.join(", ")}
- 계획 스타일: ${preferences.planning_style}
- 선호하는 숙소 타입: ${preferences.accommodation_types?.join(", ")}
- 여행에서 중요한 요소: ${preferences.important_factors?.join(", ")}
- 하루 최대 걸음 수: ${preferences.max_steps}
- 선호 여행 테마: ${preferences.travel_destinations?.join(", ")}
- 추구하는 여행 타입: ${preferences.travel_types?.join(", ")}

결과는 반드시 한국어로 작성하고 아래의 JSON 구조만 반환해 주세요. (마크다운 백틱없이 순수 JSON만 반환해야 합니다.)
{
  "character": "사용자의 성향을 8글자 내외로 정의한 개성있고 세련된 타이틀 (예: '철두철미한 인간 내비게이션')",
  "description": "사용자의 여행 스타일을 심층 분석한 설명 (2~3문장, 친근하면서도 전문적인 톤)",
  "tips": [
    "사용자에게 꼭 필요한 실질적인 맞춤형 여행 팁 1",
    "사용자에게 꼭 필요한 실질적인 맞춤형 여행 팁 2",
    "사용자에게 꼭 필요한 실질적인 맞춤형 여행 팁 3"
  ]
}
`;

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        });

        const textResponse = result.response.text();
        const jsonResponse = JSON.parse(textResponse.trim());
        return NextResponse.json(jsonResponse);
      } catch (aiError) {
        console.error("Gemini API Error, falling back to mock:", aiError);
        return NextResponse.json(generateMockReport());
      }
    } else {
      // Fallback if no API key is configured
      return NextResponse.json(generateMockReport());
    }
  } catch (error) {
    console.error("Server Route Error:", error);
    return NextResponse.json({ error: "성향 분석 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
