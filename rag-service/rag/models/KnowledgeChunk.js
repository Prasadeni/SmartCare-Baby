const mongoose = require("mongoose");

// Each row is one chunk of a knowledge base article plus its embedding vector.
// Requires an Atlas Vector Search index named "vector_index" on the
// "embedding" field (see rag/README.md for the exact index definition).
const knowledgeChunkSchema = new mongoose.Schema(
  {
    sourceFile: { type: String, required: true },
    title: { type: String, required: true },
    topic: { type: String, required: true },
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("KnowledgeChunk", knowledgeChunkSchema);
