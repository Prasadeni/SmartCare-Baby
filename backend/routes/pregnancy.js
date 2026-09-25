import express from 'express';
import PregnancyTracker from '../models/PregnancyTracker.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/helpers.js';

const router = express.Router();

function toPublicPregnancy(p) {
  if (!p) return null;
  return {
    id: p._id.toString(),
    userId: p.userId.toString(),
    expectedDueDate: p.expectedDueDate.toISOString().split('T')[0],
    lmpDate: p.lmpDate ? p.lmpDate.toISOString().split('T')[0] : null,
    currentGestationalAgeWeeks: p.currentGestationalAgeWeeks,
    isCurrentPregnancy: p.isCurrentPregnancy,
    createdAt: p.createdAt,
  };
}

async function getActivePregnancy(userId) {
  return PregnancyTracker.findOne({ userId, isCurrentPregnancy: true });
}

// GET /api/pregnancy/tracker
router.get(
  '/tracker',
  requireAuth,
  asyncHandler(async (req, res) => {
    const pregnancy = await getActivePregnancy(req.user._id);
    res.json({ pregnancy: toPublicPregnancy(pregnancy) });
  })
);

// POST /api/pregnancy/tracker
router.post(
  '/tracker',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { expectedDueDate, lmpDate, currentGestationalAgeWeeks } = req.body;
    if (!expectedDueDate) {
      return res.status(400).json({ message: 'expectedDueDate is required' });
    }

    // Deactivate previous pregnancy
    await PregnancyTracker.updateMany(
      { userId: req.user._id, isCurrentPregnancy: true },
      { $set: { isCurrentPregnancy: false } }
    );

    const pregnancy = await PregnancyTracker.create({
      userId: req.user._id,
      expectedDueDate: new Date(expectedDueDate),
      lmpDate: lmpDate ? new Date(lmpDate) : null,
      currentGestationalAgeWeeks: Number(currentGestationalAgeWeeks) || 0,
      isCurrentPregnancy: true,
    });

    res.status(201).json({ pregnancy: toPublicPregnancy(pregnancy) });
  })
);

// ── KICKS ────────────────────────────────────────────────────
router.get(
  '/kicks',
  requireAuth,
  asyncHandler(async (req, res) => {
    const pregnancy = await getActivePregnancy(req.user._id);
    if (!pregnancy) return res.json({ kicks: [] });

    const kicks = [...pregnancy.kicks]
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((k) => ({
        id: k._id.toString(),
        pregnancyTrackerId: pregnancy._id.toString(),
        timestamp: k.timestamp,
        durationMinutes: k.durationMinutes,
        count: k.count,
        alertTriggered: k.alertTriggered,
        notes: k.notes,
      }));

    res.json({ kicks });
  })
);

router.post(
  '/kicks',
  requireAuth,
  asyncHandler(async (req, res) => {
    const pregnancy = await getActivePregnancy(req.user._id);
    if (!pregnancy) return res.status(404).json({ message: 'No active pregnancy' });

    const count = Number(req.body.count) || 0;
    const durationMinutes = Number(req.body.durationMinutes) || 0;

    const kick = {
      timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date(),
      durationMinutes,
      count,
      alertTriggered: count < 10 && durationMinutes >= 120,
      notes: req.body.notes || null,
    };

    pregnancy.kicks.push(kick);
    await pregnancy.save();

    const saved = pregnancy.kicks[pregnancy.kicks.length - 1];
    res.status(201).json({
      kick: {
        id: saved._id.toString(),
        pregnancyTrackerId: pregnancy._id.toString(),
        timestamp: saved.timestamp,
        durationMinutes: saved.durationMinutes,
        count: saved.count,
        alertTriggered: saved.alertTriggered,
        notes: saved.notes,
      },
    });
  })
);

