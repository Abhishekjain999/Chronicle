const rateLimit = require('express-rate-limit');

// Auth limiter for login/register to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Comment limiter to prevent spamming
const commentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 60, // 60 comments per 10 mins
  message: {
    success: false,
    message: 'You are commenting too quickly. Please take a break and try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  commentLimiter,
  apiLimiter,
};
