/**
 * Growth Routes - SmartCare Baby
 */

const express = require('express');
const router = express.Router();

const {
  createGrowth,
  getGrowthRecords,
  getChartData,
  getInsights,
  getNextCheckup,
  deleteGrowth,
} = require('../controllers/growthController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Specific routes must be defined BEFORE generic :babyId routes
router.get('/growth/:babyId/chart', protect, authorize('Registered', 'Admin'), getChartData);
router.get('/growth/:babyId/insights', protect, authorize('Registered', 'Admin'), getInsights);
router.get('/growth/:babyId/next-checkup', protect, authorize('Registered', 'Admin'), getNextCheckup);

router.post('/growth/:babyId', protect, authorize('Registered', 'Admin'), createGrowth);
router.get('/growth/:babyId', protect, authorize('Registered', 'Admin'), getGrowthRecords);
router.delete('/growth/record/:id', protect, authorize('Registered', 'Admin'), deleteGrowth);

module.exports = router;