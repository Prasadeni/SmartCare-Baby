import express from 'express';
import VaccinationSchedule from '../models/VaccinationSchedule.js';
import VaccinationRecord from '../models/VaccinationRecord.js';
import Baby from '../models/Baby.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/helpers.js';

const router = express.Router();

function toPublicSchedule(s) {
  return {
    id: s._id.toString(),
    vaccineName: s.vaccineName,
    dueAgeMonths: s.dueAgeMonths,
    doseNumber: s.doseNumber,
    description: s.description,
    preventsDiseases: s.preventsDiseases,
    mandatory: s.mandatory,
  };
}

function toPublicRecord(r) {
  return {
    id: r._id.toString(),
    babyId: r.babyId.toString(),
    vaccineScheduleId: r.vaccineScheduleId.toString(),
    administeredDate: r.administeredDate.toISOString().split('T')[0],
    administeredBy: r.administeredBy,
    batchNumber: r.batchNumber,
    notes: r.notes,
  };
}

// GET /api/vaccinations/schedule
router.get(
  '/schedule',
  asyncHandler(async (req, res) => {
    const schedules = await VaccinationSchedule.find({ isActive: true }).sort({ dueAgeMonths: 1 });
    res.json({ schedules: schedules.map(toPublicSchedule) });
  })
);

// GET /api/vaccinations/records?babyId=xxx
router.get(
  '/records',
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
    const records = await VaccinationRecord.find(filter).sort({ administeredDate: -1 });
    res.json({ records: records.map(toPublicRecord) });
  })
);

// POST /api/vaccinations/records
router.post(
  '/records',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { babyId, vaccineScheduleId, administeredDate, administeredBy, batchNumber, notes } = req.body;
    if (!babyId || !vaccineScheduleId || !administeredDate) {
      return res.status(400).json({ message: 'babyId, vaccineScheduleId, and administeredDate are required' });
    }
    const baby = await Baby.findById(babyId);
    if (!baby) return res.status(404).json({ message: 'Baby not found' });
    if (baby.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const record = await VaccinationRecord.create({
      babyId,
      vaccineScheduleId,
      administeredDate: new Date(administeredDate),
      administeredBy: administeredBy || null,
      batchNumber: batchNumber || null,
      notes: notes || null,
    });
    res.status(201).json({ record: toPublicRecord(record) });
  })
);

export default router;