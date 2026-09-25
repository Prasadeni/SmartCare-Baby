import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['General & Behavioral', 'Respiratory', 'Gastrointestinal', 'Neurological', 'Fever & Infection'],
      required: true,
    },
    symptomText: { type: String, required: true },
    weight: { type: Number, required: true, default: 1 },
    isRedFlag: { type: Boolean, default: false },
    ageMinMonths: { type: Number, default: 0 },
    ageMaxMonths: { type: Number, default: 60 },
    guidanceText: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('SymptomConfig', schema);
