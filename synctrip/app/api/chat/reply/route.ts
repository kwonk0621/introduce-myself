import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomId, messages, partner, userProfile } = body;

    const apiKey = process.env.GROQ_API_KEY;

    // Standard high-quality traveler context templates
    const partnerVibe = `
- 이름: ${partner.name}
- 성별/나이대: ${partner.gender} / ${partner.age_group}
- MBTI: ${partner.mbti}
- 자기소개: ${partner.self_intro}
- 여행 테마: ${partner.preferences?.travel_destinations?.join(", ") || "도시"}
- 계획 스타일: ${partner.preferences?.planning_style || "반반형"}
- 걸음 수: 하루 ${partner.preferences?.max_steps || "10,000 ~ 15,000"}보
- 숙소 선호: ${partner.preferences?.accommodation_types?.join(", ") || "호텔"}
- AI 페르소나 요약: ${partner.preferences?.ai_summary || "자유로운 여행가"}
`;

    const userVibe = `
- 이름: ${userProfile.name}
- 성별/나이대: ${userProfile.gender} / ${userProfile.age_group}
- MBTI: ${userProfile.mbti}
`;

    // Prompt construction
    const systemInstruction = `
당신은 여행 동행 매칭 서비스 "SyncTrip"의 가상 파트너이자 실제 유저인 "${partner.name}"입니다.
아래의 프로필 정보를 바탕으로, 사용자 "${userProfile.name}"가 보낸 메시지에 대해 실제 모바일 메신저(카카오톡 등)에서 대화하는 것처럼 자연스럽고 친근하게 답변해야 합니다.

당신의 프로필 정보:
${partnerVibe}

대화 상대방(${userProfile.name})의 정보:
${userVibe}

답변 작성 규칙:
1. 반드시 당신의 프로필 정보(나이, 성별, MBTI, 여행 스타일, 걸음 수, 선호 숙소 등)에 부합하는 답변을 하세요.
2. 대화 기록을 면밀히 분석하고 흐름을 이어가며, 상대방의 질문에 적절히 답변하거나 새로운 여행 제안을 던지세요.
3. 딱딱한 말투(예: 다나까) 대신 친근하고 자연스러운 구어체(예: "~해요", "~했네요!", "ㅎㅎ", "ㅠㅠ", "!" 등 메신저 감성)를 적극 활용하세요.
4. 답변은 너무 길지 않게 2~3문장 이내로 작성해 주세요.
5. 오직 답변 텍스트만 출력하세요. 다른 서술이나 메타 설명(예: "답변:")은 절대 포함하지 마십시오.
6. 대화 내용에 관계없이 답변은 반드시 한국어로만 작성하세요. 상대방이 다른 언어로 말을 걸더라도 오직 자연스럽고 친근한 한국어로만 답변해야 합니다.
7. 한자, 일본어(가나), 영어 알파벳 등 어떠한 외국어 문자 표기도 절대 사용하지 마세요. 외국어 단어나 고유 명사(도시 이름, 숙소 등)가 필요한 경우 반드시 한글 발음으로만 표기해야 합니다. (예: 오사카, 숙소, 에어비앤비)
`;

    if (apiKey) {
      try {
        // Build the messages payload for Groq in standard OpenAI format
        const groqMessages = [
          { role: "system", content: systemInstruction },
          ...messages.map((m: any) => ({
            role: m.sender_id === partner.id ? "assistant" : "user",
            content: m.message
          }))
        ];
        console.log("GROQ PROMPT:", JSON.stringify(groqMessages, null, 2));

        // Call Groq API endpoint
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: groqMessages,
            temperature: 0.3,
            max_tokens: 150
          })
        });

        if (response.ok) {
          const data = await response.json();
          let replyText = data.choices[0]?.message?.content?.trim() || "";
          
          // Cleanup any wrapping quotes or prefixes
          if (replyText.startsWith('"') && replyText.endsWith('"')) {
            replyText = replyText.slice(1, -1);
          }
          if (replyText.startsWith('답변:')) {
            replyText = replyText.replace('답변:', '').trim();
          }

          if (replyText) {
            return NextResponse.json({ reply: replyText });
          }
        } else {
          const errorDetails = await response.text();
          console.error("Groq API response error:", errorDetails);
        }
      } catch (aiError) {
        console.error("Groq chat reply failed, fallback to mock", aiError);
      }
    }

    // Heuristic Fallback engine when API key is missing or fails
    const lastUserMessage = messages[messages.length - 1]?.message || "";
    let fallbackReply = `반가워요 ${userProfile.name}님! 성향 맞춤 매칭 점수가 높아서 먼저 인사드렸어요 ㅎㅎ 혹시 여행 계획은 다 세우셨나요?`;

    const lowerMsg = lastUserMessage.toLowerCase();
    if (lowerMsg.includes("안녕") || lowerMsg.includes("반갑") || lowerMsg.includes("하이")) {
      fallbackReply = `안녕하세요! 😊 ${partner.name}입니다. 저랑 매칭 점수가 되게 높게 나오셔서 신기했어요! 여행 언제쯤 가시나요?`;
    } else if (lowerMsg.includes("계획") || lowerMsg.includes("일정") || lowerMsg.includes("코스")) {
      fallbackReply = `아, 저는 ${partner.preferences?.planning_style === "초계획형" || partner.preferences?.planning_style === "계획형" ? "꼼꼼하게 시간 단위로 계획 짜두는 걸 선호해서 대략적인 동선은 정리해뒀어요!" : "비교적 즉흥적인 편이라 가볍게 맛집 몇 군데만 알아보고 나머지는 현지 상황 봐서 결정하려구요!"} 혹시 가고 싶은 구체적인 장소가 있으신가요?`;
    } else if (lowerMsg.includes("숙소") || lowerMsg.includes("호텔") || lowerMsg.includes("에어비앤비")) {
      fallbackReply = `숙소는 ${partner.preferences?.accommodation_types?.join("이나 ") || "호텔"} 위주로 알아보고 있어요. 혹시 취향이 비슷하시면 같이 숙소 쉐어해서 경비 아끼는 것도 고려해볼 만해요!`;
    } else if (lowerMsg.includes("걸음") || lowerMsg.includes("산책") || lowerMsg.includes("걷기") || lowerMsg.includes("체력")) {
      fallbackReply = `저는 평소에 여행 가면 ${partner.preferences?.max_steps || "1만보 정도"} 걷는 편이에요! 체력 조건이 맞으면 같이 다닐 때 서로 덜 피곤하고 좋은 것 같아요 ㅎㅎ`;
    } else if (lowerMsg.includes("음식") || lowerMsg.includes("맛집") || lowerMsg.includes("식사") || lowerMsg.includes("술")) {
      fallbackReply = `먹는 거 정말 중요하죠! ${partner.preferences?.drinking === "즐겨 마심" ? "저는 현지 맥주나 맛있는 술 곁들이는 걸 정말 좋아해요 🍻" : "저는 가볍게 맛집이나 예쁜 카페 투어 위주로 다니는 편이에요 ☕️"} 혹시 못 드시는 음식이 있으신가요?`;
    } else {
      const dynamicReplies = [
        `오! 좋은 생각이네요 ㅎㅎ 저랑 생각하시는 게 비슷해서 다행이에요.`,
        `네 맞아요! 여행 메이트랑 그런 소소한 취향 맞추는 게 진짜 중요한데 통하는 부분이 많네요 😆`,
        `반가워요! 혹시 며칠부터 며칠까지 주로 함께 동행할 수 있을까요? 일정 맞춰보고 싶어요!`,
        `그럼요! 마음에 들어요. 일정 조율 더 해볼까요?`
      ];
      fallbackReply = dynamicReplies[Math.floor(Math.random() * dynamicReplies.length)];
    }

    return NextResponse.json({ reply: fallbackReply });

  } catch (error) {
    console.error("API Chat reply route error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
