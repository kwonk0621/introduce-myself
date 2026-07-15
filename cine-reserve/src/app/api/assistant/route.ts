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
    // 1. Extreme Compactness for Llama 3 Korean Tokenizer (Limit 12,000 TPM)
    // ────────────────────────────────────────────────────────────
    
    // Movie details: Extremely compact
    const moviesContext = mockMovies
      .map(m => `- ${m.title}(${m.status === 'now-showing' ? '상영중' : '예정'}, ${m.ageLimit === 0 ? '전체' : m.ageLimit + '세'}, ${m.runtime}분)`)
      .join('\n');

    const theatersContext = mockTheaters.map(t => `- ${t.name}`).join('\n');

    // Limit schedules to today and tomorrow (2 days)
    const allowedDates = Array.from({ length: 2 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });

    const schedulesContext = mockSchedules
      .filter(s => allowedDates.includes(s.date))
      .map(s => {
        const movie = mockMovies.find(m => m.id === s.movieId);
        const theater = mockTheaters.find(t => t.id === s.theaterId);
        const timesStr = s.times.map(t => `${t.time}(${t.hallName.replace('관', '')})`).join(',');
        const dayStr = s.date.split('-')[2]; // e.g. "15"
        const thShort = theater?.name.substring(0, 2) || '';
        return `${dayStr}일 ${thShort} ${movie?.title}(${s.screenType}): ${timesStr}`;
      }).join('\n');

    const paymentInfo = `
- 요금: 성인 1만, 청소년 8천, 우대 7천, 경로 6천원
- 결제: 신용카드, 카카오페이, 네이버페이, 토스페이, 휴대폰
`;

    // ────────────────────────────────────────────────────────────
    // 2. Prepare Prompts
    // ────────────────────────────────────────────────────────────
    const systemPrompt = `
당신은 CGV 예매 도우미 "시네봇"입니다. 존댓말로 짧고 친근하게 답변해 주세요.

[상영 영화]
${moviesContext}

[극장 지점]
${theatersContext}

[상영 스케줄 (오늘/내일)]
${schedulesContext}

[요금/결제]
${paymentInfo}

[규칙]
1. 이름은 "시네봇"입니다. 대화는 친절하게 이모지("🎬", "😊")를 섞어 3문장 이내로만 아주 간결하게 응답하세요.
2. 영화 시간표 문의 시 위의 오늘/내일 스케줄을 참고하여 정확히 알려주세요.
3. 예매를 하려면 앱 하단의 '예매' 메뉴로 안내해 주세요.
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
      max_tokens: 256
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
