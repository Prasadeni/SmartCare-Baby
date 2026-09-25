import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    babyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true, index: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    recordedAt: { type: Date, required: true },
    babyAgeMonths: { type: Number, required: true },
    weightKg: { type: Number, required: true },
    heightCm: { type: Number, required: true },
    headCircumferenceCm: { type: Number, required: true },
    weightPercentile: { type: Number, default: 50 },
    heightPercentile: { type: Number, default: 50 },
    headPercentile: { type: Number, default: 50 },
    notes: { type: String, default: null },
  },
  { timestamps: true }
);

schema.index({ babyId: 1, recordedAt: 1 });

export default mongoose.model('GrowthRecord', schema);
