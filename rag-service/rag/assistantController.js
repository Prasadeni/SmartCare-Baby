const asyncHandler = require("express-async-handler");
const { retrieveKnowledge, retrievePersonalContext } = require("./retriever");
const { generateGroundedAnswer } = require("./generator");
const verifyBabyOwnership = require("../utils/verifyBabyOwnership");

// @desc    Ask the assistant a question grounded in general knowledge +
//          this baby's own records
// @route   POST /api/babies/:babyId/assistant/ask
// @access  Private
// Body: { question: string }
const askAssistant = asyncHandler(async (req, res) => {
  await verifyBabyOwnership(req.params.babyId, req.user._id);

  const { question } = req.body;
  if (!question || !question.trim()) {
    res.status(400);
    throw new Error("question is required");
  }

  const [knowledgeChunks, personalContext] = await Promise.all([
    retrieveKnowledge(question),
    retrievePersonalContext(req.params.babyId),
  ]);

  const answer = await generateGroundedAnswer(question, knowledgeChunks, personalContext);

  res.json({
    answer,
    sources: knowledgeChunks.map((c) => ({ title: c.title, topic: c.topic })),
  });
});

module.exports = { askAssistant };
