const { body, validationResult } = require('express-validator');

/**
 * Middleware to check validation results
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('profileImage')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Profile image must be a valid URL'),
  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

const validatePost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Post title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Post content cannot be empty'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Please select a category'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage("Status must be either 'draft' or 'published'"),
  body('coverImage')
    .optional({ checkFalsy: true })
    .trim(),
  body('tags')
    .optional(),
  handleValidationErrors,
];

const validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content cannot be empty')
    .isLength({ max: 2000 })
    .withMessage('Comment cannot exceed 2000 characters'),
  handleValidationErrors,
];

const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('profileImage')
    .optional({ checkFalsy: true })
    .trim(),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validatePost,
  validateComment,
  validateUserUpdate,
  handleValidationErrors,
};
