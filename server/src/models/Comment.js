const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Comment content cannot be empty'],
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Index to retrieve comments for a post in chronological order
commentSchema.index({ post: 1, createdAt: 1 });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
