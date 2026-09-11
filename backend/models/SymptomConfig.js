/**
 * SymptomConfig Model - SmartCare Baby
 * Admin-managed master list of symptoms with weights, red-flag status, icons and categories
 */

const mongoose = require('mongoose');

const symptomConfigSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Feeding', 'Activity', 'Physical', 'Mood'],
    required: true,
  },
  symptom_text: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  icon: {
    type: String,
    default: 'help-circle',
  },
  weight: {
    type: Number,
    required: true,
    default: 1,
  },
  is_red_flag: {
    type: Boolean,
    default: false,
  },
  age_min_months: { type: Number, default: 0 },
  age_max_months: { type: Number, default: 60 },
  guidance_text: { type: String, default: '' },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

symptomConfigSchema.index({ category: 1, is_active: 1 });

module.exports = mongoose.models.SymptomConfig || mongoose.model('SymptomConfig', symptomConfigSchema);