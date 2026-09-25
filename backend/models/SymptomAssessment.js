import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    babyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true, index: true },
    assessedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assessedAt: { type: Date, default: Date.now },
    totalScore: { type: Number, required: true },
    riskLevel: { type: String, enum: ['Green', 'Yellow', 'Red'], required: true },
    emergencyAlert: { type: Boolean, default: false },
    triggeringRedFlags: [String],
    recommendationText: { type: String, required: true },
    answers: [
      {
        configId: String,
        category: String,
        symptomText: String,
        weight: Number,
        isRedFlag: Boolean,
        guidanceText: String,
        present: Boolean,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('SymptomAssessment', schema);