// ── CONTRACTIONS ─────────────────────────────────────────────
router.get(
  '/contractions',
  requireAuth,
  asyncHandler(async (req, res) => {
    const pregnancy = await getActivePregnancy(req.user._id);
    if (!pregnancy) return res.json({ contractions: [] });

    const contractions = [...pregnancy.contractions]
      .sort((a, b) => b.startTime - a.startTime)
      .map((c) => ({
        id: c._id.toString(),
        pregnancyTrackerId: pregnancy._id.toString(),
        startTime: c.startTime,
        endTime: c.endTime,
        durationSeconds: c.durationSeconds,
        intervalMinutes: c.intervalMinutes,
        intensity: c.intensity,
        notes: c.notes,
      }));

    res.json({ contractions });
  })
);

router.post(
  '/contractions',
  requireAuth,
  asyncHandler(async (req, res) => {
    const pregnancy = await getActivePregnancy(req.user._id);
    if (!pregnancy) return res.status(404).json({ message: 'No active pregnancy' });

    const contraction = {
      startTime: req.body.startTime ? new Date(req.body.startTime) : new Date(),
      endTime: req.body.endTime ? new Date(req.body.endTime) : new Date(),
      durationSeconds: Number(req.body.durationSeconds) || 0,
      intervalMinutes: Number(req.body.intervalMinutes) || 0,
      intensity: req.body.intensity || 'Mild',
      notes: req.body.notes || null,
    };

    pregnancy.contractions.push(contraction);
    await pregnancy.save();

    const saved = pregnancy.contractions[pregnancy.contractions.length - 1];
    res.status(201).json({
      contraction: {
        id: saved._id.toString(),
        pregnancyTrackerId: pregnancy._id.toString(),
        startTime: saved.startTime,
        endTime: saved.endTime,
        durationSeconds: saved.durationSeconds,
        intervalMinutes: saved.intervalMinutes,
        intensity: saved.intensity,
        notes: saved.notes,
      },
    });
  })
);

// ── WEIGHT LOGS ──────────────────────────────────────────────
router.get(
  '/weight-logs',
  requireAuth,
  asyncHandler(async (req, res) => {
    const pregnancy = await getActivePregnancy(req.user._id);
    if (!pregnancy) return res.json({ weightLogs: [] });

    const weightLogs = [...pregnancy.weightLogs]
      .sort((a, b) => b.logDate - a.logDate)
      .map((w) => ({
        id: w._id.toString(),
        pregnancyTrackerId: pregnancy._id.toString(),
        logDate: w.logDate.toISOString().split('T')[0],
        weightKg: w.weightKg,
        gestationalAgeWeeks: w.gestationalAgeWeeks,
        notes: w.notes,
      }));

    res.json({ weightLogs });
  })
);

router.post(
  '/weight-logs',
  requireAuth,
  asyncHandler(async (req, res) => {
    const pregnancy = await getActivePregnancy(req.user._id);
    if (!pregnancy) return res.status(404).json({ message: 'No active pregnancy' });

    const weightLog = {
      logDate: req.body.logDate ? new Date(req.body.logDate) : new Date(),
      weightKg: Number(req.body.weightKg) || 0,
      gestationalAgeWeeks: Number(req.body.gestationalAgeWeeks) || 0,
      notes: req.body.notes || null,
    };

    pregnancy.weightLogs.push(weightLog);
    await pregnancy.save();

    const saved = pregnancy.weightLogs[pregnancy.weightLogs.length - 1];
    res.status(201).json({
      weightLog: {
        id: saved._id.toString(),
        pregnancyTrackerId: pregnancy._id.toString(),
        logDate: saved.logDate.toISOString().split('T')[0],
        weightKg: saved.weightKg,
        gestationalAgeWeeks: saved.gestationalAgeWeeks,
        notes: saved.notes,
      },
    });
  })
);

router.delete(
  '/weight-logs/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const pregnancy = await getActivePregnancy(req.user._id);
    if (!pregnancy) return res.status(404).json({ message: 'No active pregnancy' });

    const sub = pregnancy.weightLogs.id(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Weight log not found' });

    sub.deleteOne();
    await pregnancy.save();
    res.json({ success: true });
  })
);

export default router;
