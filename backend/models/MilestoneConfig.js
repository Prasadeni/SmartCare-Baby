/**
 * MilestoneConfig Model - SmartCare Baby
 * Admin-managed master list of developmental milestones across 7 areas
 */

const mongoose = require('mongoose');

const milestoneConfigSchema = new mongoose.Schema({
  area: {
    type: String,
    enum: ['Gross Motor', 'Fine Motor', 'Language', 'Cognitive', 'Social', 'Self-Help', 'Hearing/Vision'],
    required: true,
  },
  description: { type: String, required: true, trim: true },
  expected_age_months: { type: Number, required: true },
  is_critical: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

milestoneConfigSchema.index({ area: 1, expected_age_months: 1 });

module.exports = mongoose.models.MilestoneConfig || mongoose.model('MilestoneConfig', milestoneConfigSchema);