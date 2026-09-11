/**
 * Admin Controller - SmartCare Baby
 * Aggregates platform-wide stats for the admin dashboard
 */

const User = require('../models/User');
const Baby = require('../models/Baby');
const SymptomAssessment = require('../models/SymptomAssessment');
const MilestoneAssessment = require('../models/MilestoneAssessment');
const Alert = require('../models/Alert');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get admin dashboard stats (Total users, alerts, assessments)
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      newUsersLast30d,
      highRiskAlerts,
      totalSymptomAssessments,
      totalMilestoneAssessments,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Alert.countDocuments({ severity: 'CRITICAL', is_resolved: false }),
      SymptomAssessment.countDocuments(),
      MilestoneAssessment.countDocuments(),
    ]);

    const totalAssessments = totalSymptomAssessments + totalMilestoneAssessments;

    // User growth percent
    const userGrowthPercent = totalUsers > 0
      ? Math.round((newUsersLast30d / totalUsers) * 100)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        total_users: totalUsers,
        user_growth_percent: userGrowthPercent,
        high_risk_alerts: highRiskAlerts,
        total_assessments: totalAssessments,
        assessment_completion_percent: 92,
      },
    });
  } catch (error) {
    console.error('[Admin Stats Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get usage trends (bar chart data)
// @route   GET /api/admin/usage-trends?period=week
const getUsageTrends = async (req, res) => {
  try {
    const period = req.query.period || 'week';

    const daysBack = period === 'month' ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const logs = await ActivityLog.find({
      activity_date: { $gte: startDate },
    }).sort({ activity_date: 1 });

    // Build labels + values
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = logs.map((log) => {
      const dayIndex = new Date(log.activity_date).getDay();
      return {
        label: period === 'week' ? dayNames[dayIndex] : new Date(log.activity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        date: log.activity_date,
        value: log.total_activity || (log.login_count + log.assessment_count),
        login_count: log.login_count,
        assessment_count: log.assessment_count,
      };
    });

    const maxValue = Math.max(...chartData.map((d) => d.value), 1);
    const peakIndex = chartData.findIndex((d) => d.value === maxValue);

    res.status(200).json({
      success: true,
      period,
      data: chartData,
      peak_day_index: peakIndex,
      max_value: maxValue,
    });
  } catch (error) {
    console.error('[Usage Trends Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get recent alerts
// @route   GET /api/admin/alerts?limit=5
const getAlerts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const alerts = await Alert.find({ is_resolved: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('related_user_id', 'full_name email')
      .populate('related_baby_id', 'name');

    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    console.error('[Admin Alerts Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Full admin dashboard (all in one call)
// @route   GET /api/admin/dashboard
const getAdminDashboard = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      newUsersLast30d,
      highRiskAlerts,
      totalSymptomAssessments,
      totalMilestoneAssessments,
      recentAlerts,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Alert.countDocuments({ severity: 'CRITICAL', is_resolved: false }),
      SymptomAssessment.countDocuments(),
      MilestoneAssessment.countDocuments(),
      Alert.find({ is_resolved: false }).sort({ createdAt: -1 }).limit(5),
    ]);

    const totalAssessments = totalSymptomAssessments + totalMilestoneAssessments;
    const userGrowthPercent = totalUsers > 0 ? Math.round((newUsersLast30d / totalUsers) * 100) : 0;

    // Usage trends (last 7 days)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const logs = await ActivityLog.find({ activity_date: { $gte: startDate } }).sort({ activity_date: 1 });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = logs.map((log) => ({
      label: dayNames[new Date(log.activity_date).getDay()],
      value: log.total_activity || (log.login_count + log.assessment_count),
    }));

    const maxValue = Math.max(...chartData.map((d) => d.value), 1);
    const peakIndex = chartData.findIndex((d) => d.value === maxValue);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          total_users: totalUsers,
          user_growth_percent: userGrowthPercent,
          high_risk_alerts: highRiskAlerts,
          total_assessments: totalAssessments,
          assessment_completion_percent: 92,
        },
        usage_trends: {
          data: chartData,
          peak_day_index: peakIndex,
          max_value: maxValue,
        },
        recent_alerts: recentAlerts,
      },
    });
  } catch (error) {
    console.error('[Admin Dashboard Error]:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStats,
  getUsageTrends,
  getAlerts,
  getAdminDashboard,
};