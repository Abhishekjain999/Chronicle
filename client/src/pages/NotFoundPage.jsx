import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-emerald-600 shadow-inner">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-serif-heading text-stone-900 dark:text-stone-100 mb-3">
          404 &mdash; Page Not Found
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-8 leading-relaxed">
          The publication page or story you are searching for might have been moved, deleted, or never existed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Explore
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
