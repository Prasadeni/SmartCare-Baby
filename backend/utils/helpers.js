// backend/utils/helpers.js
import jwt from 'jsonwebtoken';

export function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export function toPublicUser(user, extra = {}) {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.passwordHash;
  return {
    id: obj._id.toString(),
    email: obj.email,
    fullName: obj.fullName,
    role: obj.role,
    phone: obj.phone || null,
    city: obj.city,
    country: obj.country,
    avatarUrl: obj.avatarUrl || null,
    createdAt: obj.createdAt,
    ...extra,
  };
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}