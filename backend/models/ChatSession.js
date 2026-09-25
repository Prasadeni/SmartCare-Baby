import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
    sessionStatus: {
      type: String,
      enum: ['Active', 'Closed', 'Archived'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

schema.index({ userId: 1, sessionStatus: 1 });

export default mongoose.model('ChatSession', schema);