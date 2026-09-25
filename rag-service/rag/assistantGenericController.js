const asyncHandler = require("express-async-handler");
const { retrieveKnowledge } = require("./retriever");
const { generateGroundedAnswer } = require("./generator");

// @desc    Ask the assistant using ONLY the knowledge base
// @route   POST /api/assistant/ask
// @access  Public (internal service call from SmartCare backend)
const askGeneric = asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question || !question.trim()) {
    res.status(400);
    throw new Error("question is required");
  }

  const knowledgeChunks = await retrieveKnowledge(question);

  const emptyPersonalContext = {
    recentKicks: [],
    recentSymptoms: [],
    recentGrowth: [],
    milestones: [],
    latestMchat: [],
    vaccinations: [],
  };

  const answer = await generateGroundedAnswer(
    question,
    knowledgeChunks,
    emptyPersonalContext
  );

  res.json({
    answer,
    sources: knowledgeChunks.map((c) => ({
      title: c.title,
      topic: c.topic,
    })),
  });
});

module.exports = { askGeneric };