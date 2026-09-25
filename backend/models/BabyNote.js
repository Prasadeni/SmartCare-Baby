// backend/models/BabyNote.js
import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    babyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Baby',
      default: null,          // null = mother-only note (no baby context)
      index: true,
    },
    content: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['General', 'Question for Doctor', 'Observation', 'Reminder'],
      default: 'General',
    },
  },
  { timestamps: true }
);

schema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('BabyNote', schema);