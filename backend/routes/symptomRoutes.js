/**
 * Symptom Routes - SmartCare Baby
 */

const express = require('express');
const router = express.Router();

const {
  getSymptoms,
  getCategories,
  assessSymptoms,
  getAssessmentHistory,
  getAssessmentById,
} = require('../controllers/symptomController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public-ish endpoints for authenticated users
router.get('/symptoms', protect, getSymptoms);
router.get('/symptoms/categories', protect, getCategories);

// Protected endpoints (only Registered/Admin)
router.post('/symptoms/assess', protect, authorize('Registered', 'Admin'), assessSymptoms);
router.get('/symptoms/history/:babyId', protect, authorize('Registered', 'Admin'), getAssessmentHistory);
router.get('/symptoms/assessment/:id', protect, authorize('Registered', 'Admin'), getAssessmentById);

module.exports = router;