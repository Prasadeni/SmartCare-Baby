/**
 * Auth Controller - SmartCare Baby
 * Handles Register, Login, Guest Session, Forgot Password, and Reset Password
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId, role, email) => {
  const secret = process.env.JWT_SECRET || 'smartcare_baby_super_secret_jwt_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    { id: userId, role, email },
    secret,
    { expiresIn }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      role,
      phone,
      street,
      city,
      state,
      postal_code,
      country,
      latitude,
      longitude,
    } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and full name',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const userRole = role && ['Registered', 'Guest', 'Admin'].includes(role)
      ? role
      : 'Registered';

    const user = await User.create({
      full_name,
      email: email.toLowerCase(),
      password_hash: password,
      role: userRole,
      phone: phone || '',
      street: street || '',
      city: city || '',
      state: state || '',
      postal_code: postal_code || '',
      country: country || '',
      latitude: latitude !== undefined ? Number(latitude) : null,
      longitude: longitude !== undefined ? Number(longitude) : null,
    });

    const token = generateToken(user._id, user.role, user.email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        state: user.state,
        country: user.country,
        latitude: user.latitude,
        longitude: user.longitude,
        is_active: user.is_active,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Register Controller Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

// @desc    Authenticate user & return token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password_hash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    const token = generateToken(user._id, user.role, user.email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        state: user.state,
        country: user.country,
        latitude: user.latitude,
        longitude: user.longitude,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    console.error('[Login Controller Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// @desc    Create temporary Guest session & return guest JWT
// @route   POST /api/auth/guest
// @access  Public
const guestSession = async (req, res) => {
  try {
    const guestId = `guest_${crypto.randomBytes(8).toString('hex')}`;
    const guestEmail = `${guestId}@guest.smartcarebaby.local`;
    const guestName = req.body.full_name || 'Guest User';

    const secret = process.env.JWT_SECRET || 'smartcare_baby_super_secret_jwt_key_2026';
    const token = jwt.sign(
      {
        id: guestId,
        role: 'Guest',
        isGuest: true,
        email: guestEmail,
        full_name: guestName,
      },
      secret,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Guest session created successfully',
      token,
      user: {
        id: guestId,
        full_name: guestName,
        email: guestEmail,
        role: 'Guest',
        isGuest: true,
      },
    });
  } catch (error) {
    console.error('[Guest Session Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating guest session',
      error: error.message,
    });
  }
};

// @desc    Generate password reset token & return it
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email address',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.reset_password_token = hashedToken;
    user.reset_password_expires = Date.now() + 3600000; // 1 hour

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Password reset token generated successfully. Valid for 1 hour.',
      reset_token: resetToken,
      expires_at: new Date(user.reset_password_expires).toISOString(),
    });
  } catch (error) {
    console.error('[Forgot Password Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing password reset request',
      error: error.message,
    });
  }
};

// @desc    Reset password using valid token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, reset_token, new_password, password } = req.body;

    const rawToken = token || reset_token;
    const newPassword = new_password || password;

    if (!rawToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the reset token and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const user = await User.findOne({
      reset_password_token: hashedToken,
      reset_password_expires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token',
      });
    }

    user.password_hash = newPassword;
    user.reset_password_token = undefined;
    user.reset_password_expires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error('[Reset Password Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  guestSession,
  forgotPassword,
  resetPassword,
};