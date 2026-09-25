// backend/routes/babies.js
import express from 'express';
import Baby from '../models/Baby.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/helpers.js';

const router = express.Router();

function toPublicBaby(b) {
  const obj = b.toObject ? b.toObject() : b;
  return {
    id: obj._id.toString(),
    userId: obj.userId.toString(),
    name: obj.name,
    dob: obj.dob.toISOString().split('T')[0],
    gender: obj.gender,
    birthWeightKg: obj.birthWeightKg,
    birthHeightCm: obj.birthHeightCm,
    bloodGroup: obj.bloodGroup,
    photoUrl: obj.photoUrl || null,  
    createdAt: obj.createdAt,
  };
}

// GET /api/babies
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const babies = await Baby.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ babies: babies.map(toPublicBaby) });
  })
);

// POST /api/babies
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { name, dob, gender, birthWeightKg, birthHeightCm, bloodGroup } = req.body;
    if (!name || !dob) {
      return res.status(400).json({ message: 'Name and date of birth are required' });
    }
    const baby = await Baby.create({
      userId: req.user._id,
      name,
      dob: new Date(dob),
      gender: gender || 'other',
      birthWeightKg: Number(birthWeightKg) || 0,
      birthHeightCm: Number(birthHeightCm) || 0,
      bloodGroup: bloodGroup || 'Unknown',
      photoUrl: req.body.photoUrl || null, 
    });
    res.status(201).json({ baby: toPublicBaby(baby) });
  })
);

// GET /api/babies/:id
router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const baby = await Baby.findById(req.params.id);
    if (!baby) return res.status(404).json({ message: 'Baby not found' });
    if (
      baby.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json({ baby: toPublicBaby(baby) });
  })
);

// PUT /api/babies/:id
router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const baby = await Baby.findById(req.params.id);
    if (!baby) return res.status(404).json({ message: 'Baby not found' });
    if (
      baby.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const fields = ['name', 'gender', 'bloodGroup', 'medicalNotes', 'photoUrl'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) baby[f] = req.body[f];
    });
    if (req.body.dob) baby.dob = new Date(req.body.dob);
    if (req.body.birthWeightKg != null) baby.birthWeightKg = Number(req.body.birthWeightKg);
    if (req.body.birthHeightCm != null) baby.birthHeightCm = Number(req.body.birthHeightCm);

    await baby.save();
    res.json({ baby: toPublicBaby(baby) });
  })
);

// DELETE /api/babies/:id
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const baby = await Baby.findById(req.params.id);
    if (!baby) return res.status(404).json({ message: 'Baby not found' });
    if (
      baby.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await baby.deleteOne();
    res.json({ success: true });
  })
);

export default router;