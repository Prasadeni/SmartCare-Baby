import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    email: { type: String, default: null },
    hospitalAffiliation: { type: String, default: null },
    city: { type: String, required: true, index: true },
    country: { type: String, default: 'Sri Lanka' },
    bio: { type: String, default: '' },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    fee: { type: String, default: null },
    availableDays: [String],
    echannelingUrl: { type: String, default: null },
    imageUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

schema.index({ city: 1, specialty: 1 });

export default mongoose.model('Specialist', schema);