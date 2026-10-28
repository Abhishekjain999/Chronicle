import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  Clock,
  Calendar,
  ArrowLeft,
  Edit,
  Trash2,
  Share2,
  User as UserIcon,
  Tag,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import { PostDetailSkeleton } from '../components/LoadingSkeleton';
import CommentSection from '../components/CommentSection';
import ConfirmModal from '../components/ConfirmModal';

const PostDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch post details
        const postRes = await api.get(`/posts/${slug}`);
        if (postRes.data.success) {
          const postData = postRes.data.post;
          setPost(postData);

          // 2. Fetch comments for this post
          const commentsRes = await api.get(`/posts/${postData._id}/comments`);
          if (commentsRes.data.success) {
            setComments(commentsRes.data.comments);
          }
        }
      } catch (err) {
        setError(err.message || 'Article could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [slug]);

  const isOwner =
    user && post?.author && (user._id || user.id).toString() === (post.author._id || post.author.id).toString();

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      const { data } = await api.delete(`/posts/${post._id}`);
      if (data.success) {
        toast.success('Article deleted successfully');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete article');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  // Comment state callbacks
  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments((prev) =>
      prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))
    );
  };

  const handleCommentDeleted = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  if (loading) {
    return <PostDetailSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-serif-heading text-stone-900 dark:text-stone-100 mb-3">
          Article Not Found
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mb-6">
          {error || 'The story you are looking for does not exist or may have been deleted.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button and author action toolbar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200 dark:border-stone-800">
        <Link
          to="/"
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Articles
        </Link>

        <div className="flex items-center space-x-2">
          {isOwner && (
            <>
              <Link
                to={`/edit/${post._id}`}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Edit Story
              </Link>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Delete
              </button>
            </>
          )}
          <button
            onClick={handleShare}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            title="Share article"
            aria-label="Share article link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header Info */}
      <header className="mb-10">
        <div className="flex items-center space-x-2 mb-4">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300">
            {post.category}
          </span>
          {post.status === 'draft' && (
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              Draft Preview
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-heading text-stone-900 dark:text-stone-50 leading-[1.15] mb-6 tracking-tight">
          {post.title}
        </h1>

        {/* Author byline */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-y border-stone-200/80 dark:border-stone-800/80">
          <Link
            to={`/users/${post.author?._id || post.author?.id}`}
            className="flex items-center space-x-3.5 group/author"
          >
            {post.author?.profileImage ? (
              <img
                src={post.author.profileImage}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-stone-200 dark:ring-stone-700"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-base">
                {post.author?.name ? post.author.name.charAt(0).toUpperCase() : <UserIcon className="w-6 h-6" />}
              </div>
            )}
            <div>
              <p className="text-base font-semibold text-stone-900 dark:text-stone-100 group-hover/author:text-emerald-600 transition-colors">
                {post.author?.name || 'Anonymous Author'}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {post.author?.bio || 'Author & Tech Writer'}
              </p>
            </div>
          </Link>

          <div className="flex items-center space-x-4 text-xs text-stone-500 dark:text-stone-400">
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-stone-400" />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-stone-400" />
              {post.readingTime || 1} min read
            </span>
            <span className="flex items-center">
              <Eye className="w-3.5 h-3.5 mr-1 text-stone-400" />
              {post.views || 0} views
            </span>
          </div>
        </div>
      </header>

      {/* Hero Cover Image */}
      {post.coverImage && (
        <div className="mb-12 rounded-3xl overflow-hidden aspect-[21/9] bg-stone-100 dark:bg-stone-800 shadow-lg">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Markdown Body Content */}
      <section className="editorial-prose text-stone-800 dark:text-stone-200 mb-12">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </section>

      {/* Tags Section */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-12 pt-6 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center flex-wrap gap-2">
            <Tag className="w-4 h-4 text-stone-400 mr-1" />
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 text-xs font-medium bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Comment Section */}
      <CommentSection
        postId={post._id}
        postAuthorId={post.author?._id || post.author?.id}
        comments={comments}
        currentUser={user}
        onCommentAdded={handleCommentAdded}
        onCommentUpdated={handleCommentUpdated}
        onCommentDeleted={handleCommentDeleted}
      />

      {/* Deletion confirmation modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Story"
        message="Are you sure you want to permanently delete this story and all of its comments? This action cannot be undone."
        confirmText="Delete Story"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeletePost}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </article>
  );
};

export default PostDetailsPage;
