/**
 * Alert Model - SmartCare Baby
 * System-wide alerts for admin dashboard (critical, warning, system)
 */

const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  alert_type: {
    type: String,
    enum: ['Abnormal_HR', 'Missed_Assessment', 'Device_Sync_Error', 'High_Risk_Symptom', 'System_Update'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['CRITICAL', 'WARNING', 'SYSTEM'],
    default: 'WARNING',
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  related_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  related_baby_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', default: null },
  is_resolved: { type: Boolean, default: false },
  resolved_at: { type: Date, default: null },
}, { timestamps: true });

alertSchema.index({ severity: 1, createdAt: -1 });
alertSchema.index({ is_resolved: 1 });

module.exports = mongoose.models.Alert || mongoose.model('Alert', alertSchema);