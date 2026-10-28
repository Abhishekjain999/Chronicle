const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { createSlug } = require('../utils/slugify');
const { sanitizeContent } = require('../utils/sanitize');

/**
 * Generate a unique slug for a post
 */
const generateUniqueSlug = async (title, currentPostId = null) => {
  let baseSlug = createSlug(title) || 'untitled-post';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (currentPostId) {
      query._id = { $ne: currentPostId };
    }
    const existing = await Post.findOne(query);
    if (!existing) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, coverImage, category, tags, status } = req.body;

    const slug = await generateUniqueSlug(title);
    const sanitizedContent = sanitizeContent(content);

    // Normalize tags
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
    } else if (typeof tags === 'string') {
      processedTags = tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    }

    const postStatus = status === 'published' ? 'published' : 'draft';
    const publishedAt = postStatus === 'published' ? new Date() : null;

    const post = await Post.create({
      author: req.user._id,
      title,
      slug,
      content: sanitizedContent,
      coverImage: coverImage || '',
      category: category.trim(),
      tags: processedTags,
      status: postStatus,
      publishedAt,
    });

    await post.populate('author', 'name email profileImage bio');

    res.status(201).json({
      success: true,
      message: postStatus === 'published' ? 'Post published successfully!' : 'Draft saved successfully!',
      post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all published posts with search, filter, pagination, sort
 * @route   GET /api/posts
 * @access  Public
 */
const getPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 9));
    const skip = (page - 1) * limit;

    const { search, category, tag, sort } = req.query;

    // Filter only published posts for the public listing
    const query = { status: 'published' };

    // Category filter
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Tag filter
    if (tag) {
      query.tags = tag.toLowerCase();
    }

    // Search filter across title, content, tags, category
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { category: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Sorting
    let sortOptions = { publishedAt: -1, createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { publishedAt: 1, createdAt: 1 };
    } else if (sort === 'popular') {
      sortOptions = { views: -1, createdAt: -1 };
    }

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit) || 1;

    const posts = await Post.find(query)
      .populate('author', 'name email profileImage bio')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Attach comment counts
    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);
    const commentCountMap = commentCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const enrichedPosts = posts.map((post) => {
      const obj = post.toJSON();
      obj.commentCount = commentCountMap[post._id.toString()] || 0;
      return obj;
    });

    res.status(200).json({
      success: true,
      count: enrichedPosts.length,
      totalPosts,
      totalPages,
      currentPage: page,
      posts: enrichedPosts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single post by slug
 * @route   GET /api/posts/:slug
 * @access  Public (Draft visible only to author)
 */
const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug }).populate(
      'author',
      'name email profileImage bio'
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // If draft, only author can view
    if (post.status === 'draft') {
      if (!req.user || req.user._id.toString() !== post.author._id.toString()) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }
    } else {
      // Increment views count for published post
      await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });
      post.views += 1;
    }

    const commentCount = await Comment.countDocuments({ post: post._id });

    const postObj = post.toJSON();
    postObj.commentCount = commentCount;

    res.status(200).json({
      success: true,
      post: postObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update post by ID
 * @route   PATCH /api/posts/:id
 * @access  Private (Owner only)
 */
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, coverImage, category, tags, status } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only edit your own posts.',
      });
    }

    // Update title and slug if title changed
    if (title && title.trim() !== post.title) {
      post.title = title.trim();
      post.slug = await generateUniqueSlug(post.title, post._id);
    }

    // Update content with sanitization
    if (content !== undefined) {
      post.content = sanitizeContent(content);
    }

    if (coverImage !== undefined) {
      post.coverImage = coverImage;
    }

    if (category) {
      post.category = category.trim();
    }

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        post.tags = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
      } else if (typeof tags === 'string') {
        post.tags = tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
      }
    }

    if (status && ['draft', 'published'].includes(status)) {
      if (status === 'published' && post.status !== 'published' && !post.publishedAt) {
        post.publishedAt = new Date();
      }
      post.status = status;
    }

    await post.save();
    await post.populate('author', 'name email profileImage bio');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete post by ID
 * @route   DELETE /api/posts/:id
 * @access  Private (Owner only)
 */
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You can only delete your own posts.',
      });
    }

    await Post.findByIdAndDelete(id);

    // Delete associated comments
    await Comment.deleteMany({ post: id });

    res.status(200).json({
      success: true,
      message: 'Post and associated comments successfully deleted.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all posts created by logged in user (drafts + published)
 * @route   GET /api/posts/my-posts
 * @access  Private
 */
const getMyPosts = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = { author: req.user._id };

    if (status && ['draft', 'published'].includes(status)) {
      query.status = status;
    }

    if (search && search.trim()) {
      query.$or = [
        { title: new RegExp(search.trim(), 'i') },
        { category: new RegExp(search.trim(), 'i') },
      ];
    }

    const posts = await Post.find(query)
      .sort({ updatedAt: -1 })
      .populate('author', 'name email profileImage bio');

    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);
    const commentCountMap = commentCounts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const enrichedPosts = posts.map((post) => {
      const obj = post.toJSON();
      obj.commentCount = commentCountMap[post._id.toString()] || 0;
      return obj;
    });

    res.status(200).json({
      success: true,
      count: enrichedPosts.length,
      posts: enrichedPosts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get category statistics (categories and counts of published posts)
 * @route   GET /api/posts/categories/stats
 * @access  Public
 */
const getCategoryStats = async (req, res, next) => {
  try {
    const stats = await Post.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categories = stats.map((item) => ({
      name: item._id,
      count: item.count,
    }));

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  getMyPosts,
  getCategoryStats,
};
