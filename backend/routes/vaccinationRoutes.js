const express = require('express');
const router = express.Router();
const { getVaccinationSchedule, recordVaccination } = require('../controllers/vaccinationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/vaccinations/:babyId/schedule', protect, authorize('Registered', 'Admin'), getVaccinationSchedule);
router.post('/vaccinations/:babyId/record', protect, authorize('Registered', 'Admin'), recordVaccination);

module.exports = router;