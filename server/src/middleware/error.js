import { ApiError } from '../utils/ApiError.js';

export function notFound(req, res, next) {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} was not found.`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong on our side.';
  let details = err.details;

  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Please check the highlighted fields and try again.';
    details = Object.values(err.errors).map((item) => item.message);
  }

  if (err.name === 'CastError') {
    status = 400;
    message = 'That identifier is not valid.';
  }

  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message =
      field === 'email'
        ? 'An account with this email already exists.'
        : 'A record with these details already exists.';
  }

  if (status >= 500) {
    console.error('[api] Unhandled error:', err);
    message = 'Something went wrong on our side. Please try again.';
  }

  res.status(status).json({
    message,
    ...(details ? { details } : {})
  });
}
