/**
 * EmergencyFacility Model - SmartCare Baby
 * Nearby 24/7 hospitals and urgent care facilities
 */

const mongoose = require('mongoose');

const emergencyFacilitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['Hospital', 'Clinic', 'Urgent_Care'],
    default: 'Hospital',
  },
  address: { type: String, required: true },
  distance_km: { type: Number, default: 0 },
  phone: { type: String, default: '' },
  is_open_now: { type: Boolean, default: true },
  open_hours: { type: String, default: '24/7' },
  image_url: { type: String, default: '' },
  latitude: { type: Number },
  longitude: { type: Number },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

emergencyFacilitySchema.index({ distance_km: 1 });

module.exports = mongoose.models.EmergencyFacility || mongoose.model('EmergencyFacility', emergencyFacilitySchema);