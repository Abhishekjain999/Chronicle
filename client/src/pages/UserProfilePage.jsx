import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User as UserIcon, Calendar, BookOpen, Edit3, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const UserProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/users/${id}`);
        if (data.success) {
          setAuthor(data.user);
          setPosts(data.posts);
        }
      } catch (err) {
        setError(err.message || 'Author profile could not be found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const isSelf = currentUser && (currentUser._id || currentUser.id).toString() === id?.toString();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="flex items-center space-x-6 mb-12">
          <div className="w-24 h-24 rounded-full bg-stone-200 dark:bg-stone-800" />
          <div className="space-y-3">
            <div className="w-48 h-6 bg-stone-200 dark:bg-stone-800 rounded" />
            <div className="w-96 h-4 bg-stone-200 dark:bg-stone-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-serif-heading text-stone-900 dark:text-stone-100 mb-3">
          Author Not Found
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mb-6">
          {error || 'The profile you are looking for does not exist.'}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Author Profile Banner */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 sm:p-10 mb-12 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
            {author.profileImage ? (
              <img
                src={author.profileImage}
                alt={author.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-emerald-500/20"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-3xl">
                {author.name ? author.name.charAt(0).toUpperCase() : <UserIcon className="w-10 h-10" />}
              </div>
            )}

            <div className="space-y-2 max-w-xl">
              <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-stone-900 dark:text-stone-100">
                {author.name}
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {author.bio || 'Staff author & software engineering contributor.'}
              </p>
              <div className="flex items-center justify-center sm:justify-start space-x-4 text-xs text-stone-400 dark:text-stone-500 pt-1">
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  Joined {formatDate(author.createdAt)}
                </span>
                <span className="flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1" />
                  {posts.length} {posts.length === 1 ? 'article' : 'articles'}
                </span>
              </div>
            </div>
          </div>

          {isSelf && (
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition-all self-center sm:self-auto"
            >
              <Edit3 className="w-4 h-4 mr-1.5 text-emerald-600" />
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      {/* Published Articles by Author */}
      <div className="mb-6">
        <h2 className="text-xl font-bold font-serif-heading text-stone-900 dark:text-stone-100">
          Published Articles ({posts.length})
        </h2>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No published stories"
          description={`${author.name} has not published any articles yet.`}
        />
      )}
    </div>
  );
};

export default UserProfilePage;
