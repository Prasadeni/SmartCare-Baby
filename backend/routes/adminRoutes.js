/**
 * Admin Routes - SmartCare Baby
 * All protected by Admin-only access
 */

const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsageTrends,
  getAlerts,
  getAdminDashboard,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Everything here requires Admin role
router.get('/admin/stats', protect, authorize('Admin'), getStats);
router.get('/admin/usage-trends', protect, authorize('Admin'), getUsageTrends);
router.get('/admin/alerts', protect, authorize('Admin'), getAlerts);
router.get('/admin/dashboard', protect, authorize('Admin'), getAdminDashboard);

module.exports = router;