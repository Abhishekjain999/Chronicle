const User = require('../models/User');
const Post = require('../models/Post');

/**
 * @desc    Get user profile by ID with their published posts
 * @route   GET /api/users/:id
 * @access  Public
 */
const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const posts = await Post.find({ author: id, status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .populate('author', 'name email profileImage');

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        profileImage: user.profileImage,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      postCount: posts.length,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current logged-in user profile
 * @route   PATCH /api/users/me
 * @access  Private
 */
const updateMyProfile = async (req, res, next) => {
  try {
    const { name, bio, profileImage } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (profileImage !== undefined) user.profileImage = profileImage.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateMyProfile,
};
