import mongoose from 'mongoose';

const babySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    birthWeightKg: { type: Number, default: 0 },
    birthHeightCm: { type: Number, default: 0 },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown',
    },
    photoUrl: { type: String, default: null },
    medicalNotes: { type: String, default: null },
  },
  { timestamps: true }
);

babySchema.index({ userId: 1, dob: -1 });

export default mongoose.model('Baby', babySchema);