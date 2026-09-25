import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['Caregiver', 'PregnantMother', 'Admin'],
      default: 'Caregiver',
    },
    phone: { type: String, default: null },
    city: { type: String, default: 'Colombo' },
    country: { type: String, default: 'Sri Lanka' },
    avatarUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);