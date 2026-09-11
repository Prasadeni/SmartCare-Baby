const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mchatController');
const { protect } = require('../middleware/authMiddleware');

// Order matters — /questions and /start must come BEFORE /:id
router.get('/questions',        protect, ctrl.getQuestions);
router.post('/start',           protect, ctrl.startAssessment);
router.get('/history/:babyId',  protect, ctrl.getHistory);
router.get('/:id',              protect, ctrl.getOne);
router.patch('/:id/answer',     protect, ctrl.saveAnswer);
router.post('/:id/complete',    protect, ctrl.completeAssessment);

module.exports = router;