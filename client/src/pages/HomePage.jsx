import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles, Filter, ChevronLeft, ChevronRight, RefreshCw, BookOpen } from 'lucide-react';
import api from '../services/api';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Query state derived from searchParams
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const activeCategory = searchParams.get('category') || 'All';
  const searchTerm = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  // Local search input state to allow debounced typing
  const [searchInput, setSearchInput] = useState(searchTerm);

  // Fetch category stats
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/posts/categories/stats');
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch posts based on current query parameters
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 6,
        sort: currentSort,
      };
      if (activeCategory && activeCategory !== 'All') {
        params.category = activeCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }

      const { data } = await api.get('/posts', { params });
      if (data.success) {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setTotalPosts(data.totalPosts);
      }
    } catch (err) {
      setError(err.message || 'Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeCategory, searchTerm, currentSort]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Update URL search parameters
  const updateParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '' || val === 'All') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim(), page: 1 });
  };

  const handleCategorySelect = (catName) => {
    updateParams({ category: catName, page: 1 });
  };

  const handleSortChange = (sortOption) => {
    updateParams({ sort: sortOption, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateParams({ page: newPage });
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  // Find a featured post for the hero highlight
  const featuredPost = posts.length > 0 && currentPage === 1 && !searchTerm && activeCategory === 'All'
    ? posts[0]
    : null;
  const standardPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Editorial Hero Header */}
      <section className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-200/60 dark:border-emerald-800/60">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Modern Publication Platform</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif-heading text-stone-900 dark:text-stone-50 tracking-tight leading-[1.15] mb-4">
          Ideas, insights, and architecture that inspire.
        </h1>
        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-sans font-normal">
          Explore curated long-form perspectives on software engineering, cloud architecture, system design, and product craftsmanship.
        </p>
      </section>

      {/* Featured Lead Post (on initial default view) */}
      {featuredPost && (
        <section className="mb-16">
          <div className="flex items-center space-x-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-xs font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400">
              Featured Story
            </span>
          </div>
          <PostCard post={featuredPost} />
        </section>
      )}

      {/* Search & Discovery Controls Bar */}
      <section className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles by title, content, or tag..."
              className="w-full pl-10 pr-24 py-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateParams({ search: '', page: 1 });
                }}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 font-medium"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Sort Dropdown & Article Count */}
          <div className="flex items-center space-x-4 self-end md:self-auto">
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              {totalPosts} {totalPosts === 1 ? 'article' : 'articles'}
            </span>
            <div className="flex items-center space-x-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-3 py-1.5 shadow-sm">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-transparent text-xs font-medium text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer"
                aria-label="Sort articles"
              >
                <option value="newest" className="bg-white dark:bg-stone-900">Newest First</option>
                <option value="oldest" className="bg-white dark:bg-stone-900">Oldest First</option>
                <option value="popular" className="bg-white dark:bg-stone-900">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Pills Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategorySelect('All')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
              activeCategory === 'All'
                ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-600 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategorySelect(cat.name)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>
      </section>

      {/* Error Message with Retry */}
      {error && (
        <div className="my-8 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-between">
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">
            {error}
          </p>
          <button
            onClick={fetchPosts}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Retry
          </button>
        </div>
      )}

      {/* Posts Grid or Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, idx) => (
            <PostCardSkeleton key={idx} />
          ))}
        </div>
      ) : standardPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {standardPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No articles found"
          description={
            searchTerm || activeCategory !== 'All'
              ? 'We could not find any published articles matching your criteria. Try adjusting or clearing your filters.'
              : 'There are no published stories right now. Check back soon or be the first author to write one!'
          }
          actionText={searchTerm || activeCategory !== 'All' ? 'Reset Filters' : 'Write First Article'}
          actionLink={searchTerm || activeCategory !== 'All' ? '/' : '/write'}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          className="mt-14 flex items-center justify-center space-x-2"
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-9 h-9 text-sm font-semibold rounded-lg transition-all ${
                  currentPage === pageNum
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </nav>
      )}
    </div>
  );
};

export default HomePage;
