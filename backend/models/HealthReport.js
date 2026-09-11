/**
 * HealthReport Model - SmartCare Baby
 * Stores generated report metadata for sharing
 */

const mongoose = require('mongoose');

const healthReportSchema = new mongoose.Schema({
  baby_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Baby',
    required: true,
    index: true,
  },
  generated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  report_type: {
    type: String,
    enum: ['Symptom', 'Growth', 'Milestone', 'Comprehensive'],
    default: 'Comprehensive',
  },
  share_token: {
    type: String,
    unique: true,
    sparse: true,
  },
  file_url: {
    type: String,
    default: null,
  },
  data_snapshot: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, { timestamps: true });

module.exports = mongoose.models.HealthReport || mongoose.model('HealthReport', healthReportSchema);