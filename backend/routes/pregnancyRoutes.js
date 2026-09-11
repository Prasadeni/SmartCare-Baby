const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pregnancyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start',              protect, ctrl.startPregnancy);
router.get('/current',             protect, ctrl.getCurrent);

router.get('/:id',                 protect, ctrl.getOne);
router.patch('/:id',               protect, ctrl.updateWeeks);

router.post('/:id/kick',           protect, ctrl.logKick);
router.get('/:id/kicks',           protect, ctrl.getKicks);

router.post('/:id/weight',         protect, ctrl.logWeight);
router.get('/:id/weights',         protect, ctrl.getWeights);

router.post('/:id/contraction',    protect, ctrl.logContraction);
router.get('/:id/contractions',    protect, ctrl.getContractions);

module.exports = router;