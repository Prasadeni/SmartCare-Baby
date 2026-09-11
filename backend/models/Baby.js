/**
 * Baby Model - SmartCare Baby
 * Stores child profile data linked to a caregiver user
 */

const mongoose = require('mongoose');

const babySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Baby name is required'],
    trim: true,
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required'],
  },
  birth_weight_kg: {
    type: Number,
    default: null,
  },
  birth_height_cm: {
    type: Number,
    default: null,
  },
  gestational_age_weeks: {
    type: Number,
    default: 40,
  },
  blood_group: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown',
  },
  medical_notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

babySchema.index({ user_id: 1, dob: 1 });

const Baby = mongoose.models.Baby || mongoose.model('Baby', babySchema);

module.exports = Baby;