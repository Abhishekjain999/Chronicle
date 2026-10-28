import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MessageSquare, User as UserIcon } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatDate';

const PostCard = ({ post }) => {
  const {
    title,
    slug,
    content,
    coverImage,
    category,
    author,
    publishedAt,
    createdAt,
    readingTime,
    commentCount = 0,
    status,
  } = post;

  // Extract a clean plain text excerpt
  const plainText = content
    ? content.replace(/<[^>]*>?/gm, '').replace(/[#*`_~]/g, '').trim()
    : '';
  const excerpt = plainText.length > 140 ? `${plainText.substring(0, 140)}...` : plainText;

  const displayDate = formatRelativeTime(publishedAt || createdAt);

  return (
    <article className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 overflow-hidden hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover Image */}
        <Link to={`/posts/${slug}`} className="block relative aspect-[16/9] overflow-hidden bg-stone-100 dark:bg-stone-800">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-stone-200 to-stone-100 dark:from-stone-800 dark:to-stone-900 text-stone-400">
              <span className="text-3xl font-serif font-bold text-stone-300 dark:text-stone-700">Chronicle</span>
            </div>
          )}
          {status === 'draft' && (
            <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold bg-amber-500/90 text-white rounded-md shadow-sm backdrop-blur-sm">
              Draft
            </span>
          )}
        </Link>

        {/* Content Body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
              {category}
            </span>
            <span className="text-stone-300 dark:text-stone-700">&bull;</span>
            <span className="flex items-center text-xs text-stone-400 dark:text-stone-500">
              <Clock className="w-3 h-3 mr-1" />
              {readingTime || 1} min read
            </span>
          </div>

          <Link to={`/posts/${slug}`} className="block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <h2 className="text-xl font-bold font-serif-heading text-stone-900 dark:text-stone-100 leading-snug line-clamp-2 mb-2">
              {title}
            </h2>
          </Link>

          <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed mb-4">
            {excerpt}
          </p>
        </div>
      </div>

      {/* Author and Metadata Footer */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between">
        <Link
          to={`/users/${author?._id || author?.id}`}
          className="flex items-center space-x-3 group/author"
        >
          {author?.profileImage ? (
            <img
              src={author.profileImage}
              alt={author.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-semibold text-xs">
              {author?.name ? author.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-stone-800 dark:text-stone-200 group-hover/author:text-emerald-600 transition-colors">
              {author?.name || 'Anonymous'}
            </p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500">
              {displayDate}
            </p>
          </div>
        </Link>

        <div className="flex items-center text-stone-400 dark:text-stone-500 text-xs">
          <MessageSquare className="w-3.5 h-3.5 mr-1 text-stone-400" />
          <span>{commentCount}</span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
