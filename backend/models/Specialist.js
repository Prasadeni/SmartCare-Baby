/**
 * Specialist Model - SmartCare Baby
 * Stores medical doctor profiles, specialties, contact info, and hospital affiliations
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
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.models.Specialist || mongoose.model('Specialist', specialistSchema);