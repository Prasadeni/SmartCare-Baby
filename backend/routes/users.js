// backend/routes/users.js
import express from 'express';
import Baby from '../models/Baby.js';
import PregnancyTracker from '../models/PregnancyTracker.js';
import { requireAuth } from '../middleware/auth.js';
import { toPublicUser, asyncHandler } from '../utils/helpers.js';

const router = express.Router();

async function userFlags(user) {
  const [babyCount, pregnancy] = await Promise.all([
    Baby.countDocuments({ userId: user._id }),
    PregnancyTracker.exists({ userId: user._id, isCurrentPregnancy: true }),
  ]);
  return {
    hasBabies: babyCount > 0,
    hasActivePregnancy: !!pregnancy,
  };
}

// GET /api/users/me
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const flags = await userFlags(req.user);
    res.json({ user: toPublicUser(req.user, flags) });
  })
);

// PUT /api/users/me
router.put(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { fullName, phone, city, country, avatarUrl } = req.body;

    if (fullName) req.user.fullName = fullName;
    if (phone !== undefined) req.user.phone = phone;
    if (city) req.user.city = city;
    if (country) req.user.country = country;
    if (avatarUrl !== undefined) req.user.avatarUrl = avatarUrl || null;

    await req.user.save();

    const flags = await userFlags(req.user);
    res.json({ user: toPublicUser(req.user, flags) });
  })
);

export default router;