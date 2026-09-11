/**
 * DailyLog Model - SmartCare Baby
 * Tracks daily activities: feeds, sleep, diapers, etc.
 */

const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  baby_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baby',
    required: true,
    index: true,
  },
  log_type: {
    type: String,
    enum: ['Feed_Formula', 'Feed_Breast', 'Sleep', 'Diaper', 'Medicine', 'Note'],
    required: true,
  },
  logged_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount_ml: { type: Number, default: null },
  duration_minutes: { type: Number, default: null },
  diaper_type: { type: String, enum: ['Wet', 'Dirty', 'Both', null], default: null },
  notes: { type: String, default: '' },
  logged_at: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

dailyLogSchema.index({ baby_id: 1, logged_at: -1 });

module.exports = mongoose.models.DailyLog || mongoose.model('DailyLog', dailyLogSchema);