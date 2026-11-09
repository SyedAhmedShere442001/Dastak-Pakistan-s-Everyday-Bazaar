import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { signToken } from '../utils/token.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const phone = String(req.body.phone || '').trim();

  const errors = [];
  if (name.length < 2) errors.push('Please enter your full name.');
  if (!EMAIL_PATTERN.test(email)) errors.push('Please enter a valid email address.');
  if (password.length < 6) errors.push('Password must be at least 6 characters long.');
  if (errors.length) throw new ApiError(400, errors[0], errors);

  const existing = await User.exists({ email });
  if (existing) throw new ApiError(409, 'An account with this email already exists.');

  const user = await User.create({ name, email, password, phone });
  const token = signToken(user);

  res.status(201).json({ token, user: user.toSafeJSON() });
});

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!email || !password) {
    throw new ApiError(400, 'Enter your email and password to continue.');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Those email and password details do not match.');
  }

  const token = signToken(user);
  res.json({ token, user: user.toSafeJSON() });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  if (typeof req.body.name === 'string') {
    const name = req.body.name.trim();
    if (name.length < 2) throw new ApiError(400, 'Please enter your full name.');
    user.name = name;
  }

  if (typeof req.body.phone === 'string') {
    user.phone = req.body.phone.trim();
  }

  if (req.body.newPassword) {
    if (String(req.body.newPassword).length < 6) {
      throw new ApiError(400, 'Your new password must be at least 6 characters long.');
    }
    if (!req.body.currentPassword) {
      throw new ApiError(400, 'Enter your current password to set a new one.');
    }
    const matches = await user.comparePassword(String(req.body.currentPassword));
    if (!matches) throw new ApiError(401, 'Your current password is incorrect.');
    user.password = String(req.body.newPassword);
  }

  await user.save();

  const safeUser = await User.findById(user._id);
  res.json({ user: safeUser.toSafeJSON() });
});
