/**
 * User Model & Schema - SmartCare Baby
 * 
 * Fields:
 * - email (unique, required, lowercase)
 * - password_hash (required, minlength 6)
 * - role (enum: ['Registered', 'Guest', 'Admin'], default: 'Guest')
 * - full_name (required)
 * - phone
 * - street, city, state, postal_code, country
 * - latitude, longitude (numbers)
 * - reset_password_token, reset_password_expires
 * - is_active (default true)
 * - timestamps (createdAt, updatedAt)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password_hash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Hidden by default from queries
  },
  role: {
    type: String,
    enum: ['Registered', 'Guest', 'Admin'],
    default: 'Guest',
    required: true,
  },
  full_name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  street: {
    type: String,
    trim: true,
    default: '',
  },
  city: {
    type: String,
    trim: true,
    default: '',
  },
  state: {
    type: String,
    trim: true,
    default: '',
  },
  postal_code: {
    type: String,
    trim: true,
    default: '',
  },
  country: {
    type: String,
    trim: true,
    default: '',
  },
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  reset_password_token: {
    type: String,
    default: null,
    select: false,
  },
  reset_password_expires: {
    type: Date,
    default: null,
    select: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.password_hash;
      delete ret.reset_password_token;
      delete ret.reset_password_expires;
      delete ret.__v;
      return ret;
    },
  },
  toObject: { virtuals: true },
});

// Pre-save hook to hash password before saving to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare entered password with hashed password in database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;