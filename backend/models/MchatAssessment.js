// backend/models/MchatAssessment.js
import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    babyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true, index: true },
    assessedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assessedAt: { type: Date, default: Date.now },
    totalRiskScore: { type: Number, required: true },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    followUpNeeded: { type: Boolean, default: false },
    actionPlan: { type: String, required: true },
    // NEW: full snapshot of the 20 answers
    answers: [
      {
        questionNumber: Number,
        text: String,
        response: Boolean,          // true = "Yes", false = "No"
        isReverseScored: Boolean,   // from question config
        isRisk: Boolean,            // whether this answer counted toward score
      },
    ],
  },
  { timestamps: true }
);

schema.index({ babyId: 1, assessedAt: -1 });

export default mongoose.model('MchatAssessment', schema);