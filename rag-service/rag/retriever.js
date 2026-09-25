const mongoose = require("mongoose");
const KnowledgeChunk = require("./models/KnowledgeChunk");
const { embedText } = require("./googleAiClient");

const KickSession = require("../models/KickSession");
const Symptom = require("../models/Symptom");
const GrowthRecord = require("../models/GrowthRecord");
const Milestone = require("../models/Milestone");
const MChatResult = require("../models/MChatResult");
const VaccinationRecord = require("../models/VaccinationRecord");

// Requires an Atlas Vector Search index named "vector_index" on the
// KnowledgeChunk.embedding field. See rag/README.md for the exact definition.
async function retrieveKnowledge(question, topK = 4) {
  const queryVector = await embedText(question, "RETRIEVAL_QUERY");

  const results = await KnowledgeChunk.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector,
        numCandidates: 100,
        limit: topK,
      },
    },
    {
      $project: {
        title: 1,
        topic: 1,
        text: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  return results;
}

// Pulls a compact, recent snapshot of this baby's own data so the model can
// ground its answer in what's actually happening with this pregnancy/baby,
// not just generic advice.
async function retrievePersonalContext(babyId) {
  const [recentKicks, recentSymptoms, recentGrowth, milestones, latestMchat, vaccinations] =
    await Promise.all([
      KickSession.find({ baby: babyId }).sort({ startedAt: -1 }).limit(5),
      Symptom.find({ baby: babyId }).sort({ date: -1 }).limit(5),
      GrowthRecord.find({ baby: babyId }).sort({ date: -1 }).limit(3),
      Milestone.find({ baby: babyId }),
      MChatResult.find({ baby: babyId }).sort({ dateTaken: -1 }).limit(1),
      VaccinationRecord.find({ baby: babyId }).sort({ dueDate: 1 }),
    ]);

  return { recentKicks, recentSymptoms, recentGrowth, milestones, latestMchat, vaccinations };
}

module.exports = { retrieveKnowledge, retrievePersonalContext };
