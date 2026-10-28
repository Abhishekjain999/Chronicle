const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateMyProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateUserUpdate } = require('../middleware/validation');

// Current user profile update
router.patch('/me', protect, validateUserUpdate, updateMyProfile);

// Public profile view
router.get('/:id', getUserProfile);

module.exports = router;
