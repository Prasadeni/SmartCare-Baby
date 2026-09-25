import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    vaccineName: { type: String, required: true },
    dueAgeMonths: { type: Number, required: true },
    doseNumber: { type: Number, default: 1 },
    description: { type: String, default: '' },
    preventsDiseases: { type: String, default: '' },
    mandatory: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

schema.index({ dueAgeMonths: 1 });

export default mongoose.model('VaccinationSchedule', schema);