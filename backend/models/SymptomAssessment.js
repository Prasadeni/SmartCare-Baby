/**
 * SymptomAssessment Model - SmartCare Baby
 * Stores a symptom questionnaire session with snapshots of each answer
 * Ensures 100% reproducible and auditable outputs
 */

const mongoose = require('mongoose');

const symptomAnswerSchema = new mongoose.Schema({
  symptom_config_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SymptomConfig' },
  symptom_text_snapshot: { type: String, required: true },
  category_snapshot: { type: String, required: true },
  icon_snapshot: { type: String, default: 'help-circle' },
  weight_snapshot: { type: Number, required: true },
  is_red_flag_snapshot: { type: Boolean, default: false },
  present: { type: Boolean, required: true },
}, { _id: false });

const symptomAssessmentSchema = new mongoose.Schema({
  baby_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', required: true, index: true },
  assessed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total_score: { type: Number, required: true },
  risk_level: {
    type: String,
    enum: ['Green', 'Yellow', 'Red'],
    required: true,
  },
  emergency_alert: { type: Boolean, default: false },
  triggering_red_flags: { type: [String], default: [] },
  scoring_formula: { type: String, default: 'SUM_WEIGHTS_WITH_RED_FLAG_OVERRIDE' },
  recommendation_text: { type: String, required: true },
  recommended_specialty: { type: String, default: null },
  answers: [symptomAnswerSchema],
  notes: { type: String, default: '' },
  assessed_at: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

symptomAssessmentSchema.index({ baby_id: 1, assessed_at: -1 });
symptomAssessmentSchema.index({ risk_level: 1, assessed_at: -1 });

module.exports = mongoose.models.SymptomAssessment || mongoose.model('SymptomAssessment', symptomAssessmentSchema);