/**
 * Auth Routes - SmartCare Baby
 * Defines API endpoints for authentication, guest access, password management, and role authorization
 */

const express = require('express');
const router = express.Router();

const {
  register,
  login,
  guestSession,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/guest', guestSession);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Role-protected endpoints
router.get('/me', protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

router.post(
  '/baby-profiles',
  protect,
  authorize('Registered', 'Admin'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Access granted: Baby profile management available for Registered/Admin users.',
      userRole: req.user.role,
    });
  }
);

router.get(
  '/admin/dashboard',
  protect,
  authorize('Admin'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to the SmartCare Baby Admin Panel.',
      user: req.user,
    });
  }
);

module.exports = router;