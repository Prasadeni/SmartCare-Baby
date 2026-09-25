const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionOrder: { type: Number, required: true },
    answer: { type: String, enum: ["yes", "no"], required: true },
    isRisk: { type: Boolean, required: true },
  },
  { _id: false }
);

const mChatResultSchema = new mongoose.Schema(
  {
    baby: { type: mongoose.Schema.Types.ObjectId, ref: "Baby", required: true },
    dateTaken: { type: Date, required: true, default: Date.now },
    answers: { type: [answerSchema], required: true },
    riskScore: { type: Number, required: true }, // total number of "risk" answers
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MChatResult", mChatResultSchema);
