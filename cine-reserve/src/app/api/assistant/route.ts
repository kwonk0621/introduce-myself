import { NextResponse } from 'next/server';
import { mockMovies, mockTheaters, mockSchedules } from '@/data/mockMovies';

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Groq API Key is not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages payload' }, { status: 400 });
    }

    // ────────────────────────────────────────────────────────────
    // 1. Prepare Movie Booking Context for System Prompt
    // ────────────────────────────────────────────────────────────
    const moviesContext = mockMovies.map(m => `
- 영화명: ${m.title} (${m.englishTitle || ''})
  - 상태: ${m.status === 'now-showing' ? '현재 상영중' : '상영 예정'}
  - 평점: ${m.rating} | 연령제한: ${m.ageLimit === 0 ? '전체관람가' : m.ageLimit + '세 이상 관람가'}
  - 러닝타임: ${m.runtime}분 | 감독: ${m.director || '미상'}
  - 출연진: ${m.cast?.join(', ') || '미상'}
  - 장르: ${m.genre?.join(', ') || '미상'}
  - 줄거리: ${m.synopsis || '정보 없음'}
`).join('\n');

    const theatersContext = mockTheaters.map(t => `
- 극장 지점명: ${t.name} (${t.location})
`).join('\n');

    const schedulesContext = mockSchedules.map(s => {
      const movie = mockMovies.find(m => m.id === s.movieId);
      const theater = mockTheaters.find(t => t.id === s.theaterId);
      const timesStr = s.times.map(t => `${t.time} ~ ${t.endTime} (${t.hallName})`).join(', ');
      return `
- 날짜: ${s.date} | 극장: ${theater?.name || s.theaterId} | 영화: ${movie?.title || s.movieId}
  - 상영관 종류: ${s.screenType}
  - 상영 시간대: ${timesStr}
`;
    }).join('\n');

    const paymentInfo = `
- 티켓 가격 요금제 (인당):
  - 일반 성인: 10,000원
  - 청소년 (만 18세 이하): 8,000원
  - 우대 (장애인/국가유공자): 7,000원
  - 경로 (만 65세 이상): 6,000원
- 결제 수단:
  - 신용카드 / 체크카드
  - 카카오페이 (Kakaopay)
  - 네이버페이 (Naverpay)
  - 토스페이 (Tosspay)
  - 휴대폰 소액결제
`;

    // ────────────────────────────────────────────────────────────
    // 2. Formulate System Instruction Prompt
    // ────────────────────────────────────────────────────────────
    const systemPrompt = `
당신은 CGV 영화 예매 서비스 "CineReserve"의 인공지능 매표소 도우미 "시네봇 (CineBot)"입니다.
아래의 실시간 극장, 상영관, 상영시간표, 영화 리포트 및 예매/결제 안내 정보를 바탕으로 고객의 질문에 대단히 친근하고 전문적으로 답변해 주세요.

[상영 영화 정보]
${moviesContext}

[극장 지점 정보]
${theatersContext}

[상영 스케줄 및 시간표 정보]
${schedulesContext}

[요금제 및 결제 방식 정보]
${paymentInfo}

[답변 작성 규칙]
1. 당신의 이름은 "시네봇"입니다. 영화 추천, 극장 위치 안내, 가격 문의, 상영 시간표 대조에 이르기까지 구체적으로 친절하게 안내하세요.
2. 사용자가 상영 시간표를 물어볼 경우, 위의 [상영 스케줄 및 시간표 정보]를 기반으로 일치하는 정확한 일시와 상영관(예: IMAX관, 1관) 및 시작/종료 시각을 꼼꼼하게 알려주세요. 만약 스케줄이 존재하지 않는 극장/날짜라면 상냥하게 다른 상영 시간이나 근처 지점을 추천해 주세요.
3. 구어체 존댓말("~해요", "~입니다!", "😊", "🎬")을 활용하여 밝고 유쾌한 매표소 도우미의 톤을 유지하세요.
4. 예매를 유도하는 멘트를 자연스럽게 덧붙여 주세요. (예: "원하시는 시간대를 고르셨다면 하단의 '예매' 탭에서 좌석을 예매해 드릴까요?")
5. 사용자의 질문에만 간결하게 핵심 위주로 응답하세요. (답변은 최대 4문장 이내)
`;

    // ────────────────────────────────────────────────────────────
    // 3. Request Groq Chat Completion (OpenAI API Compatible)
    // ────────────────────────────────────────────────────────────
    const groqPayload = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role,
          content: m.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 1024
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(groqPayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API response error:', errText);
      return NextResponse.json({ error: 'Failed to communicate with Groq API' }, { status: response.status });
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || '죄송해요. 일시적인 오류로 답변을 생성하지 못했어요. 다시 말씀해 주시겠어요?';

    return NextResponse.json({ reply: replyText });

  } catch (err: any) {
    console.error('API Assistant error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
