/**
 * Symptom Controller - SmartCare Baby
 * Rule-based risk stratification engine with red-flag override
 */

const SymptomConfig = require('../models/SymptomConfig');
const SymptomAssessment = require('../models/SymptomAssessment');
const RiskThreshold = require('../models/RiskThreshold');
const SpecialtyMapping = require('../models/SpecialtyMapping');
const Baby = require('../models/Baby');

// Helper: verify baby ownership
const verifyBaby = async (babyId, userId, role) => {
  const baby = await Baby.findById(babyId);
  if (!baby) return { error: 'Baby not found', status: 404 };
  if (baby.user_id.toString() !== userId && role !== 'Admin') {
    return { error: 'Not authorized', status: 403 };
  }
  return { baby };
};

// @desc    Get all active symptoms (optional ?category= and ?babyId= filters)
// @route   GET /api/symptoms
// @access  Private
const getSymptoms = async (req, res) => {
  try {
    const { babyId, category } = req.query;
    const filter = { is_active: true };

    if (category) filter.category = category;

    if (babyId) {
      const baby = await Baby.findById(babyId);
      if (baby) {
        const now = new Date();
        const dob = new Date(baby.dob);
        const ageMonths = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
        filter.age_min_months = { $lte: ageMonths };
        filter.age_max_months = { $gte: ageMonths };
      }
    }

    const symptoms = await SymptomConfig.find(filter).sort({ category: 1, weight: -1 });

    // Group by category for convenient frontend rendering
    const grouped = { Feeding: [], Activity: [], Physical: [], Mood: [] };
    for (const s of symptoms) {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    }

    res.status(200).json({
      success: true,
      count: symptoms.length,
      grouped,
      data: symptoms,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get category list (for sidebar)
// @route   GET /api/symptoms/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = [
      { key: 'Feeding', label: 'Feeding', icon: 'restaurant' },
      { key: 'Activity', label: 'Activity', icon: 'directions-run' },
      { key: 'Physical', label: 'Physical', icon: 'healing' },
      { key: 'Mood', label: 'Mood', icon: 'mood' },
    ];
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Submit symptom assessment (RULE ENGINE)
// @route   POST /api/symptoms/assess
// @access  Private
const assessSymptoms = async (req, res) => {
  try {
    const { baby_id, symptom_ids, notes } = req.body;

    if (!baby_id || !Array.isArray(symptom_ids)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide baby_id and an array of symptom_ids',
      });
    }

    const check = await verifyBaby(baby_id, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    // Fetch all selected symptoms
    const symptoms = await SymptomConfig.find({ _id: { $in: symptom_ids }, is_active: true });

    // ---------- RULE ENGINE ----------
    let totalScore = 0;
    const redFlagsTriggered = [];
    const answers = [];

    for (const symptom of symptoms) {
      totalScore += symptom.weight;
      if (symptom.is_red_flag) redFlagsTriggered.push(symptom.symptom_text);

      answers.push({
        symptom_config_id: symptom._id,
        symptom_text_snapshot: symptom.symptom_text,
        category_snapshot: symptom.category,
        icon_snapshot: symptom.icon,
        weight_snapshot: symptom.weight,
        is_red_flag_snapshot: symptom.is_red_flag,
        present: true,
      });
    }

    // ---------- RISK CLASSIFICATION ----------
    let riskLevel = 'Green';
    let recommendationText = 'All good. Continue normal care and monitor at home.';
    let recommendedSpecialty = null;
    let emergencyAlert = false;

    // RULE 1: Any red flag → RED immediately (override)
    if (redFlagsTriggered.length > 0) {
      riskLevel = 'Red';
      emergencyAlert = true;
      recommendationText = 'EMERGENCY: Critical symptoms detected. Please seek immediate medical care.';
    } else {
      // RULE 2: Score-based classification via RiskThresholds
      const thresholds = await RiskThreshold.find({
        assessment_type: 'Symptom',
        is_active: true,
      }).sort({ min_score: 1 });

      for (const t of thresholds) {
        if (totalScore >= t.min_score && totalScore <= t.max_score) {
          riskLevel = t.risk_level;
          recommendationText = t.recommendation_text;
          break;
        }
      }
    }

    // ---------- SPECIALTY MAPPING ----------
    if (riskLevel !== 'Green' && symptoms.length > 0) {
      const topCategory = symptoms.sort((a, b) => b.weight - a.weight)[0].category;
      const mapping = await SpecialtyMapping.findOne({
        trigger_condition: new RegExp(topCategory, 'i'),
        is_active: true,
      }).sort({ priority: 1 });

      if (mapping) recommendedSpecialty = mapping.recommended_specialty;
      else if (riskLevel === 'Red') recommendedSpecialty = 'Emergency Physician';
      else recommendedSpecialty = 'Pediatrician';
    }

    // ---------- SAVE ASSESSMENT ----------
    const assessment = await SymptomAssessment.create({
      baby_id,
      assessed_by: req.user.id,
      total_score: totalScore,
      risk_level: riskLevel,
      emergency_alert: emergencyAlert,
      triggering_red_flags: redFlagsTriggered,
      recommendation_text: recommendationText,
      recommended_specialty: recommendedSpecialty,
      answers,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Assessment completed',
      data: {
        assessment_id: assessment._id,
        total_score: totalScore,
        risk_level: riskLevel,
        emergency_alert: emergencyAlert,
        triggering_red_flags: redFlagsTriggered,
        recommendation_text: recommendationText,
        recommended_specialty: recommendedSpecialty,
        assessed_at: assessment.assessed_at,
      },
    });
  } catch (error) {
    console.error('[Symptom Assessment Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get assessment history for a baby
// @route   GET /api/symptoms/history/:babyId
// @access  Private
const getAssessmentHistory = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const assessments = await SymptomAssessment.find({ baby_id: req.params.babyId })
      .sort({ assessed_at: -1 })
      .limit(50);

    res.status(200).json({ success: true, count: assessments.length, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single assessment details
// @route   GET /api/symptoms/assessment/:id
// @access  Private
const getAssessmentById = async (req, res) => {
  try {
    const assessment = await SymptomAssessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found' });

    const check = await verifyBaby(assessment.baby_id, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    res.status(200).json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getSymptoms,
  getCategories,
  assessSymptoms,
  getAssessmentHistory,
  getAssessmentById,
};