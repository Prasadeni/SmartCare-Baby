/**
 * MilestoneAssessment Model - SmartCare Baby
 * Stores a milestone screening session with snapshot of each checked milestone
 */

const mongoose = require('mongoose');

const milestoneAssessmentItemSchema = new mongoose.Schema({
  milestone_config_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MilestoneConfig' },
  area_snapshot: { type: String, required: true },
  description_snapshot: { type: String, required: true },
  expected_age_months_snapshot: { type: Number, required: true },
  is_critical_snapshot: { type: Boolean, default: false },
  achieved: { type: Boolean, required: true },
  is_delayed: { type: Boolean, default: false },
}, { _id: false });

const milestoneAssessmentSchema = new mongoose.Schema({
  baby_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true, index: true },
  assessed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  baby_age_months: { type: Number, required: true },
  total_delays: { type: Number, default: 0 },
  total_milestones_checked: { type: Number, default: 0 },
  total_achieved: { type: Number, default: 0 },
  items: [milestoneAssessmentItemSchema],
  notes: { type: String, default: '' },
  assessed_at: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

milestoneAssessmentSchema.index({ baby_id: 1, assessed_at: -1 });

module.exports = mongoose.models.MilestoneAssessment || mongoose.model('MilestoneAssessment', milestoneAssessmentSchema);