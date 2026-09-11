const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password_hash');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no token' });
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Role not allowed' });
  }
  next();
};