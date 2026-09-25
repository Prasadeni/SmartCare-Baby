# RAG Assistant Module

A self-contained add-on to the SmartCare Baby backend. Answers parent
questions using two grounded sources:
1. A small knowledge base of general pregnancy/baby-care guidance
   (`rag/knowledgeBase/*.txt`), embedded and searched via MongoDB Atlas
   Vector Search.
2. This baby's own recent records (kicks, symptoms, growth, milestones,
   M-CHAT results, vaccinations), pulled directly from the existing
   collections — no separate database needed.

It does **not** touch any of the existing models, controllers, or routes —
it only adds one new nested route: `POST /api/babies/:babyId/assistant/ask`.

## Setup

### 1. Get a Google AI API key
Go to https://aistudio.google.com → "Get API key" → create one. Add it to
your `.env`:
```
GOOGLE_AI_API_KEY=your_key_here
```

### 2. Create the Atlas Vector Search index
This is a one-time manual step in the Atlas UI (vector indexes can't be
created purely from Mongoose/application code).

1. In Atlas, go to your cluster → **Search** tab (or **Atlas Search**)
2. Click **Create Search Index** → choose **Vector Search** → **JSON Editor**
3. Select the `baby-care-rag` database and `knowledgechunks` collection
4. Name the index exactly: `vector_index`
5. Paste this definition:
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
6. Click **Create**. It takes a minute or two to finish building.

(768 dimensions matches Google's `text-embedding-004` model used here.)

### 3. Ingest the knowledge base
```bash
npm run rag:ingest
```
This chunks every `.txt` file in `rag/knowledgeBase/`, embeds each chunk,
and stores it in the `KnowledgeChunk` collection. Re-run this any time you
add or edit knowledge base articles.

## Using it

```
POST /api/babies/:babyId/assistant/ask
Authorization: Bearer <token>
Content-Type: application/json

{ "question": "Is it normal that I'm feeling fewer kicks today?" }
```

Response:
```json
{
  "answer": "...",
  "sources": [{ "title": "Fetal Movement and Kick Counting", "topic": "pregnancy, kick-counter" }]
}
```

## Adding more knowledge

Drop a new `.txt` file into `rag/knowledgeBase/`, formatted like the
existing ones:
```
Title: Your Article Title
Topic: comma, separated, tags

Body paragraphs here...
```
Then re-run `npm run rag:ingest`.

## Important note

The knowledge base content here is written in plain language reflecting
general, widely-available medical consensus for demo purposes. It is not
sourced from or a substitute for official clinical guidelines, and the
assistant's answers are informational only, not a diagnosis. Every generated
answer includes a reminder to consult a real doctor/pediatrician.
