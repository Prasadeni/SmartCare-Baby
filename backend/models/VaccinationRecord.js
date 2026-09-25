import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    babyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true, index: true },
    vaccineScheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'VaccinationSchedule', required: true },
    administeredDate: { type: Date, required: true },
    administeredBy: { type: String, default: null },
    batchNumber: { type: String, default: null },
    notes: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('VaccinationRecord', schema);