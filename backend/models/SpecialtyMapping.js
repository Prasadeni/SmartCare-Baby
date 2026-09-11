/**
 * SpecialtyMapping Model - SmartCare Baby
 * Maps conditions to recommended medical specialties
 */

const mongoose = require('mongoose');

const specialtyMappingSchema = new mongoose.Schema({
  trigger_condition: { type: String, required: true, unique: true, trim: true },
  recommended_specialty: { type: String, required: true, trim: true },
  secondary_specialty: { type: String, default: null },
  description: { type: String, default: '' },
  priority: { type: Number, default: 1 },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.models.SpecialtyMapping || mongoose.model('SpecialtyMapping', specialtyMappingSchema);