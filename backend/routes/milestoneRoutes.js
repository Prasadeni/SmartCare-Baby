const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/milestoneController');
const { protect } = require('../middleware/authMiddleware');

// ⚠️ Order matters — specific routes BEFORE parameterized ones
router.get('/config',              protect, ctrl.getConfig);
router.post('/start',              protect, ctrl.startAssessment);
router.get('/history/:babyId',     protect, ctrl.getHistory);

// Public HTML result page (no auth — for browser viewing)
router.get('/summary/:id/view',    ctrl.viewResultHtml);

// Protected JSON endpoints
router.get('/summary/:id',         protect, ctrl.getSummary);
router.get('/:id',                 protect, ctrl.getOne);
router.patch('/:id/answer',        protect, ctrl.saveAnswer);
router.post('/:id/complete',       protect, ctrl.completeAssessment);

module.exports = router;