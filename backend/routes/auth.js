// backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Baby from '../models/Baby.js';
import PregnancyTracker from '../models/PregnancyTracker.js';
import { signToken, toPublicUser, asyncHandler } from '../utils/helpers.js';
import { requireAuth } from '../middleware/auth.js';

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

// POST /api/auth/register
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password, fullName, role, phone, city, country } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters' });
    }
    if (!['Caregiver', 'PregnantMother'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      fullName,
      role,
      phone: phone || null,
      city: city || 'Colombo',
      country: country || 'Sri Lanka',
    });

    const token = signToken(user._id.toString());
    const flags = await userFlags(user);
    res.status(201).json({ token, user: toPublicUser(user, flags) });
  })
);

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id.toString());
    const flags = await userFlags(user);
    res.json({ token, user: toPublicUser(user, flags) });
  })
);

// GET /api/auth/me
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const flags = await userFlags(req.user);
    res.json({ user: toPublicUser(req.user, flags) });
  })
);

// POST /api/auth/logout
router.post('/logout', requireAuth, (req, res) => {
  res.json({ success: true });
});

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  asyncHandler(async (req, res) => {
    res.json({ success: true });
  })
);

export default router;