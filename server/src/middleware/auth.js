import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      throw new ApiError(401, 'Please sign in to continue.');
    }

    const token = header.slice(7).trim();
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dastak-dev-secret');
    const user = await User.findById(payload.sub);

    if (!user) {
      throw new ApiError(401, 'Your session has expired. Please sign in again.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Your session has expired. Please sign in again.'));
    }
    next(error);
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return next(new ApiError(403, 'Admin access is required for this action.'));
  }
  next();
}
