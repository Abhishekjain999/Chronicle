import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe, Share2, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-stone-200 dark:border-stone-800/80 bg-white dark:bg-stone-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-serif font-black text-lg">
                C
              </div>
              <span className="text-xl font-bold font-serif-heading text-stone-900 dark:text-stone-100">
                Chronicle
              </span>
            </Link>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-sm leading-relaxed">
              An open, secure, and modern editorial blogging platform designed for developers, architects, and thinkers to share knowledge and elevate discussions.
            </p>
            <div className="flex items-center space-x-3 text-stone-400 dark:text-stone-500 pt-2">
              <span className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                <Globe className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                <Share2 className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                <MessageCircle className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-600 dark:text-stone-400">
              <li>
                <Link to="/" className="hover:text-emerald-600 transition-colors">
                  Featured Articles
                </Link>
              </li>
              <li>
                <Link to="/write" className="hover:text-emerald-600 transition-colors">
                  Write a Story
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-600 transition-colors">
                  Author Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Stack & Architecture */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-4">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['React', 'Vite', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'Tailwind CSS', 'JWT Cookies'].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-[11px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 dark:text-stone-400 space-y-4 sm:space-y-0">
          <p>
            &copy; {new Date().getFullYear()} Chronicle Platform. All rights reserved.
          </p>
          <p className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-1" />
            <span>for technical portfolios and interviews</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
