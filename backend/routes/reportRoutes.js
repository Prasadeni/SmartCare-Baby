/**
 * Report & Note Routes - SmartCare Baby
 */

const express = require('express');
const router = express.Router();

const {
  getTimeline,
  getDoctorPreview,
  shareReport,
  getReportData,
} = require('../controllers/reportController');

const {
  createNote,
  getNotes,
  deleteNote,
} = require('../controllers/maternalNoteController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Timeline & Doctor Preview
router.get('/reports/:babyId/timeline', protect, authorize('Registered', 'Admin'), getTimeline);
router.get('/reports/:babyId/doctor-preview', protect, authorize('Registered', 'Admin'), getDoctorPreview);
router.get('/reports/:babyId/download', protect, authorize('Registered', 'Admin'), getReportData);
router.post('/reports/:babyId/share', protect, authorize('Registered', 'Admin'), shareReport);

// Maternal Notes
router.post('/notes/:babyId', protect, authorize('Registered', 'Admin'), createNote);
router.get('/notes/:babyId', protect, authorize('Registered', 'Admin'), getNotes);
router.delete('/notes/note/:id', protect, authorize('Registered', 'Admin'), deleteNote);

module.exports = router;