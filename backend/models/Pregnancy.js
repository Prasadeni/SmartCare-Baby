const mongoose = require('mongoose');

// Embedded kick session
const kickSessionSchema = new mongoose.Schema({
  timestamp:        { type: Date, default: Date.now },
  duration_minutes: { type: Number, required: true },   // how long the mother counted
  count:            { type: Number, required: true },   // total kicks felt
  alert_triggered:  { type: Boolean, default: false },  // true if count is low for the duration
  notes:            { type: String }
}, { _id: true });

// Embedded weight log
const weightLogSchema = new mongoose.Schema({
  log_date:            { type: Date, default: Date.now },
  weight_kg:           { type: Number, required: true },
  gestational_weeks:   { type: Number, required: true },  // auto-computed at save time
  notes:               { type: String }
}, { _id: true });

// Embedded contraction
const contractionSchema = new mongoose.Schema({
  start_time:       { type: Date, required: true },
  end_time:         { type: Date, required: true },
  duration_seconds: { type: Number, required: true },
  interval_minutes: { type: Number, default: 0 },         // gap since the previous contraction
  intensity:        { type: String, enum: ['Mild','Moderate','Severe'], default: 'Mild' },
  notes:            { type: String }
}, { _id: true });

const pregnancySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // User enters this at creation — number of completed weeks
  current_gestational_weeks: { type: Number, required: true, min: 0, max: 45 },
  started_at:                { type: Date, default: Date.now },   // when the user told us the week
  is_current:                { type: Boolean, default: true },

  // Embedded sub-documents
  kick_sessions: [kickSessionSchema],
  weight_logs:   [weightLogSchema],
  contractions:  [contractionSchema],

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Pregnancy', pregnancySchema);