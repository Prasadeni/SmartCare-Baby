/**
 * Emergency Controller - SmartCare Baby
 * Powers the Emergency Help page
 */

const EmergencyContact = require('../models/EmergencyContact');
const EmergencyFacility = require('../models/EmergencyFacility');

// @desc    Get the primary emergency banner (e.g., Call 911)
// @route   GET /api/emergency/primary
const getPrimaryEmergency = async (req, res) => {
  try {
    const primary = await EmergencyContact.findOne({
      category: 'Primary',
      is_active: true,
    });

    if (!primary) {
      return res.status(200).json({
        success: true,
        data: {
          service_name: 'Emergency',
          phone_number: '911',
          description: 'For immediate, life-threatening medical emergencies.',
          icon: 'emergency',
          color: '#BA1A1A',
        },
      });
    }

    res.status(200).json({ success: true, data: primary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get the 3 quick-action cards (Hospital, Pediatrician, Poison Control)
// @route   GET /api/emergency/quick-actions
const getQuickActions = async (req, res) => {
  try {
    const actions = await EmergencyContact.find({
      is_active: true,
      category: { $in: ['Hospital', 'Pediatrician', 'Poison_Control'] },
    }).sort({ category: 1 });

    res.status(200).json({ success: true, count: actions.length, data: actions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get nearby 24/7 facilities
// @route   GET /api/emergency/facilities
const getNearbyFacilities = async (req, res) => {
  try {
    const facilities = await EmergencyFacility.find({ is_active: true })
      .sort({ distance_km: 1 })
      .limit(20);

    res.status(200).json({ success: true, count: facilities.length, data: facilities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get everything for the emergency page in one call
// @route   GET /api/emergency/overview
const getEmergencyOverview = async (req, res) => {
  try {
    const [primary, quickActions, facilities] = await Promise.all([
      EmergencyContact.findOne({ category: 'Primary', is_active: true }),
      EmergencyContact.find({
        is_active: true,
        category: { $in: ['Hospital', 'Pediatrician', 'Poison_Control'] },
      }),
      EmergencyFacility.find({ is_active: true }).sort({ distance_km: 1 }).limit(10),
    ]);

    res.status(200).json({
      success: true,
      data: {
        primary: primary || {
          service_name: 'Emergency',
          phone_number: '911',
          description: 'For immediate, life-threatening medical emergencies.',
          icon: 'emergency',
          color: '#BA1A1A',
        },
        quick_actions: quickActions,
        facilities,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getPrimaryEmergency,
  getQuickActions,
  getNearbyFacilities,
  getEmergencyOverview,
};