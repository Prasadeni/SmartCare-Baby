/**
 * One-time (or re-run-when-content-changes) ingestion script.
 *
 * Reads every .txt file in rag/knowledgeBase/, splits it into paragraph-sized
 * chunks, embeds each chunk with Google's embedding model, and stores the
 * result in the KnowledgeChunk collection for retrieval later.
 *
 * Includes:
 *  - Rate limiting (2s delay between embeddings)
 *  - Automatic retry on 429 (rate limit) with exponential backoff
 *  - Progress logging
 *
 * Run with: npm run rag:ingest
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const connectDB = require("../config/db");
const KnowledgeChunk = require("./models/KnowledgeChunk");
const { embedText } = require("./googleAiClient");

const KB_DIR = path.join(__dirname, "knowledgeBase");

// ── Rate-limit configuration ────────────────────────────────
// Gemini free tier is tight. 2s between calls = ~30 requests/min.
// Increase if you have billing enabled (can go down to 0ms).
const DELAY_BETWEEN_CHUNKS_MS = 2000;
const MAX_RETRIES = 6;
const INITIAL_RETRY_DELAY_MS = 5000; // 5s, 10s, 20s, 40s, 80s, 160s

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Chunking helpers ────────────────────────────────────────
function chunkText(body, minLength = 300) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks = [];
  let current = "";
  for (const para of paragraphs) {
    current = current ? `${current}\n\n${para}` : para;
    if (current.length >= minLength) {
      chunks.push(current);
      current = "";
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function parseHeader(body) {
  const lines = body.split("\n");
  const title = (lines[0].match(/^Title:\s*(.*)$/i) || [])[1] || "Untitled";
  const topic = (lines[1].match(/^Topic:\s*(.*)$/i) || [])[1] || "general";
  const rest = lines.slice(2).join("\n").trim();
  return { title, topic, rest };
}

// ── Embedding with retry ────────────────────────────────────
async function embedWithRetry(text, context) {
  let delay = INITIAL_RETRY_DELAY_MS;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await embedText(text);
    } catch (err) {
      const message = String(err.message || "");
      const isRateLimit =
        message.includes("429") ||
        message.includes("RESOURCE_EXHAUSTED") ||
        err.status === 429;

      const isTransient =
        isRateLimit ||
        message.includes("500") ||
        message.includes("503") ||
        message.includes("timed out");

      if (!isTransient || attempt === MAX_RETRIES) {
        throw err;
      }

      console.log(
        `    ⚠️  ${isRateLimit ? "Rate limit" : "Transient error"} ` +
          `(${context}) — retry ${attempt}/${MAX_RETRIES} in ${delay / 1000}s`
      );
      await sleep(delay);
      delay *= 2; // exponential backoff
    }
  }
}

// ── Main ────────────────────────────────────────────────────
async function run() {
  await connectDB();

  console.log("Clearing existing knowledge chunks...");
  await KnowledgeChunk.deleteMany();

  const files = fs.readdirSync(KB_DIR).filter((f) => f.endsWith(".txt"));
  console.log(`Found ${files.length} knowledge base files.\n`);

  let totalChunks = 0;
  let totalFiles = 0;

  for (const file of files) {
    const raw = fs.readFileSync(path.join(KB_DIR, file), "utf-8");
    const { title, topic, rest } = parseHeader(raw);
    const chunks = chunkText(rest);

    console.log(
      `📄 [${++totalFiles}/${files.length}] "${title}" — ${chunks.length} chunks`
    );

    for (let i = 0; i < chunks.length; i++) {
      const chunkBody = chunks[i];
      const context = `${title} chunk ${i + 1}/${chunks.length}`;

      try {
        const embedding = await embedWithRetry(chunkBody, context);
        await KnowledgeChunk.create({
          sourceFile: file,
          title,
          topic,
          text: chunkBody,
          embedding,
        });
        totalChunks += 1;
        console.log(`    ✅ Chunk ${i + 1}/${chunks.length}`);
      } catch (err) {
        console.error(`    ❌ Failed chunk ${i + 1}: ${err.message}`);
        console.error(`    Skipping this chunk and continuing...`);
      }

      // Rate-limit pause (skip after the last chunk of the last file)
      const isLast =
        totalFiles === files.length && i === chunks.length - 1;
      if (!isLast) await sleep(DELAY_BETWEEN_CHUNKS_MS);
    }

    console.log(""); // blank line between files
  }

  console.log(`\n✅ Ingestion complete. ${totalChunks} chunks stored.`);
  console.log(
    "Reminder: create an Atlas Vector Search index named 'vector_index' on the 'embedding' field before querying (see rag/README.md)."
  );
  process.exit(0);
}

run().catch((err) => {
  console.error("Ingestion failed:", err.message);
  process.exit(1);
});