/**
 * GrowthRecord Model - SmartCare Baby
 * Tracks weight, height, head circumference with WHO percentiles
 */

const mongoose = require('mongoose');

const growthRecordSchema = new mongoose.Schema({
  baby_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baby',
    required: true,
    index: true,
  },
  recorded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  baby_age_months: { type: Number, required: true },
  weight_kg: { type: Number, required: true },
  height_cm: { type: Number, required: true },
  head_circumference_cm: { type: Number, default: null },
  weight_percentile: { type: Number, default: 50 },
  height_percentile: { type: Number, default: 50 },
  head_percentile: { type: Number, default: null },
  notes: { type: String, default: '' },
  recorded_at: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

growthRecordSchema.index({ baby_id: 1, recorded_at: -1 });

module.exports = mongoose.models.GrowthRecord || mongoose.model('GrowthRecord', growthRecordSchema);