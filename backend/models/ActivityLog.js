/**
 * ActivityLog Model - SmartCare Baby
 * Daily activity counts for the System Usage Trends chart
 */

const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  activity_date: { type: Date, required: true, index: true },
  login_count: { type: Number, default: 0 },
  assessment_count: { type: Number, default: 0 },
  new_users: { type: Number, default: 0 },
  total_activity: { type: Number, default: 0 },
}, { timestamps: true });

activityLogSchema.index({ activity_date: -1 });

module.exports = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);