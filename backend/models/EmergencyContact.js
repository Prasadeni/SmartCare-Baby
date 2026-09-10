/**
 * EmergencyContact Model - SmartCare Baby
 * Stores emergency phone numbers and medical hotline information for the floating Emergency button
 */

const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  service_name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
  },
  phone_number: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  country: {
    type: String,
    trim: true,
    default: 'Sri Lanka',
  },
  city: {
    type: String,
    trim: true,
    default: 'All',
  },
  is_24hr: {
    type: Boolean,
    default: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

emergencyContactSchema.index({ is_active: 1, country: 1 });

const EmergencyContact = mongoose.models.EmergencyContact || mongoose.model('EmergencyContact', emergencyContactSchema);

module.exports = EmergencyContact;