import express from 'express';
import SymptomConfig from '../models/SymptomConfig.js';
import MilestoneConfig from '../models/MilestoneConfig.js';
import MchatQuestion from '../models/MchatQuestion.js';
import { asyncHandler } from '../utils/helpers.js';

const router = express.Router();

// GET /api/symptoms/configs
router.get('/symptoms/configs', asyncHandler(async (req, res) => {
  const configs = await SymptomConfig.find({ isActive: true }).sort({ category: 1, symptomText: 1 });
  res.json({
    configs: configs.map((c) => ({
      id: c._id.toString(),
      category: c.category,
      symptomText: c.symptomText,
      weight: c.weight,
      isRedFlag: c.isRedFlag,
      ageMinMonths: c.ageMinMonths,
      ageMaxMonths: c.ageMaxMonths,
      guidanceText: c.guidanceText,
    })),
  });
}));

// GET /api/milestones/configs
router.get('/milestones/configs', asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.area) filter.area = req.query.area;
  const configs = await MilestoneConfig.find(filter).sort({ area: 1, expectedAgeMonths: 1 });
  res.json({
    configs: configs.map((c) => ({
      id: c._id.toString(),
      area: c.area,
      description: c.description,
      expectedAgeMonths: c.expectedAgeMonths,
      isCritical: c.isCritical,
    })),
  });
}));

// GET /api/mchat/questions
router.get('/mchat/questions', asyncHandler(async (req, res) => {
  const questions = await MchatQuestion.find({ isActive: true }).sort({ number: 1 });
  res.json({
    questions: questions.map((q) => ({
      number: q.number,
      text: q.text,
      isReverseScored: q.isReverseScored,
    })),
  });
}));

export default router;
