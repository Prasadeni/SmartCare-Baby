// backend/routes/assessments.js
import express from 'express';
import SymptomConfig from '../models/SymptomConfig.js';
import MilestoneConfig from '../models/MilestoneConfig.js';
import MchatQuestion from '../models/MchatQuestion.js';
import SymptomAssessment from '../models/SymptomAssessment.js';
import MilestoneAssessment from '../models/MilestoneAssessment.js';
import MchatAssessment from '../models/MchatAssessment.js';
import Baby from '../models/Baby.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/helpers.js';

const router = express.Router();

// Ensure the requesting user owns the baby
async function assertOwnsBaby(userId, babyId, userRole) {
  const baby = await Baby.findById(babyId);
  if (!baby) {
    const err = new Error('Baby not found');
    err.status = 404;
    throw err;
  }
  if (baby.userId.toString() !== userId.toString() && userRole !== 'Admin') {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return baby;
}

/* ══════════════════════════════════════════════════════════════
   SYMPTOM ASSESSMENTS
   ══════════════════════════════════════════════════════════════ */

// POST /api/assessments/symptoms
router.post('/symptoms', requireAuth, asyncHandler(async (req, res) => {
  const { babyId, answers = [] } = req.body;
  if (!babyId) return res.status(400).json({ message: 'babyId is required' });
  await assertOwnsBaby(req.user._id, babyId, req.user.role);

  const configs = await SymptomConfig.find({ isActive: true });
  const byId = new Map(configs.map((c) => [c._id.toString(), c]));

  let totalScore = 0;
  const redFlagsTriggered = [];
  const detailed = [];

  answers.forEach((a) => {
    const cfg = byId.get(a.configId);
    if (!cfg) return;
    if (a.present) {
      totalScore += cfg.weight;
      if (cfg.isRedFlag) redFlagsTriggered.push(cfg.symptomText);
    }
    detailed.push({
      configId: cfg._id.toString(),
      category: cfg.category,
      symptomText: cfg.symptomText,
      weight: cfg.weight,
      isRedFlag: cfg.isRedFlag,
      guidanceText: cfg.guidanceText,
      present: !!a.present,
    });
  });

  let riskLevel = 'Green';
  if (redFlagsTriggered.length > 0) riskLevel = 'Red';
  else if (totalScore >= 8) riskLevel = 'Red';
  else if (totalScore >= 4) riskLevel = 'Yellow';

  const recommendations = {
    Green: 'Monitor at home. Symptoms appear mild. Keep your baby hydrated and observe for 24 hours.',
    Yellow: 'Consult a pediatrician within 24 hours. Symptoms warrant professional review.',
    Red: 'Seek immediate medical care. Red-flag symptoms or high score detected.',
  };

  const assessment = await SymptomAssessment.create({
    babyId,
    assessedBy: req.user._id,
    totalScore,
    riskLevel,
    emergencyAlert: riskLevel === 'Red',
    triggeringRedFlags: redFlagsTriggered,
    recommendationText: recommendations[riskLevel],
    answers: detailed,
  });

  res.status(201).json({
    assessment: {
      id: assessment._id.toString(),
      babyId: assessment.babyId.toString(),
      assessedAt: assessment.assessedAt,
      totalScore: assessment.totalScore,
      riskLevel: assessment.riskLevel,
      emergencyAlert: assessment.emergencyAlert,
      triggeringRedFlags: assessment.triggeringRedFlags,
      recommendationText: assessment.recommendationText,
      answers: assessment.answers,
    },
  });
}));

// GET /api/assessments/symptoms?babyId=xxx  (list)
router.get('/symptoms', requireAuth, asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.babyId) filter.babyId = req.query.babyId;
  const assessments = await SymptomAssessment.find(filter).sort({ assessedAt: -1 }).limit(50);
  res.json({
    assessments: assessments.map((a) => ({
      id: a._id.toString(),
      babyId: a.babyId.toString(),
      assessedAt: a.assessedAt,
      totalScore: a.totalScore,
      riskLevel: a.riskLevel,
      emergencyAlert: a.emergencyAlert,
    })),
  });
}));

// GET /api/assessments/symptoms/:id  (single, full detail)
router.get('/symptoms/:id', requireAuth, asyncHandler(async (req, res) => {
  const a = await SymptomAssessment.findById(req.params.id);
  if (!a) return res.status(404).json({ message: 'Assessment not found' });
  await assertOwnsBaby(req.user._id, a.babyId, req.user.role);
  res.json({
    assessment: {
      id: a._id.toString(),
      babyId: a.babyId.toString(),
      assessedAt: a.assessedAt,
      totalScore: a.totalScore,
      riskLevel: a.riskLevel,
      emergencyAlert: a.emergencyAlert,
      triggeringRedFlags: a.triggeringRedFlags,
      recommendationText: a.recommendationText,
      answers: a.answers,
    },
  });
}));

/* ══════════════════════════════════════════════════════════════
   MILESTONE ASSESSMENTS
   ══════════════════════════════════════════════════════════════ */

// POST /api/assessments/milestones
router.post('/milestones', requireAuth, asyncHandler(async (req, res) => {
  const { babyId, items = [] } = req.body;
  if (!babyId) return res.status(400).json({ message: 'babyId is required' });
  await assertOwnsBaby(req.user._id, babyId, req.user.role);

  const notAchieved = items.filter((i) => i.achieved === false).length;
  const totalItems = items.length;
  const percentAchieved = totalItems > 0
    ? Math.round(((totalItems - notAchieved) / totalItems) * 100)
    : 0;

  const assessment = await MilestoneAssessment.create({
    babyId,
    assessedBy: req.user._id,
    totalDelays: notAchieved,
    percentAchieved,
    items,
  });

  res.status(201).json({
    assessment: {
      id: assessment._id.toString(),
      babyId: assessment.babyId.toString(),
      assessedAt: assessment.assessedAt,
      totalDelays: assessment.totalDelays,
      percentAchieved: assessment.percentAchieved,
      items: assessment.items,
    },
  });
}));

