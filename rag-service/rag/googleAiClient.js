// rag-service/rag/googleAiClient.js
//
// Thin wrapper around Google's Generative Language API.
// Includes retry logic for transient failures (503 model overload, 429 rate
// limit, 500 server errors, network timeouts).
//
// Keys: Google Auth keys (AQ...) must be sent via the x-goog-api-key header.
// This client handles both Auth and legacy Standard keys.
const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

// Model names — override via .env if you want to switch
const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || "gemini-embedding-001";
const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || "gemini-3.6-flash";

// Retry config — 3 retries = 4 total attempts max
const MAX_RETRIES = 3;
const BACKOFF_MS = [1000, 2000, 3000]; // 1s, 2s, 3s

function requireApiKey() {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) throw new Error("GOOGLE_AI_API_KEY is not set in .env");
  return key;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Which errors deserve a retry?
function isRetryable(status) {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

// Generic fetch-with-retry
async function fetchWithRetry(url, options, label) {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, options);

      if (res.ok) return res;

      // Non-retryable client errors (400, 401, 403, 404) — fail fast
      if (!isRetryable(res.status)) {
        const errBody = await res.text();
        throw new Error(`${label} failed: ${res.status} ${errBody}`);
      }

      // Retryable — read body for logging, then retry
      const errBody = await res.text();
      lastError = new Error(`${label} failed: ${res.status} ${errBody}`);

      if (attempt < MAX_RETRIES) {
        const wait = BACKOFF_MS[attempt];
        console.warn(`[Gemini] ${label} ${res.status} — retry ${attempt + 1}/${MAX_RETRIES} in ${wait}ms`);
        await sleep(wait);
        continue;
      }
    } catch (err) {
      lastError = err;

      // Network errors (ECONNRESET, timeout, etc.) — retry
      const isNetworkError =
        err.name === "AbortError" ||
        err.code === "ECONNRESET" ||
        err.code === "ETIMEDOUT" ||
        err.message?.includes("fetch failed");

      if (isNetworkError && attempt < MAX_RETRIES) {
        const wait = BACKOFF_MS[attempt];
        console.warn(`[Gemini] ${label} network error — retry ${attempt + 1}/${MAX_RETRIES} in ${wait}ms`);
        await sleep(wait);
        continue;
      }

      throw err;
    }
  }

  throw lastError || new Error(`${label} failed after ${MAX_RETRIES} retries`);
}

// Embeds a single piece of text into a 768-dimension vector.
async function embedText(text, taskType = "RETRIEVAL_DOCUMENT") {
  const key = requireApiKey();
  const url = `${API_BASE}/models/${EMBED_MODEL}:embedContent`;

  const res = await fetchWithRetry(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text }] },
        taskType,
        outputDimensionality: 768,
      }),
    },
    "Embedding"
  );

  const data = await res.json();
  return data.embedding.values;
}

// Generates a grounded answer given a prompt.
async function generateAnswer(prompt) {
  const key = requireApiKey();
  const url = `${API_BASE}/models/${CHAT_MODEL}:generateContent`;

  const res = await fetchWithRetry(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
      }),
    },
    "Generation"
  );

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

module.exports = { embedText, generateAnswer };