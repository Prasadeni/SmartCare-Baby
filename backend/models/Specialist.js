/**
 * Specialist Model - SmartCare Baby
 * Stores doctor profiles with ratings and location for the recommendation page
 */

const mongoose = require('mongoose');

const specialistSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  specialty: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  hospital_affiliation: { type: String, trim: true },
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, trim: true, default: 'Sri Lanka' },
  latitude: { type: Number },
  longitude: { type: Number },
  // New fields for the recommendation UI
  avatar_url: { type: String, default: '' },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviews_count: { type: Number, default: 0 },
  distance_km: { type: Number, default: 0 },
  bio: { type: String, default: '' },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.models.Specialist || mongoose.model('Specialist', specialistSchema);