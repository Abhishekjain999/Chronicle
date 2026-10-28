import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = BookOpen,
  title = 'No posts found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="py-16 px-4 text-center max-w-md mx-auto">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-stone-100 dark:bg-stone-800/80 flex items-center justify-center text-stone-400 dark:text-stone-500 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-200 font-serif-heading mb-2">
        {title}
      </h3>
      <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-6">
        {description}
      </p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
        >
          {actionText}
        </Link>
      )}
      {actionText && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
