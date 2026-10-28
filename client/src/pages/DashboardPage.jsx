import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  Settings,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  User as UserIcon,
  ShieldAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatRelativeTime } from '../utils/formatDate';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';

const DashboardPage = () => {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState('stories'); // 'stories' | 'comments' | 'settings'
  const [storiesFilter, setStoriesFilter] = useState('all'); // 'all' | 'published' | 'draft'

  const [myPosts, setMyPosts] = useState([]);
  const [receivedComments, setReceivedComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Modals
  const [deletePostId, setDeletePostId] = useState(null);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch author posts and received comments
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes, commentsRes] = await Promise.all([
        api.get('/posts/my-posts'),
        api.get('/comments/received'),
      ]);

      if (postsRes.data.success) {
        setMyPosts(postsRes.data.posts);
      }
      if (commentsRes.data.success) {
        setReceivedComments(commentsRes.data.comments);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle post delete
  const handleConfirmDeletePost = async () => {
    if (!deletePostId) return;
    setIsDeleting(true);
    try {
      const { data } = await api.delete(`/posts/${deletePostId}`);
      if (data.success) {
        toast.success('Story deleted');
        setMyPosts((prev) => prev.filter((p) => p._id !== deletePostId));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete story');
    } finally {
      setIsDeleting(false);
      setDeletePostId(null);
    }
  };

  // Handle comment moderation delete
  const handleConfirmDeleteComment = async () => {
    if (!deleteCommentId) return;
    setIsDeleting(true);
    try {
      const { data } = await api.delete(`/comments/${deleteCommentId}`);
      if (data.success) {
        toast.success(data.message || 'Comment removed');
        setReceivedComments((prev) =>
          prev.filter((c) => c._id !== deleteCommentId)
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to remove comment');
    } finally {
      setIsDeleting(false);
      setDeleteCommentId(null);
    }
  };

  // Handle profile form submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.patch('/users/me', profileForm);
      if (data.success) {
        toast.success('Profile updated successfully!');
        updateUser(data.user);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Metrics calculations
  const totalStories = myPosts.length;
  const publishedStories = myPosts.filter((p) => p.status === 'published').length;
  const draftStories = myPosts.filter((p) => p.status === 'draft').length;
  const totalViews = myPosts.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalCommentsReceived = receivedComments.length;

  const filteredPosts = myPosts.filter((p) => {
    if (storiesFilter === 'all') return true;
    return p.status === storiesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h1 className="text-3xl font-bold font-serif-heading text-stone-900 dark:text-stone-100">
            Author Dashboard
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage your articles, review responses, and customize your profile.
          </p>
        </div>
        <Link
          to="/write"
          className="inline-flex items-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          New Story
        </Link>
      </div>

      {/* Metrics Cards Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            Total Stories
          </p>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {totalStories}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Published
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {publishedStories}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
            Drafts
          </p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {draftStories}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            Total Views
          </p>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {totalViews}
          </p>
        </div>
        <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            Responses
          </p>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {totalCommentsReceived}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 space-x-6 mb-8">
        <button
          onClick={() => setActiveTab('stories')}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'stories'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Stories ({totalStories})</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'comments'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Responses Received ({totalCommentsReceived})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* Tab 1: My Stories */}
      {activeTab === 'stories' && (
        <div className="space-y-6">
          {/* Sub-filter pills */}
          <div className="flex items-center space-x-2">
            {['all', 'published', 'draft'].map((f) => (
              <button
                key={f}
                onClick={() => setStoriesFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg uppercase tracking-wider transition-all ${
                  storiesFilter === f
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-12 text-center animate-pulse text-stone-400">
              Loading stories...
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="overflow-x-auto bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-xs uppercase text-stone-400 font-semibold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Title</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6 text-center">Responses</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
                  {filteredPosts.map((post) => (
                    <tr key={post._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                      <td className="py-4 px-6 font-medium text-stone-900 dark:text-stone-100 max-w-xs truncate">
                        <Link
                          to={`/posts/${post.slug}`}
                          className="hover:text-emerald-600 transition-colors font-serif-heading text-base"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            post.status === 'published'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {post.status === 'published' ? (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {post.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-stone-500 dark:text-stone-400 text-xs">
                        {post.category}
                      </td>
                      <td className="py-4 px-6 text-stone-500 dark:text-stone-400 text-xs">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-center text-stone-600 dark:text-stone-300">
                        {post.commentCount || 0}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/posts/${post.slug}`}
                            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                            title="View Story"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/edit/${post._id}`}
                            className="p-1.5 text-stone-400 hover:text-emerald-600 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                            title="Edit Story"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeletePostId(post._id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                            title="Delete Story"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No stories found"
              description="You have not created any stories under this filter yet. Ready to start writing?"
              actionText="Write Your Story"
              actionLink="/write"
            />
          )}
        </div>
      )}

      {/* Tab 2: Comments Moderation */}
      {activeTab === 'comments' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              As the post author, you have moderation authority to remove inappropriate or off-topic responses left on your published stories.
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-stone-400">Loading responses...</div>
          ) : receivedComments.length > 0 ? (
            <div className="space-y-3">
              {receivedComments.map((comment) => (
                <div
                  key={comment._id}
                  className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      {comment.author?.profileImage ? (
                        <img
                          src={comment.author.profileImage}
                          alt={comment.author.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                          {comment.author?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                        {comment.author?.name || 'Reader'}
                      </span>
                      <span className="text-stone-300 dark:text-stone-700">&bull;</span>
                      <span className="text-xs text-stone-400">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-stone-700 dark:text-stone-300 pl-10">
                      "{comment.content}"
                    </p>

                    <div className="pl-10 text-xs text-stone-400">
                      On article:{' '}
                      <Link
                        to={`/posts/${comment.post?.slug}`}
                        className="text-emerald-600 hover:underline font-medium"
                      >
                        {comment.post?.title}
                      </Link>
                    </div>
                  </div>

                  <button
                    onClick={() => setDeleteCommentId(comment._id)}
                    className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex-shrink-0"
                    title="Moderate and remove response"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="No responses yet"
              description="No reader comments have been submitted on your posts so far."
            />
          )}
        </div>
      )}

      {/* Tab 3: Profile Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold font-serif-heading text-stone-900 dark:text-stone-100 mb-6">
            Author Profile Information
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                required
                className="w-full p-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Email (Read only) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full p-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/50 text-stone-400 cursor-not-allowed"
              />
              <p className="mt-1 text-[11px] text-stone-400">
                Email address is linked to your account session.
              </p>
            </div>

            {/* Profile Image URL */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={profileForm.profileImage}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, profileImage: e.target.value })
                }
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              {profileForm.profileImage && (
                <div className="mt-3 flex items-center space-x-3">
                  <img
                    src={profileForm.profileImage}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                  <span className="text-xs text-stone-500">Avatar preview</span>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Author Bio
              </label>
              <textarea
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
                rows={4}
                maxLength={500}
                placeholder="A short biography introducing yourself to your readers..."
                className="w-full p-3 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
              />
              <p className="mt-1 text-right text-[11px] text-stone-400">
                {profileForm.bio.length}/500 characters
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Post Modal */}
      <ConfirmModal
        isOpen={Boolean(deletePostId)}
        title="Delete Story"
        message="Are you sure you want to permanently delete this story and all of its comments?"
        confirmText="Delete Story"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeletePost}
        onClose={() => setDeletePostId(null)}
      />

      {/* Moderate Comment Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteCommentId)}
        title="Moderate Comment"
        message="As the author of this story, are you sure you want to remove this reader comment?"
        confirmText="Remove Comment"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteComment}
        onClose={() => setDeleteCommentId(null)}
      />
    </div>
  );
};

export default DashboardPage;