// GET /api/assessments/milestones?babyId=xxx  (list)
router.get('/milestones', requireAuth, asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.babyId) filter.babyId = req.query.babyId;
  const assessments = await MilestoneAssessment.find(filter).sort({ assessedAt: -1 }).limit(50);
  res.json({
    assessments: assessments.map((a) => ({
      id: a._id.toString(),
      babyId: a.babyId.toString(),
      assessedAt: a.assessedAt,
      totalDelays: a.totalDelays,
      percentAchieved: a.percentAchieved,
    })),
  });
}));

// GET /api/assessments/milestones/:id  (single, joined with config)
router.get('/milestones/:id', requireAuth, asyncHandler(async (req, res) => {
  const a = await MilestoneAssessment.findById(req.params.id);
  if (!a) return res.status(404).json({ message: 'Assessment not found' });
  await assertOwnsBaby(req.user._id, a.babyId, req.user.role);

  const configs = await MilestoneConfig.find({ isActive: true });
  const byId = new Map(configs.map((c) => [c._id.toString(), c]));

  const items = a.items.map((item) => {
    const cfg = byId.get(item.configId);
    return {
      configId: item.configId,
      achieved: item.achieved,
      area: cfg?.area || 'Unknown',
      description: cfg?.description || '(removed)',
      expectedAgeMonths: cfg?.expectedAgeMonths ?? null,
      isCritical: cfg?.isCritical ?? false,
    };
  });

  res.json({
    assessment: {
      id: a._id.toString(),
      babyId: a.babyId.toString(),
      assessedAt: a.assessedAt,
      totalDelays: a.totalDelays,
      percentAchieved: a.percentAchieved,
      items,
    },
  });
}));

/* ══════════════════════════════════════════════════════════════
   M-CHAT-R ASSESSMENTS
   ══════════════════════════════════════════════════════════════ */

// POST /api/assessments/mchat
router.post('/mchat', requireAuth, asyncHandler(async (req, res) => {
  const { babyId, answers = [] } = req.body;
  if (!babyId) return res.status(400).json({ message: 'babyId is required' });
  await assertOwnsBaby(req.user._id, babyId, req.user.role);

  // Fetch questions from DB to use their real reverse-scoring flags
  const questions = await MchatQuestion.find({ isActive: true }).sort({ number: 1 });
  const byNumber = new Map(questions.map((q) => [q.number, q]));

  let riskScore = 0;
  const detailedAnswers = [];

  questions.forEach((q) => {
    const submitted = answers.find((a) => a.questionNumber === q.number);
    const response = submitted ? !!submitted.response : null;

    let isRisk = false;
    if (response !== null) {
      if (q.isReverseScored && response === true) isRisk = true;
      if (!q.isReverseScored && response === false) isRisk = true;
      if (isRisk) riskScore += 1;
    }

    detailedAnswers.push({
      questionNumber: q.number,
      text: q.text,
      response,
      isReverseScored: q.isReverseScored,
      isRisk,
    });
  });

  let riskLevel = 'Low';
  if (riskScore >= 8) riskLevel = 'High';
  else if (riskScore >= 3) riskLevel = 'Medium';

  const actionPlans = {
    Low: 'Low likelihood of autism based on this screening. Continue routine monitoring and discuss at your next pediatrician visit.',
    Medium: 'Follow-up recommended. Discuss these results with your pediatrician and consider developmental screening.',
    High: 'Immediate specialist consultation recommended. Please contact a developmental pediatrician for full evaluation.',
  };

  const assessment = await MchatAssessment.create({
    babyId,
    assessedBy: req.user._id,
    totalRiskScore: riskScore,
    riskLevel,
    followUpNeeded: riskLevel !== 'Low',
    actionPlan: actionPlans[riskLevel],
    answers: detailedAnswers,
  });

  res.status(201).json({
    assessment: {
      id: assessment._id.toString(),
      babyId: assessment.babyId.toString(),
      assessedAt: assessment.assessedAt,
      totalRiskScore: assessment.totalRiskScore,
      riskLevel: assessment.riskLevel,
      followUpNeeded: assessment.followUpNeeded,
      actionPlan: assessment.actionPlan,
      answers: assessment.answers,
    },
  });
}));

// GET /api/assessments/mchat?babyId=xxx  (list)
router.get('/mchat', requireAuth, asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.babyId) filter.babyId = req.query.babyId;
  const assessments = await MchatAssessment.find(filter).sort({ assessedAt: -1 }).limit(50);
  res.json({
    assessments: assessments.map((a) => ({
      id: a._id.toString(),
      babyId: a.babyId.toString(),
      assessedAt: a.assessedAt,
      totalRiskScore: a.totalRiskScore,
      riskLevel: a.riskLevel,
    })),
  });
}));

// GET /api/assessments/mchat/:id  (single, full answers)
router.get('/mchat/:id', requireAuth, asyncHandler(async (req, res) => {
  const a = await MchatAssessment.findById(req.params.id);
  if (!a) return res.status(404).json({ message: 'Assessment not found' });
  await assertOwnsBaby(req.user._id, a.babyId, req.user.role);
  res.json({
    assessment: {
      id: a._id.toString(),
      babyId: a.babyId.toString(),
      assessedAt: a.assessedAt,
      totalRiskScore: a.totalRiskScore,
      riskLevel: a.riskLevel,
      followUpNeeded: a.followUpNeeded,
      actionPlan: a.actionPlan,
      answers: a.answers || [],
    },
  });
}));

export default router;