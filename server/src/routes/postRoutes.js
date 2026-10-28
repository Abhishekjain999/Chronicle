const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  getMyPosts,
  getCategoryStats,
} = require('../controllers/postController');
const {
  addComment,
  getPostComments,
} = require('../controllers/commentController');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  validatePost,
  validateComment,
} = require('../middleware/validation');
const { commentLimiter } = require('../middleware/rateLimiter');

// Post routes
router.route('/')
  .get(getPosts)
  .post(protect, validatePost, createPost);

router.get('/categories/stats', getCategoryStats);
router.get('/my-posts', protect, getMyPosts);

// Comment sub-routes on post
router.route('/:id/comments')
  .get(getPostComments)
  .post(protect, commentLimiter, validateComment, addComment);

// Slug route
router.get('/:slug', optionalAuth, getPostBySlug);

// ID-based routes for update & delete
router.route('/:id')
  .patch(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
