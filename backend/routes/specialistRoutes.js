const express = require('express');
const router = express.Router();
const { getRecommendations, getSpecialistProfile } = require('../controllers/specialistController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Specific routes first
router.get('/specialists/recommendations/:babyId', protect, authorize('Registered', 'Admin'), getRecommendations);
router.get('/specialists/profile/:id', protect, getSpecialistProfile);

module.exports = router;