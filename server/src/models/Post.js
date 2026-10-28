const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide content for the post'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for estimated reading time (assuming ~200 words per minute)
postSchema.virtual('readingTime').get(function () {
  if (!this.content) return 1;
  const wordCount = this.content.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
});

// Text index for search functionality across title, content, tags, category
postSchema.index({
  title: 'text',
  content: 'text',
  category: 'text',
  tags: 'text',
});

// Compound index for efficient queries on published posts sorted by date
postSchema.index({ status: 1, publishedAt: -1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
