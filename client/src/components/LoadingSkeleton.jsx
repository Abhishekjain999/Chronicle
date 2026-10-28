import React from 'react';

export const PostCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-5 shadow-sm animate-pulse flex flex-col justify-between">
      <div>
        <div className="w-full h-48 bg-stone-200 dark:bg-stone-800 rounded-xl mb-4" />
        <div className="w-20 h-5 bg-stone-200 dark:bg-stone-800 rounded-full mb-3" />
        <div className="w-full h-6 bg-stone-200 dark:bg-stone-800 rounded-md mb-2" />
        <div className="w-3/4 h-6 bg-stone-200 dark:bg-stone-800 rounded-md mb-4" />
        <div className="w-full h-4 bg-stone-100 dark:bg-stone-800/60 rounded mb-2" />
        <div className="w-5/6 h-4 bg-stone-100 dark:bg-stone-800/60 rounded mb-4" />
      </div>
      <div className="pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800" />
          <div className="w-24 h-4 bg-stone-200 dark:bg-stone-800 rounded" />
        </div>
        <div className="w-16 h-3 bg-stone-200 dark:bg-stone-800 rounded" />
      </div>
    </div>
  );
};

export const PostDetailSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
      <div className="w-28 h-6 bg-stone-200 dark:bg-stone-800 rounded-full mb-4" />
      <div className="w-full h-12 bg-stone-200 dark:bg-stone-800 rounded-lg mb-3" />
      <div className="w-3/4 h-12 bg-stone-200 dark:bg-stone-800 rounded-lg mb-6" />
      <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="w-12 h-12 rounded-full bg-stone-200 dark:bg-stone-800" />
        <div>
          <div className="w-32 h-4 bg-stone-200 dark:bg-stone-800 rounded mb-2" />
          <div className="w-48 h-3 bg-stone-100 dark:bg-stone-800/60 rounded" />
        </div>
      </div>
      <div className="w-full h-96 bg-stone-200 dark:bg-stone-800 rounded-2xl mb-8" />
      <div className="space-y-4">
        <div className="w-full h-4 bg-stone-200 dark:bg-stone-800 rounded" />
        <div className="w-full h-4 bg-stone-200 dark:bg-stone-800 rounded" />
        <div className="w-5/6 h-4 bg-stone-200 dark:bg-stone-800 rounded" />
        <div className="w-2/3 h-4 bg-stone-200 dark:bg-stone-800 rounded" />
      </div>
    </div>
  );
};
