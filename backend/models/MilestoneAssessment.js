const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  milestone_id:                 { type: String, required: true },
  area_snapshot:                { type: String, required: true },
  description_snapshot:         { type: String, required: true },
  expected_age_months_snapshot: { type: Number, required: true },
  is_critical_snapshot:         { type: Boolean, default: false },
  achieved:                     { type: Boolean, default: false },
  unsure:                       { type: Boolean, default: false },
  answered:                     { type: Boolean, default: false },
  is_delayed:                   { type: Boolean, default: false }
}, { _id: false });

const assessmentSchema = new mongoose.Schema({
  baby_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true },
  assessed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  baby_age_months: { type: Number, required: true },
  items: [itemSchema],

  total_items:     { type: Number, default: 0 },
  total_answered:  { type: Number, default: 0 },
  total_delays:    { type: Number, default: 0 },
  critical_delays: { type: Number, default: 0 },

  summary_status: { type: String, enum: ['Progressing normally', 'Monitor', 'Refer', null], default: null },
  recommendation: { type: String, default: '' },

  assessed_at: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MilestoneAssessment', assessmentSchema);