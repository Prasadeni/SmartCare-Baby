/**
 * Dashboard Controller - SmartCare Baby
 * Aggregates data from multiple collections to power the main dashboard UI
 */

const Baby = require('../models/Baby');
const DailyLog = require('../models/DailyLog');
const GrowthRecord = require('../models/GrowthRecord');
const MilestoneAssessment = require('../models/MilestoneAssessment');
const VaccinationSchedule = require('../models/VaccinationSchedule');
const VaccinationRecord = require('../models/VaccinationRecord');

const calculateAgeInMonths = (dob) => {
  const now = new Date();
  const birth = new Date(dob);
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
};

const getDashboard = async (req, res) => {
  try {
    const { babyId } = req.params;

    const baby = await Baby.findById(babyId);
    if (!baby) return res.status(404).json({ success: false, message: 'Baby not found' });

    if (baby.user_id.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const ageMonths = calculateAgeInMonths(baby.dob);
    const latestGrowth = await GrowthRecord.findOne({ baby_id: babyId }).sort({ recorded_at: -1 });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayLogs = await DailyLog.find({ baby_id: babyId, logged_at: { $gte: startOfToday } });
    const todayFeedCount = todayLogs.filter((log) =>
      log.log_type === 'Feed_Formula' || log.log_type === 'Feed_Breast'
    ).length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklySleepLogs = await DailyLog.find({
      baby_id: babyId, log_type: 'Sleep', logged_at: { $gte: sevenDaysAgo },
    });

    const totalWeeklySleep = weeklySleepLogs.reduce((sum, log) => sum + (log.duration_minutes || 0), 0);
    const avgDailySleepHours = weeklySleepLogs.length > 0 ? (totalWeeklySleep / 7 / 60).toFixed(1) : 0;

    const latestMilestone = await MilestoneAssessment.findOne({ baby_id: babyId }).sort({ assessed_at: -1 });
    let milestoneProgressPercent = 0;
    if (latestMilestone && latestMilestone.total_milestones_checked > 0) {
      milestoneProgressPercent = Math.round(
        (latestMilestone.total_achieved / latestMilestone.total_milestones_checked) * 100
      );
    }

    const administeredIds = await VaccinationRecord.find({ baby_id: babyId }).distinct('vaccine_schedule_id');
    const nextVaccination = await VaccinationSchedule.findOne({
      is_active: true,
      due_age_months: { $gte: ageMonths },
      _id: { $nin: administeredIds },
    }).sort({ due_age_months: 1 });

    const recentLogs = await DailyLog.find({ baby_id: babyId }).sort({ logged_at: -1 }).limit(5);

    let healthStatus = 'Healthy';
    if (milestoneProgressPercent < 50 || (latestMilestone && latestMilestone.total_delays > 2)) {
      healthStatus = 'Needs Attention';
    }

    res.status(200).json({
      success: true,
      data: {
        baby: {
          id: baby._id,
          name: baby.name,
          dob: baby.dob,
          gender: baby.gender,
          age_months: ageMonths,
          blood_group: baby.blood_group,
        },
        health_status: healthStatus,
        current_stats: {
          weight_kg: latestGrowth?.weight_kg || null,
          height_cm: latestGrowth?.height_cm || null,
          sleep_avg_hours: parseFloat(avgDailySleepHours),
          feeds_today: todayFeedCount,
        },
        health_tracking: {
          milestone_progress_percent: milestoneProgressPercent,
          growth_percentile: latestGrowth?.weight_percentile || 50,
        },
        next_vaccination: nextVaccination ? {
          vaccine_name: nextVaccination.vaccine_name,
          dose_number: nextVaccination.dose_number,
          due_age_months: nextVaccination.due_age_months,
          due_in_months: nextVaccination.due_age_months - ageMonths,
        } : null,
        recent_logs: recentLogs.map((log) => ({
          id: log._id,
          type: log.log_type,
          amount_ml: log.amount_ml,
          duration_minutes: log.duration_minutes,
          logged_at: log.logged_at,
          notes: log.notes,
        })),
      },
    });
  } catch (error) {
    console.error('[Dashboard Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboard };