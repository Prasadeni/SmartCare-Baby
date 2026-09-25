import express from 'express';
import GrowthRecord from '../models/GrowthRecord.js';
import Baby from '../models/Baby.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/helpers.js';

const router = express.Router();

function toPublicGrowth(g) {
  return {
    id: g._id.toString(),
    babyId: g.babyId.toString(),
    recordedAt: g.recordedAt,
    babyAgeMonths: g.babyAgeMonths,
    weightKg: g.weightKg,
    heightCm: g.heightCm,
    headCircumferenceCm: g.headCircumferenceCm,
    weightPercentile: g.weightPercentile,
    heightPercentile: g.heightPercentile,
    headPercentile: g.headPercentile,
    notes: g.notes,
  };
}

// GET /api/growth?babyId=xxx
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.babyId) {
      const baby = await Baby.findById(req.query.babyId);
      if (!baby) return res.status(404).json({ message: 'Baby not found' });
      if (baby.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      filter.babyId = req.query.babyId;
    } else {
      const owned = await Baby.find({ userId: req.user._id }).select('_id');
      filter.babyId = { $in: owned.map((b) => b._id) };
    }

    const records = await GrowthRecord.find(filter).sort({ babyAgeMonths: 1 });
    res.json({ records: records.map(toPublicGrowth) });
  })
);

// POST /api/growth
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { babyId, recordedAt, weightKg, heightCm, headCircumferenceCm } = req.body;
    if (!babyId) return res.status(400).json({ message: 'babyId is required' });
    if (!weightKg || !heightCm) {
      return res.status(400).json({ message: 'weightKg and heightCm are required' });
    }

    const baby = await Baby.findById(babyId);
    if (!baby) return res.status(404).json({ message: 'Baby not found' });
    if (baby.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Compute age in months from dob to recordedAt
    const recDate = recordedAt ? new Date(recordedAt) : new Date();
    const dob = new Date(baby.dob);
    let ageMonths =
      (recDate.getFullYear() - dob.getFullYear()) * 12 +
      (recDate.getMonth() - dob.getMonth());
    if (recDate.getDate() < dob.getDate()) ageMonths -= 1;
    if (ageMonths < 0) ageMonths = 0;

    // Simple percentile estimate (real impl uses WHO tables)
    const w = Number(weightKg);
    const h = Number(heightCm);
    const hc = Number(headCircumferenceCm) || 0;
    const weightPercentile = Math.min(99, Math.max(1, Math.round(50 + (w - 3.3) * 8)));
    const heightPercentile = Math.min(99, Math.max(1, Math.round(50 + (h - 50) * 1.5)));
    const headPercentile = Math.min(99, Math.max(1, Math.round(50 + (hc - 34) * 2)));

    const record = await GrowthRecord.create({
      babyId,
      recordedBy: req.user._id,
      recordedAt: recDate,
      babyAgeMonths: ageMonths,
      weightKg: w,
      heightCm: h,
      headCircumferenceCm: hc,
      weightPercentile,
      heightPercentile,
      headPercentile,
      notes: req.body.notes || null,
    });

    res.status(201).json({ record: toPublicGrowth(record) });
  })
);

export default router;
