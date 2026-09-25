import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    area: {
      type: String,
      enum: ['Gross Motor', 'Fine Motor', 'Language', 'Cognitive', 'Social', 'Self-Help', 'Hearing/Vision'],
      required: true,
    },
    description: { type: String, required: true },
    expectedAgeMonths: { type: Number, required: true },
    isCritical: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('MilestoneConfig', schema);
