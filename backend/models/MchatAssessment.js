const mongoose = require('mongoose');

// Embedded response snapshot (audit trail — replaces MySQL's mchat_assessment_responses)
const responseSchema = new mongoose.Schema({
  question_number:     { type: Number,  required: true },
  question_text:       { type: String,  required: true },
  response_bool:       { type: Boolean, required: true },  // true = Yes, false = No
  is_at_risk_response: { type: Boolean, required: true },  // 1 point or 0 points
  reverse_scored:      { type: Boolean, default: false }
}, { _id: false });

const mchatAssessmentSchema = new mongoose.Schema({
  baby_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true },
  assessed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Session state (supports Save & Exit / resume)
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  current_question: { type: Number, default: 1 },

  // Snapshot at time of assessment
  baby_age_months: { type: Number, required: true },
  responses: [responseSchema],

  // Results (populated when status = 'completed')
  total_risk_score:  { type: Number, default: 0 },
  risk_level: {
    type: String,
    enum: ['Low', 'Medium', 'High', null],
    default: null
  },
  follow_up_needed: { type: Boolean, default: false },
  action_plan:      { type: String,  default: '' },

  assessed_at: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MchatAssessment', mchatAssessmentSchema);