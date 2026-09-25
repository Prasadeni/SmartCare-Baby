import mongoose from 'mongoose';

const kickSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    durationMinutes: { type: Number, default: 0 },
    count: { type: Number, required: true },
    alertTriggered: { type: Boolean, default: false },
    notes: { type: String, default: null },
  },
  { _id: true }
);

const contractionSchema = new mongoose.Schema(
  {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    durationSeconds: { type: Number, required: true },
    intervalMinutes: { type: Number, default: 0 },
    intensity: { type: String, enum: ['Mild', 'Moderate', 'Severe'], default: 'Mild' },
    notes: { type: String, default: null },
  },
  { _id: true }
);

const weightLogSchema = new mongoose.Schema(
  {
    logDate: { type: Date, required: true },
    weightKg: { type: Number, required: true },
    gestationalAgeWeeks: { type: Number, default: 0 },
    notes: { type: String, default: null },
  },
  { _id: true }
);

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    expectedDueDate: { type: Date, required: true },
    lmpDate: { type: Date, default: null },
    currentGestationalAgeWeeks: { type: Number, default: 0 },
    isCurrentPregnancy: { type: Boolean, default: true },
    kicks: [kickSchema],
    contractions: [contractionSchema],
    weightLogs: [weightLogSchema],
  },
  { timestamps: true }
);

schema.index({ userId: 1, isCurrentPregnancy: 1 });

export default mongoose.model('PregnancyTracker', schema);
