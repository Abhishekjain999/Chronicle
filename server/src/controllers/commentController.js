const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { sanitizeContent } = require('../utils/sanitize');

/**
 * @desc    Add comment to a post
 * @route   POST /api/posts/:id/comments
 * @access  Private
 */
const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const sanitizedContent = sanitizeContent(content);

    const comment = await Comment.create({
      post: id,
      author: req.user._id,
      content: sanitizedContent,
    });

    await comment.populate('author', 'name email profileImage');

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully',
      comment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get comments for a specific post
 * @route   GET /api/posts/:id/comments
 * @access  Public
 */
const getPostComments = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comments = await Comment.find({ post: id })
      .populate('author', 'name email profileImage')
      .sort({ createdAt: 1 }); // Chronological order

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a comment
 * @route   PATCH /api/comments/:id
 * @access  Private (Comment author only)
 */
const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Only comment author can edit
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only edit your own comments.',
      });
    }

    comment.content = sanitizeContent(content);
    await comment.save();
    await comment.populate('author', 'name email profileImage');

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      comment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private (Comment author OR Post author for moderation)
 */
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id).populate('post', 'author title');
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    const isCommentAuthor =
      comment.author.toString() === req.user._id.toString();
    const isPostAuthor =
      comment.post &&
      comment.post.author.toString() === req.user._id.toString();

    // Must be either comment author OR post author (moderator)
    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to delete this comment.',
      });
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: isPostAuthor && !isCommentAuthor
        ? 'Comment removed by post author moderation.'
        : 'Comment deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get comments received on posts authored by current user (for dashboard review/moderation)
 * @route   GET /api/comments/received
 * @access  Private
 */
const getReceivedComments = async (req, res, next) => {
  try {
    const myPosts = await Post.find({ author: req.user._id }).select('_id title slug');
    const myPostIds = myPosts.map((p) => p._id);

    const comments = await Comment.find({ post: { $in: myPostIds } })
      .populate('author', 'name email profileImage')
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getPostComments,
  updateComment,
  deleteComment,
  getReceivedComments,
};
