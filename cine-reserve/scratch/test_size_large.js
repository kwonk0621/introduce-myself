const apiKey = "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";

async function test() {
  const dummyPrompt = "A".repeat(100000);
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: dummyPrompt },
          { role: 'user', content: 'Hello' }
        ],
        max_tokens: 1024
      })
    });
    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
