import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    babyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true, index: true },
    assessedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assessedAt: { type: Date, default: Date.now },
    totalDelays: { type: Number, default: 0 },
    percentAchieved: { type: Number, default: 0 },
    items: [
      {
        configId: String,
        achieved: Boolean,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('MilestoneAssessment', schema);
