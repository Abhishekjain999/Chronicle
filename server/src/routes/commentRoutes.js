const express = require('express');
const router = express.Router();
const {
  updateComment,
  deleteComment,
  getReceivedComments,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { validateComment } = require('../middleware/validation');

// Dashboard helper
router.get('/received', protect, getReceivedComments);

// Individual comment routes
router.route('/:id')
  .patch(protect, validateComment, updateComment)
  .delete(protect, deleteComment);

module.exports = router;
