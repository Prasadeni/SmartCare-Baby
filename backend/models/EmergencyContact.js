// backend/models/EmergencyContact.js
import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Ambulance', 'Hospital', 'Police', 'Fire', 'Poison Control', 'Child Helpline', 'Other'],
      default: 'Other',
    },
    phone: { type: String, required: true, trim: true },
    alternatePhone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    description: { type: String, default: '' },
    isNational: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

schema.index({ isActive: 1, sortOrder: 1 });

export default mongoose.model('EmergencyContact', schema);