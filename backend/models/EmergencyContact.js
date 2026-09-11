/**
 * EmergencyContact Model - SmartCare Baby
 * Quick-action contacts for the Emergency Help page
 */

const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  service_name: { type: String, required: true, trim: true },
  phone_number: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Primary', 'Hospital', 'Pediatrician', 'Poison_Control', 'Ambulance', 'Other'],
    default: 'Other',
  },
  icon: { type: String, default: 'emergency' },
  color: { type: String, default: '#BA1A1A' },
  country: { type: String, default: 'Sri Lanka' },
  city: { type: String, default: 'All' },
  is_24hr: { type: Boolean, default: true },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

emergencyContactSchema.index({ is_active: 1, country: 1 });

module.exports = mongoose.models.EmergencyContact || mongoose.model('EmergencyContact', emergencyContactSchema);