import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    triggerCondition: { type: String, required: true, unique: true },
    recommendedSpecialty: { type: String, required: true },
    secondarySpecialty: { type: String, default: null },
    description: { type: String, default: '' },
    priority: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('SpecialtyMapping', schema);