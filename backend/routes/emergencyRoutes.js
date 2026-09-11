const express = require('express');
const router = express.Router();
const {
  getPrimaryEmergency,
  getQuickActions,
  getNearbyFacilities,
  getEmergencyOverview,
} = require('../controllers/emergencyController');

// Public endpoints — no auth required (emergencies shouldn't need login!)
router.get('/emergency/primary', getPrimaryEmergency);
router.get('/emergency/quick-actions', getQuickActions);
router.get('/emergency/facilities', getNearbyFacilities);
router.get('/emergency/overview', getEmergencyOverview);

module.exports = router;