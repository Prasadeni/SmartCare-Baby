/**
 * Dashboard & Tracking Routes - SmartCare Baby
 */

const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { createLog, getLogs, deleteLog } = require('../controllers/dailyLogController');
const { createGrowth, getGrowthRecords, deleteGrowth } = require('../controllers/growthController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Dashboard
router.get('/dashboard/:babyId', protect, authorize('Registered', 'Admin'), getDashboard);

// Daily Logs
router.post('/babies/:babyId/logs', protect, authorize('Registered', 'Admin'), createLog);
router.get('/babies/:babyId/logs', protect, authorize('Registered', 'Admin'), getLogs);
router.delete('/logs/:id', protect, authorize('Registered', 'Admin'), deleteLog);

module.exports = router;
