/**
 * Baby Routes - SmartCare Baby
 */

const express = require('express');
const router = express.Router();

const { createBaby, getBabies, getBabyById, updateBaby, deleteBaby } = require('../controllers/babyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .post(protect, authorize('Registered', 'Admin'), createBaby)
  .get(protect, authorize('Registered', 'Admin'), getBabies);

router.route('/:id')
  .get(protect, authorize('Registered', 'Admin'), getBabyById)
  .put(protect, authorize('Registered', 'Admin'), updateBaby)
  .delete(protect, authorize('Registered', 'Admin'), deleteBaby);

module.exports = router;