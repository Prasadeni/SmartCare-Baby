// backend/routes/auth.js
import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Baby from '../models/Baby.js';
import PregnancyTracker from '../models/PregnancyTracker.js';
import { signToken, toPublicUser, asyncHandler } from '../utils/helpers.js';
import { requireAuth } from '../middleware/auth.js';
import { sendPasswordResetEmail } from '../utils/email.js';

const router = express.Router();

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

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

    if (user.isActive === false) {
      return res.status(403).json({
        message: 'Your account has been deactivated. Please contact support.',
      });
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
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success so we don't leak which emails are registered
    if (!user) {
      return res.json({
        success: true,
        message: 'If that email is registered, a reset link has been sent.',
      });
    }

    // Generate a cryptographically secure random token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail({
        to: user.email,
        fullName: user.fullName,
        resetUrl,
      });
      console.log(`✉️  Password reset email sent to ${user.email}`);
    } catch (err) {
      console.error('❌ Failed to send reset email:', err.message);
      // Clear the token so a failed send doesn't leave a stale one
      user.resetToken = null;
      user.resetTokenExpiresAt = null;
      await user.save();
      return res
        .status(500)
        .json({ message: 'Could not send reset email. Please try again later.' });
    }

    res.json({
      success: true,
      message: 'If that email is registered, a reset link has been sent.',
    });
  })
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Token and new password are required' });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters' });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'This reset link is invalid or has expired.' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiresAt = null;
    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset. You can now sign in.',
    });
  })
);

export default router;