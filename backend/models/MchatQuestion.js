import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    number: { type: Number, required: true, unique: true },
    text: { type: String, required: true },
    isReverseScored: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('MchatQuestion', schema);
