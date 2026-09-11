/**
 * Report Controller - SmartCare Baby
 * Aggregates health timeline, doctor preview, PDF generation
 */

const crypto = require('crypto');
const Baby = require('../models/Baby');
const GrowthRecord = require('../models/GrowthRecord');
const SymptomAssessment = require('../models/SymptomAssessment');
const MilestoneAssessment = require('../models/MilestoneAssessment');
const VaccinationRecord = require('../models/VaccinationRecord');
const VaccinationSchedule = require('../models/VaccinationSchedule');
const MaternalNote = require('../models/MaternalNote');
const HealthReport = require('../models/HealthReport');

// Helper
const verifyBaby = async (babyId, userId, role) => {
  const baby = await Baby.findById(babyId);
  if (!baby) return { error: 'Baby not found', status: 404 };
  if (baby.user_id.toString() !== userId && role !== 'Admin') {
    return { error: 'Not authorized', status: 403 };
  }
  return { baby };
};

const calculateAgeInMonths = (dob) => {
  const now = new Date();
  const birth = new Date(dob);
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
};

// @desc    Get chronological timeline of all health events
// @route   GET /api/reports/:babyId/timeline
const getTimeline = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const babyId = req.params.babyId;

    // Fetch from all sources in parallel
    const [growths, symptoms, milestones, vaccinations] = await Promise.all([
      GrowthRecord.find({ baby_id: babyId }).sort({ recorded_at: -1 }).limit(20),
      SymptomAssessment.find({ baby_id: babyId }).sort({ assessed_at: -1 }).limit(20),
      MilestoneAssessment.find({ baby_id: babyId }).sort({ assessed_at: -1 }).limit(20),
      VaccinationRecord.find({ baby_id: babyId })
        .populate('vaccine_schedule_id')
        .sort({ administered_date: -1 })
        .limit(20),
    ]);

    // Build unified timeline
    const timeline = [];

    // Growth events
    growths.forEach((g) => {
      timeline.push({
        event_id: g._id,
        event_type: 'Growth',
        title: 'Growth Measurement',
        description: `Weight: ${g.weight_kg} kg, Height: ${g.height_cm} cm`,
        tags: ['GROWTH'],
        date: g.recorded_at,
        source_type: 'GrowthRecord',
        severity: 'info',
      });
    });

    // Symptom events
    symptoms.forEach((s) => {
      const topSymptoms = s.answers.slice(0, 2).map((a) => a.symptom_text_snapshot).join(', ');
      timeline.push({
        event_id: s._id,
        event_type: 'Symptom',
        title: 'Symptom Assessment',
        description: `Reported: ${topSymptoms}. Risk: ${s.risk_level}. ${s.recommendation_text}`,
        tags: ['ILLNESS'],
        risk_level: s.risk_level,
        date: s.assessed_at,
        source_type: 'SymptomAssessment',
        severity: s.risk_level.toLowerCase(),
      });
    });

    // Milestone events
    milestones.forEach((m) => {
      const total = m.total_milestones_checked || 0;
      const achieved = m.total_achieved || 0;
      timeline.push({
        event_id: m._id,
        event_type: 'Milestone',
        title: 'Developmental Screening',
        description: `${achieved} of ${total} milestones achieved. ${m.total_delays} delay(s) detected.`,
        tags: ['MILESTONES'],
        date: m.assessed_at,
        source_type: 'MilestoneAssessment',
        severity: m.total_delays > 0 ? 'warning' : 'info',
      });
    });

    // Vaccination events
    vaccinations.forEach((v) => {
      const vaccineName = v.vaccine_schedule_id?.vaccine_name || 'Vaccine';
      timeline.push({
        event_id: v._id,
        event_type: 'Vaccination',
        title: `${vaccineName} Administered`,
        description: `Dose ${v.vaccine_schedule_id?.dose_number || 1} given. ${v.notes || ''}`,
        tags: ['VACCINATION'],
        date: v.administered_date,
        source_type: 'VaccinationRecord',
        severity: 'info',
      });
    });

    // Sort descending by date
    timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      count: timeline.length,
      baby: {
        id: check.baby._id,
        name: check.baby.name,
        age_months: calculateAgeInMonths(check.baby.dob),
      },
      timeline,
    });
  } catch (error) {
    console.error('[Timeline Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get doctor preview summary (weight, allergies, recent illness)
// @route   GET /api/reports/:babyId/doctor-preview
const getDoctorPreview = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const babyId = req.params.babyId;

    const [latestGrowth, recentSymptom] = await Promise.all([
      GrowthRecord.findOne({ baby_id: babyId }).sort({ recorded_at: -1 }),
      SymptomAssessment.findOne({ baby_id: babyId }).sort({ assessed_at: -1 }),
    ]);

    // Parse allergies from medical_notes (simple keyword check)
    let allergies = 'None';
    if (check.baby.medical_notes && check.baby.medical_notes.toLowerCase().includes('allerg')) {
      const match = check.baby.medical_notes.match(/allerg[^.]*\./i);
      if (match) allergies = match[0].trim();
    }

    // Recent illness from latest symptom assessment
    let recentIllness = 'None';
    if (recentSymptom) {
      const topSymptom = recentSymptom.answers[0]?.symptom_text_snapshot || 'Symptoms recorded';
      const dateStr = new Date(recentSymptom.assessed_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      recentIllness = `${topSymptom} (${dateStr})`;
    }

    // Weight in lbs (UI shows lbs)
    const weightLbs = latestGrowth ? Math.round(latestGrowth.weight_kg * 2.20462 * 10) / 10 : null;

    res.status(200).json({
      success: true,
      data: {
        current_weight_lbs: weightLbs,
        current_weight_kg: latestGrowth?.weight_kg || null,
        known_allergies: allergies,
        recent_illness: recentIllness,
        blood_group: check.baby.blood_group,
        age_months: calculateAgeInMonths(check.baby.dob),
      },
    });
  } catch (error) {
    console.error('[Doctor Preview Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Generate a shareable report (returns token + URL)
// @route   POST /api/reports/:babyId/share
const shareReport = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const shareToken = crypto.randomBytes(16).toString('hex');

    const report = await HealthReport.create({
      baby_id: req.params.babyId,
      generated_by: req.user.id,
      report_type: req.body.report_type || 'Comprehensive',
      share_token: shareToken,
    });

    res.status(201).json({
      success: true,
      message: 'Report generated for sharing',
      data: {
        report_id: report._id,
        share_token: shareToken,
        share_url: `http://localhost:5173/shared-report/${shareToken}`,
        created_at: report.createdAt,
      },
    });
  } catch (error) {
    console.error('[Share Report Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get report data as JSON (for frontend PDF generation)
// @route   GET /api/reports/:babyId/download
const getReportData = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const babyId = req.params.babyId;

    const [growths, symptoms, milestones, vaccinations, notes] = await Promise.all([
      GrowthRecord.find({ baby_id: babyId }).sort({ recorded_at: -1 }).limit(10),
      SymptomAssessment.find({ baby_id: babyId }).sort({ assessed_at: -1 }).limit(10),
      MilestoneAssessment.find({ baby_id: babyId }).sort({ assessed_at: -1 }).limit(10),
      VaccinationRecord.find({ baby_id: babyId })
        .populate('vaccine_schedule_id')
        .sort({ administered_date: -1 }),
      MaternalNote.find({ baby_id: babyId }).sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      report: {
        generated_at: new Date().toISOString(),
        baby: {
          name: check.baby.name,
          dob: check.baby.dob,
          gender: check.baby.gender,
          blood_group: check.baby.blood_group,
          medical_notes: check.baby.medical_notes,
        },
        growth_records: growths,
        symptom_assessments: symptoms,
        milestone_assessments: milestones,
        vaccinations,
        maternal_notes: notes,
      },
    });
  } catch (error) {
    console.error('[Report Data Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getTimeline, getDoctorPreview, shareReport, getReportData };