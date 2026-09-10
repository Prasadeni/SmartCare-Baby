/**
 * Authentication Middleware - SmartCare Baby
 * Verifies JWT token and attaches user information to request object
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'smartcare_baby_super_secret_jwt_key_2026';
      const decoded = jwt.verify(token, secret);

      // Handle Guest user token
      if (decoded.role === 'Guest' && decoded.isGuest) {
        req.user = {
          id: decoded.id || 'guest_user',
          full_name: decoded.full_name || 'Guest User',
          email: decoded.email || 'guest@smartcarebaby.local',
          role: 'Guest',
          is_active: true,
        };
        return next();
      }

      const user = await User.findById(decoded.id).select('-password_hash');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized: User account no longer exists',
        });
      }

      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated. Please contact support.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('[Auth Middleware Error]:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Invalid or expired token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No token provided',
    });
  }
};

module.exports = { protect };