/**
 * Growth Controller - SmartCare Baby
 * Handles growth records, percentiles, charts, insights, and next-checkup
 */

const GrowthRecord = require('../models/GrowthRecord');
const Baby = require('../models/Baby');
const VaccinationSchedule = require('../models/VaccinationSchedule');
const VaccinationRecord = require('../models/VaccinationRecord');
const { calculatePercentile } = require('../utils/percentileCalculator');

// Helper: verify baby ownership
const verifyBaby = async (babyId, userId, role) => {
  const baby = await Baby.findById(babyId);
  if (!baby) return { error: 'Baby not found', status: 404 };
  if (baby.user_id.toString() !== userId && role !== 'Admin') {
    return { error: 'Not authorized', status: 403 };
  }
  return { baby };
};

// Helper: calculate age in months
const calculateAgeInMonths = (dob, atDate = new Date()) => {
  const birth = new Date(dob);
  const now = new Date(atDate);
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
};

// @desc    Create a growth entry (auto-calculates percentiles)
// @route   POST /api/growth/:babyId
// @access  Private
const createGrowth = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const { weight_kg, height_cm, head_circumference_cm, notes } = req.body;

    if (!weight_kg || !height_cm) {
      return res.status(400).json({
        success: false,
        message: 'Please provide weight_kg and height_cm',
      });
    }

    const ageMonths = calculateAgeInMonths(check.baby.dob);
    const sex = check.baby.gender;

    const weight_percentile = calculatePercentile(sex, ageMonths, 'weight', Number(weight_kg));
    const height_percentile = calculatePercentile(sex, ageMonths, 'height', Number(height_cm));
    const head_percentile = head_circumference_cm
      ? calculatePercentile(sex, ageMonths, 'head', Number(head_circumference_cm))
      : null;

    const growth = await GrowthRecord.create({
      baby_id: req.params.babyId,
      recorded_by: req.user.id,
      baby_age_months: ageMonths,
      weight_kg: Number(weight_kg),
      height_cm: Number(height_cm),
      head_circumference_cm: head_circumference_cm ? Number(head_circumference_cm) : null,
      weight_percentile,
      height_percentile,
      head_percentile,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Growth record created',
      data: growth,
    });
  } catch (error) {
    console.error('[Create Growth Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all growth records for a baby
// @route   GET /api/growth/:babyId
// @access  Private
const getGrowthRecords = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const records = await GrowthRecord.find({ baby_id: req.params.babyId }).sort({ recorded_at: 1 });
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get chart data (Weight or Height over time) + latest percentiles
// @route   GET /api/growth/:babyId/chart?metric=weight|height|head
// @access  Private
const getChartData = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const metric = req.query.metric || 'weight';
    const metricField = {
      weight: 'weight_kg',
      height: 'height_cm',
      head: 'head_circumference_cm',
    }[metric];

    if (!metricField) {
      return res.status(400).json({ success: false, message: 'Invalid metric' });
    }

    const records = await GrowthRecord.find({ baby_id: req.params.babyId })
      .sort({ recorded_at: 1 })
      .select(`baby_age_months ${metricField} recorded_at`);

    // Build chart points
    const chartData = records
      .filter((r) => r[metricField] !== null && r[metricField] !== undefined)
      .map((r) => ({
        age_months: r.baby_age_months,
        value: r[metricField],
        date: r.recorded_at,
      }));

    // Latest record
    const latest = records.length > 0 ? records[records.length - 1] : null;

    res.status(200).json({
      success: true,
      metric,
      unit: metric === 'weight' ? 'kg' : 'cm',
      chart_data: chartData,
      latest: latest
        ? {
            age_months: latest.baby_age_months,
            value: latest[metricField],
            date: latest.recorded_at,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get latest percentiles panel + growth insight
// @route   GET /api/growth/:babyId/insights
// @access  Private
const getInsights = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const latest = await GrowthRecord.findOne({ baby_id: req.params.babyId }).sort({ recorded_at: -1 });

    if (!latest) {
      return res.status(200).json({
        success: true,
        data: {
          percentiles: { weight: null, height: null, head: null },
          insight: 'No growth records yet. Start tracking to see insights.',
        },
      });
    }

    // Calculate trend (compare last 2 records)
    const previous = await GrowthRecord.findOne({
      baby_id: req.params.babyId,
      recorded_at: { $lt: latest.recorded_at },
    }).sort({ recorded_at: -1 });

    let trend = 'stable';
    if (previous) {
      if (latest.weight_percentile > previous.weight_percentile + 3) trend = 'increasing';
      else if (latest.weight_percentile < previous.weight_percentile - 3) trend = 'decreasing';
    }

    // Generate insight text based on percentile
    let insightText = '';
    const wp = latest.weight_percentile;
    const hp = latest.height_percentile;

    if (wp >= 15 && wp <= 85 && hp >= 15 && hp <= 85) {
      insightText = `${check.baby.name} is growing beautifully along the ${Math.round(wp)}th percentile curve for weight.`;
    } else if (wp < 15) {
      insightText = `${check.baby.name}'s weight is below the 15th percentile. Consider consulting a pediatrician.`;
    } else if (wp > 85) {
      insightText = `${check.baby.name}'s weight is above the 85th percentile. This is generally healthy, but keep monitoring.`;
    } else {
      insightText = `${check.baby.name} is growing steadily. Keep tracking regularly for best insights.`;
    }

    res.status(200).json({
      success: true,
      data: {
        percentiles: {
          weight: latest.weight_percentile,
          height: latest.height_percentile,
          head: latest.head_percentile,
        },
        trend,
        insight: insightText,
        last_recorded: latest.recorded_at,
        age_months: latest.baby_age_months,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get next checkup / vaccination due
// @route   GET /api/growth/:babyId/next-checkup
// @access  Private
const getNextCheckup = async (req, res) => {
  try {
    const check = await verifyBaby(req.params.babyId, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    const ageMonths = calculateAgeInMonths(check.baby.dob);
    const administeredIds = await VaccinationRecord.find({ baby_id: req.params.babyId }).distinct(
      'vaccine_schedule_id'
    );

    const nextVaccination = await VaccinationSchedule.findOne({
      is_active: true,
      due_age_months: { $gte: ageMonths },
      _id: { $nin: administeredIds },
    }).sort({ due_age_months: 1 });

    if (!nextVaccination) {
      return res.status(200).json({
        success: true,
        data: { message: 'All vaccinations up to date!' },
      });
    }

    const dueInMonths = nextVaccination.due_age_months - ageMonths;
    const dueInWeeks = Math.max(0, Math.round(dueInMonths * 4.3));

    res.status(200).json({
      success: true,
      data: {
        vaccine_name: nextVaccination.vaccine_name,
        dose_number: nextVaccination.dose_number,
        due_age_months: nextVaccination.due_age_months,
        current_age_months: ageMonths,
        due_in_months: dueInMonths,
        due_in_weeks: dueInWeeks,
        message: `Due for ${nextVaccination.due_age_months} month vaccinations in ${dueInWeeks} week(s).`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete a growth record
// @route   DELETE /api/growth/record/:id
// @access  Private
const deleteGrowth = async (req, res) => {
  try {
    const record = await GrowthRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });

    const check = await verifyBaby(record.baby_id, req.user.id, req.user.role);
    if (check.error) return res.status(check.status).json({ success: false, message: check.error });

    await record.deleteOne();
    res.status(200).json({ success: true, message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createGrowth,
  getGrowthRecords,
  getChartData,
  getInsights,
  getNextCheckup,
  deleteGrowth,
};