// backend/services/rag.js


const RAG_TIMEOUT_MS = 90000;

const BOT_REPLIES = [
  { keywords: ['sleep', 'nap', 'bedtime'], reply: 'Newborns sleep 14–17 hours a day in 2–4 hour stretches.' },
  { keywords: ['fever', 'temperature', 'hot'], reply: 'For babies under 3 months, any fever above 38°C (100.4°F) needs immediate medical attention.' },
  { keywords: ['milestone', 'crawl', 'walk', 'sit'], reply: 'Every baby develops at their own pace.' },
  { keywords: ['autism', 'mchat', 'm-chat'], reply: 'The M-CHAT-R is a screening tool, not a diagnosis.' },
  { keywords: ['food', 'eat', 'solid', 'feed'], reply: 'Around 6 months, look for signs of readiness: good head control, sitting with support, and interest in food.' },
  { keywords: ['vaccine', 'vaccination', 'immunization'], reply: 'Vaccines protect your baby from serious diseases.' },
  { keywords: ['pregnan', 'kick', 'contraction'], reply: 'For pregnancy tracking, use the Kick Counter (aim for 10 kicks in 2 hours) and the Contraction Timer.' },
  { keywords: ['emergency', 'urgent', 'bleeding', 'unconscious'], reply: 'If this is a medical emergency, please call 1990.' },
];

function keywordReply(message) {
  const lower = (message || '').toLowerCase();
  for (const { keywords, reply } of BOT_REPLIES) {
    if (keywords.some((k) => lower.includes(k))) return reply;
  }
  return "I'm still learning! For specific medical concerns, please consult a pediatric specialist. You can also browse our Education articles for common questions.";
}

async function callRagService(question) {
  const RAG_URL = process.env.RAG_SERVICE_URL || '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RAG_TIMEOUT_MS);

  try {
    console.log(`[RAG] Calling ${RAG_URL}/api/assistant/ask`);

    const res = await fetch(`${RAG_URL}/api/assistant/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`RAG service returned ${res.status}: ${errText}`);
    }

    const data = await res.json();
    console.log(`[RAG] Got answer of length ${data.answer?.length || 0}`);
    return { answer: data.answer || '', sources: data.sources || [] };
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateBotReply(message /*, babyId */) {
  const RAG_URL = process.env.RAG_SERVICE_URL || '';
  if (RAG_URL) {
    try {
      const result = await callRagService(message);
      if (result.answer && result.answer.trim()) {
        return result.answer;
      }
      console.warn('[RAG] Empty answer, using fallback');
    } catch (err) {
      console.warn('[RAG] Service unavailable:', err.message);
      console.warn('[RAG] Falling back to keyword reply');
    }
  } else {
    console.warn('[RAG] RAG_SERVICE_URL not set — using keyword replies');
  }
  return keywordReply(message);
}
