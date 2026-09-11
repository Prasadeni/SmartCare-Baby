/**
 * VaccinationSchedule Model - SmartCare Baby
 * Admin-managed master list of vaccine doses with due ages
 */

const mongoose = require('mongoose');

const vaccinationScheduleSchema = new mongoose.Schema({
  vaccine_name: { type: String, required: true, trim: true },
  due_age_months: { type: Number, required: true },
  dose_number: { type: Number, default: 1 },
  description: { type: String, default: '' },
  prevents_diseases: { type: String, default: '' },
  mandatory: { type: Boolean, default: true },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

vaccinationScheduleSchema.index({ due_age_months: 1 });

module.exports = mongoose.models.VaccinationSchedule || mongoose.model('VaccinationSchedule', vaccinationScheduleSchema);