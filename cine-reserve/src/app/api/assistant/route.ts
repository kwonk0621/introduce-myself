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
    // 1. Optimize Context Size for Groq Free-Tier 12,000 TPM Limit
    // ────────────────────────────────────────────────────────────
    
    // Movie list compaction
    const moviesContext = mockMovies.map(m => `
- ${m.title}: ${m.status === 'now-showing' ? '상영중' : '상영예정'} | 평점: ${m.rating} | ${m.ageLimit === 0 ? '전체관람가' : m.ageLimit + '세'} | ${m.runtime}분 | 장르: ${m.genre?.join(',')} | 감독: ${m.director}
`).join('\n');

    const theatersContext = mockTheaters.map(t => `- ${t.name} (${t.location})`).join('\n');

    // Filter schedules to only today and the next 2 days to drastically reduce token usage
    const todayStr = new Date().toISOString().split('T')[0];
    const allowedDates = Array.from({ length: 3 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });

    const schedulesContext = mockSchedules
      .filter(s => allowedDates.includes(s.date))
      .map(s => {
        const movie = mockMovies.find(m => m.id === s.movieId);
        const theater = mockTheaters.find(t => t.id === s.theaterId);
        const timesStr = s.times.map(t => `${t.time}(${t.hallName})`).join(', ');
        return `[${s.date}] ${theater?.name || s.theaterId} | ${movie?.title || s.movieId} | ${s.screenType} | 시간표: ${timesStr}`;
      }).join('\n');

    const paymentInfo = `
- 가격: 성인 10,000원, 청소년 8,000원, 우대 7,000원, 경로 6,000원
- 결제수단: 신용카드, 카카오페이, 네이버페이, 토스페이, 휴대폰 소액결제
`;

    // ────────────────────────────────────────────────────────────
    // 2. Prepare Prompts
    // ────────────────────────────────────────────────────────────
    const systemPrompt = `
당신은 CGV 영화 예매 서비스 "CineReserve"의 인공지능 도우미 "시네봇"입니다.
아래 영화 리포트, 극장, 상영시간표, 요금 안내 정보를 바탕으로 고객의 질문에 친근하고 명확하게 존댓말로 답변해 주세요.

[상영 영화]
${moviesContext}

[극장 지점]
${theatersContext}

[상영 시간표 (최근 3일)]
${schedulesContext}

[요금 및 결제]
${paymentInfo}

[규칙]
1. 이름은 "시네봇"입니다. 대화는 친근하게 이모지("🎬", "😊")를 섞어 존댓말로 답변해 주세요.
2. 질문에 부합하는 영화 시간표를 안내할 때는 날짜, 상영관(예: 2D, IMAX관), 상영시간대를 대조하여 정확히 알려주세요.
3. 예매를 하려면 앱 하단의 '예매' 메뉴로 갈 수 있음을 안내해 주세요.
4. Groq API 무료 티어 한계(TPM 제한)에 따른 응답 지연을 피하기 위해, 핵심 내용 위주로 매우 간결하게 3문장 이내로만 응답하세요.
`;

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
      max_tokens: 512
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
    const replyText = data.choices?.[0]?.message?.content || '죄송해요. 답변을 생성하지 못했어요. 다시 말씀해 주시겠어요?';

    return NextResponse.json({ reply: replyText });

  } catch (err: any) {
    console.error('API Assistant error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
