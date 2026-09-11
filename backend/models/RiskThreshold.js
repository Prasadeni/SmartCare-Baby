/**
 * RiskThreshold Model - SmartCare Baby
 * Admin-configurable score boundaries for risk stratification
 */

const mongoose = require('mongoose');

const riskThresholdSchema = new mongoose.Schema({
  assessment_type: {
    type: String,
    enum: ['Symptom', 'Milestone', 'MCHAT'],
    required: true,
  },
  min_score: { type: Number, required: true },
  max_score: { type: Number, required: true },
  risk_level: {
    type: String,
    enum: ['Green', 'Yellow', 'Red'],
    required: true,
  },
  recommendation_text: { type: String, required: true },
  priority: { type: Number, default: 1 },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

riskThresholdSchema.index({ assessment_type: 1, is_active: 1 });

module.exports = mongoose.models.RiskThreshold || mongoose.model('RiskThreshold', riskThresholdSchema);