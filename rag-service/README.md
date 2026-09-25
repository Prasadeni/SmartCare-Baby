# Baby Care RAG Assistant

A retrieval-augmented generation (RAG) API that answers pregnancy/baby-care
questions by grounding AI-generated answers in two sources:

1. **A curated knowledge base** — plain-language articles on fetal movement,
   pregnancy warning signs, infant symptoms, feeding, sleep safety,
   developmental milestones, M-CHAT autism screening, vaccination schedules,
   and postpartum warning signs — embedded and searched via **MongoDB Atlas
   Vector Search**.
2. **The specific baby's own records** — kick-counting sessions, symptoms,
   growth measurements, milestones, M-CHAT results, and vaccination
   status — pulled directly from MongoDB.

Built with **Node.js, Express, MongoDB (Mongoose), and Google's Gemini API**
(`gemini-embedding-001` for embeddings, `gemini-3.6-flash` for generation).

> This started as a module inside a larger baby-care app
> ([SmartCare Baby](#)) and was extracted here as its own focused project,
> since the RAG pipeline itself is generally reusable and interesting on its
> own.

## How it works

```
Parent's question
       |
       ├──> embedded (Gemini) ──> vector search over knowledge base (Atlas)
       |
       ├──> structured MongoDB queries ──> this baby's recent kicks/symptoms/
       |                                    growth/milestones/M-CHAT/vaccines
       |
       └──> both combined into a grounded prompt ──> Gemini generates the
                                                        final answer
```

The model is explicitly instructed not to diagnose, to say when it doesn't
have enough information, and to lead with a "seek care now" recommendation
if the question sounds urgent.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. MongoDB Atlas
Create a free M0 cluster at mongodb.com/cloud/atlas (Atlas Vector Search
requires Atlas, not a plain local MongoDB install). Whitelist your IP under
Network Access, then copy your connection string into `.env`:
```bash
cp .env.example .env
# set MONGO_URI, JWT_SECRET
```

### 3. Google AI API key
Get a key at https://aistudio.google.com → "Get API key". Add it to `.env`
as `GOOGLE_AI_API_KEY`.

> **Note on Google's key format:** keys created from mid-2026 onward are
> "Auth Keys" (prefixed `AQ.`) rather than the older `AIza...` "Standard"
> keys, and must be sent as an `x-goog-api-key` header rather than a `?key=`
> URL parameter. This project's `rag/googleAiClient.js` already handles this
> correctly — if you fork this and see 403/404 errors, check that your fetch
> calls use the header method, not the older query-param method shown in a
> lot of older tutorials.

### 4. Seed demo data
```bash
npm run seed
```
Creates a demo parent/baby with sample kicks, symptoms, growth records,
milestones, an M-CHAT result, and vaccination records — so the assistant has
real personal data to reference.

### 5. Create the Atlas Vector Search index
One manual step in the Atlas UI (can't be scripted):
1. Atlas → your cluster → **Search & Vector Search** → **Create Search Index**
2. Search type: **Vector Search** → **Bring your own embeddings**
3. Database/collection: `baby-care-rag` / `knowledgechunks`
4. Index name: exactly `vector_index`
5. JSON Editor, paste:
```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    }
  ]
}
```
6. Create, wait for **Active** status.

### 6. Ingest the knowledge base
```bash
npm run rag:ingest
```
Chunks and embeds every `.txt` file in `rag/knowledgeBase/` into MongoDB.
Re-run this any time you edit or add knowledge base articles.

### 7. Run it
```bash
npm run dev
```

## Usage

**1. Log in as the demo parent:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@babycarerag.test","password":"Password123!"}'
```

**2. Get the demo baby's ID:**
```bash
curl http://localhost:5000/api/babies -H "Authorization: Bearer YOUR_TOKEN"
```

**3. Ask the assistant:**
```bash
curl -X POST http://localhost:5000/api/babies/YOUR_BABY_ID/assistant/ask \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question":"Is it normal to feel fewer kicks today?"}'
```

Response:
```json
{
  "answer": "...",
  "sources": [{ "title": "Fetal Movement and Kick Counting", "topic": "pregnancy, kick-counter" }]
}
```

## Project structure

```
├── rag/                       The actual RAG system
│   ├── knowledgeBase/*.txt    Source articles (edit/add freely)
│   ├── models/KnowledgeChunk.js  Embedded chunk storage schema
│   ├── ingest.js               Chunks + embeds knowledgeBase/ into MongoDB
│   ├── retriever.js            Vector search + personal data queries
│   ├── generator.js            Builds the grounded prompt, calls Gemini
│   ├── googleAiClient.js       Gemini API wrapper (embeddings + generation)
│   ├── assistantController.js / assistantRoutes.js   The API layer
│   └── README.md               Module-specific setup notes
├── models/                     Minimal data models the retriever reads from
├── controllers/, routes/       Auth + baby endpoints (just enough to test)
├── middleware/, utils/         JWT auth, error handling, ownership checks
├── seed/seed.js                 Demo data loader
└── server.js                    Entry point
```

## Adding more knowledge

Drop a new `.txt` file into `rag/knowledgeBase/`:
```
Title: Your Article Title
Topic: comma, separated, tags

Body text here, in plain paragraphs...
```
Then re-run `npm run rag:ingest`.

## Important disclaimer

The knowledge base content is written in plain language reflecting general,
widely available medical consensus, for demonstration purposes — it is not
sourced from a single official guideline body and is not a substitute for
professional medical advice. Every generated answer includes a reminder to
consult a real doctor or pediatrician, and the system is instructed to lead
with a "seek care now" recommendation for anything that sounds urgent. This
should not be treated as a certified medical device or diagnostic tool.

## License

MIT (or your choice — add a LICENSE file before publishing if you want this
explicit).
