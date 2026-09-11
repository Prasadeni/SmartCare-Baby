const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['registered_user', 'guest_user', 'admin'],
    default: 'registered_user'
  },
  full_name: { type: String, required: true },
  phone:     { type: String },
  city:      { type: String },
  country:   { type: String, default: 'Sri Lanka' },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);