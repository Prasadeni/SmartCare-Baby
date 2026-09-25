// backend/models/RiskThreshold.js
import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // Optional: which assessment this threshold applies to (Symptom/Milestone/MCHAT)
    assessmentType: {
      type: String,
      enum: ['Symptom', 'Milestone', 'MCHAT', null],
      default: null,
    },
    riskLevel: {
      type: String,
      enum: ['Green', 'Yellow', 'Red'],
      required: true,
    },
    minScore: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    color: { type: String, default: '' },
    description: { type: String, default: '' },
    recommendationText: { type: String, default: '' },
    actionRequired: { type: String, default: '' },
    notifyCaregiver: { type: Boolean, default: true },
    escalateToAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

schema.index({ riskLevel: 1, isActive: 1 });

export default mongoose.model('RiskThreshold', schema);