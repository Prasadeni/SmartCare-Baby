/**
 * VaccinationRecord Model - SmartCare Baby
 * Records actual vaccines administered to a specific baby
 */

const mongoose = require('mongoose');

const vaccinationRecordSchema = new mongoose.Schema({
  baby_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true, index: true },
  vaccine_schedule_id: { type: mongoose.Schema.Types.ObjectId, ref: 'VaccinationSchedule', required: true },
  administered_date: { type: Date, required: true },
  administered_by: { type: String, default: '' },
  batch_number: { type: String, default: '' },
  notes: { type: String, default: '' },
}, { timestamps: true });

vaccinationRecordSchema.index({ baby_id: 1, vaccine_schedule_id: 1 }, { unique: true });

module.exports = mongoose.models.VaccinationRecord || mongoose.model('VaccinationRecord', vaccinationRecordSchema);