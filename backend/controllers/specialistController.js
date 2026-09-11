/**
 * Specialist Controller - SmartCare Baby
 * Powers the "Consult a Specialist" page
 */

const Specialist = require('../models/Specialist');
const Clinic = require('../models/Clinic');
const Baby = require('../models/Baby');
const SymptomAssessment = require('../models/SymptomAssessment');
const MilestoneAssessment = require('../models/MilestoneAssessment');

const verifyBaby = async (babyId, userId, role) => {
  const baby = await Baby.findById(babyId);
  if (!baby) return { error: 'Baby not found', status: 404 };
  if (baby.user_id.toString() !== userId && role !== 'Admin') {
    return { error: 'Not authorized', status: 403 };
  }
  return { baby };
};

const calcAgeMonths = (dob) => {
  const now = new Date();
  const birth = new Date(dob);
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
};

// @desc    Get recommended specialists + nearby clinics for a baby
// @route   GET /api/specialists/recommendations/:babyId
const getRecommendations = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const babyId = req.params.babyId;

    // 1. Get latest assessments to determine WHY a specialist is needed
    const [latestSymptom, latestMilestone] = await Promise.all([
      SymptomAssessment.findOne({ baby_id: babyId }).sort({ assessed_at: -1 }),
      MilestoneAssessment.findOne({ baby_id: babyId }).sort({ assessed_at: -1 }),
    ]);

    // 2. Determine recommended specialty + reason text
    let recommendedSpecialty = null;
    let reasonText = `Based on general developmental guidance, we recommend consulting a pediatric specialist for ${check.baby.name}.`;

    if (latestSymptom && latestSymptom.risk_level !== 'Green') {
      recommendedSpecialty = latestSymptom.recommended_specialty;
      const topSymptom = latestSymptom.answers[0]?.symptom_text_snapshot || 'recent symptoms';
      reasonText = `Based on the recent screening results for Baby ${check.baby.name}, we recommend consulting with a ${recommendedSpecialty || 'pediatric specialist'} to discuss ${topSymptom.toLowerCase()} and related concerns. Here are highly-rated professionals nearby.`;
    } else if (latestMilestone && latestMilestone.total_delays > 0) {
      recommendedSpecialty = 'Developmental Pediatrician';
      reasonText = `Based on the recent milestone screening for Baby ${check.baby.name}, we recommend consulting with a ${recommendedSpecialty} to discuss developmental delays. Here are highly-rated professionals nearby.`;
    }

    // 3. Fetch specialists — filter by specialty if we have a recommendation, otherwise all
    const specialistFilter = { is_active: true };
    if (recommendedSpecialty) {
      specialistFilter.specialty = new RegExp(recommendedSpecialty.split(' ')[0], 'i');
    }

    let specialists = await Specialist.find(specialistFilter)
      .sort({ rating: -1 })
      .limit(5);

    // If no specialists matched the recommended specialty, fall back to top-rated
    if (specialists.length === 0) {
      specialists = await Specialist.find({ is_active: true }).sort({ rating: -1 }).limit(5);
    }

    // 4. Fetch nearby clinics
    const clinics = await Clinic.find({ is_active: true }).sort({ distance_km: 1 }).limit(5);

    res.status(200).json({
      success: true,
      baby: {
        id: check.baby._id,
        name: check.baby.name,
        age_months: calcAgeMonths(check.baby.dob),
      },
      recommendation: {
        reason_text: reasonText,
        recommended_specialty: recommendedSpecialty,
        based_on: latestSymptom
          ? { type: 'Symptom', risk_level: latestSymptom.risk_level, date: latestSymptom.assessed_at }
          : latestMilestone
          ? { type: 'Milestone', total_delays: latestMilestone.total_delays, date: latestMilestone.assessed_at }
          : { type: 'General', date: null },
      },
      specialists,
      clinics,
    });
  } catch (error) {
    console.error('[Specialist Recommendations Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single specialist profile
// @route   GET /api/specialists/profile/:id
const getSpecialistProfile = async (req, res) => {
  try {
    const specialist = await Specialist.findById(req.params.id);
    if (!specialist) return res.status(404).json({ success: false, message: 'Specialist not found' });
    res.status(200).json({ success: true, data: specialist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getRecommendations, getSpecialistProfile };