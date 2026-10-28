import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Check, X, ShieldAlert, User as UserIcon } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatDate';
import ConfirmModal from './ConfirmModal';

const CommentItem = ({
  comment,
  currentUser,
  postAuthorId,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const commentAuthorId = comment.author?._id || comment.author?.id;
  const currentUserId = currentUser?._id || currentUser?.id;

  const isCommentOwner = currentUserId && commentAuthorId && currentUserId.toString() === commentAuthorId.toString();
  const isPostAuthor = currentUserId && postAuthorId && currentUserId.toString() === postAuthorId.toString();
  const canDelete = isCommentOwner || isPostAuthor;

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    setIsUpdating(true);
    try {
      await onUpdate(comment._id, editContent.trim());
      setIsEditing(false);
    } catch (err) {
      // error handled in parent/toast
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(comment._id);
      setIsDeleteModalOpen(false);
    } catch (err) {
      // error handled in parent/toast
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="py-4 border-b border-stone-200/70 dark:border-stone-800/80 last:border-0 group">
      <div className="flex items-start justify-between">
        <Link
          to={`/users/${commentAuthorId}`}
          className="flex items-center space-x-3 group/author"
        >
          {comment.author?.profileImage ? (
            <img
              src={comment.author.profileImage}
              alt={comment.author.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-semibold text-xs">
              {comment.author?.name ? comment.author.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover/author:text-emerald-600 transition-colors">
                {comment.author?.name || 'Anonymous'}
              </span>
              {isPostAuthor && commentAuthorId?.toString() === postAuthorId?.toString() && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded">
                  Author
                </span>
              )}
            </div>
            <span className="text-xs text-stone-400 dark:text-stone-500">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
        </Link>

        {/* Action Buttons: Edit & Delete */}
        <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {isCommentOwner && !isEditing && (
            <button
              onClick={() => {
                setEditContent(comment.content);
                setIsEditing(true);
              }}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Edit comment"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {canDelete && !isEditing && (
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-1.5 text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title={!isCommentOwner && isPostAuthor ? 'Moderate / Remove comment' : 'Delete comment'}
            >
              {!isCommentOwner && isPostAuthor ? (
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Comment Body / Edit Form */}
      <div className="mt-3 pl-11">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="w-full p-3 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-stone-900 dark:text-stone-100 resize-none"
            />
            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={isUpdating || !editContent.trim()}
                onClick={handleSaveEdit}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line leading-relaxed">
            {comment.content}
          </p>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={!isCommentOwner && isPostAuthor ? 'Moderate Comment' : 'Delete Comment'}
        message={
          !isCommentOwner && isPostAuthor
            ? 'As the author of this post, are you sure you want to remove this reader comment?'
            : 'Are you sure you want to permanently delete this comment?'
        }
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default CommentItem;
