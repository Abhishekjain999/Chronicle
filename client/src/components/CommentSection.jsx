import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import CommentItem from './CommentItem';

const CommentSection = ({
  postId,
  postAuthorId,
  comments = [],
  currentUser,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please write something in your comment.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, {
        content: newComment.trim(),
      });
      if (data.success) {
        toast.success('Comment posted!');
        setNewComment('');
        onCommentAdded(data.comment);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (commentId, content) => {
    try {
      const { data } = await api.patch(`/comments/${commentId}`, { content });
      if (data.success) {
        toast.success('Comment updated');
        onCommentUpdated(data.comment);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update comment');
      throw err;
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const { data } = await api.delete(`/comments/${commentId}`);
      if (data.success) {
        toast.success(data.message || 'Comment removed');
        onCommentDeleted(commentId);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete comment');
      throw err;
    }
  };

  return (
    <section className="pt-10 border-t border-stone-200 dark:border-stone-800">
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-xl font-bold font-serif-heading text-stone-900 dark:text-stone-100">
          Responses ({comments.length})
        </h3>
      </div>

      {/* Comment Input */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-start space-x-3">
            {currentUser.profileImage ? (
              <img
                src={currentUser.profileImage}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-semibold text-xs">
                {currentUser.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts?"
                rows={3}
                className="w-full p-3.5 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-stone-900 dark:text-stone-100 resize-none shadow-sm transition-all"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {isSubmitting ? 'Posting...' : 'Respond'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-5 mb-8 rounded-2xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-center">
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
            Join the discussion by logging into your account.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
          >
            Sign in to Comment
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-1">
        {comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-stone-400 dark:text-stone-500 italic">
            No responses yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
              postAuthorId={postAuthorId}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
