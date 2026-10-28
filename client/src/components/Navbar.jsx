import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  PenSquare,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Compass,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-stone-50/90 dark:bg-stone-950/90 border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and Tagline */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-500 transition-colors">
                <span className="font-serif font-black text-xl">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight font-serif-heading text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Chronicle
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-semibold -mt-1">
                  Editorial
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-stone-200 dark:border-stone-800">
              <Link
                to="/"
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === '/'
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
                    : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                }`}
              >
                Explore
              </Link>
            </nav>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/write"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-600/20 transition-all"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Write</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full ring-2 ring-transparent hover:ring-emerald-500/50 transition-all focus:outline-none"
                    aria-label="User menu"
                  >
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-stone-400 dark:text-stone-500 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2.5 text-stone-400" />
                          Dashboard
                        </Link>
                        <Link
                          to={`/users/${user?.id || user?._id}`}
                          className="flex items-center px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 mr-2.5 text-stone-400" />
                          Public Profile
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-2.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/80 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-600/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-stone-500 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-700 dark:text-stone-200 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            className="flex items-center px-3 py-2 text-base font-medium text-stone-800 dark:text-stone-200 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800"
          >
            <Compass className="w-5 h-5 mr-3 text-stone-400" />
            Explore Articles
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/write"
                className="flex items-center px-3 py-2 text-base font-medium text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800"
              >
                <PenSquare className="w-5 h-5 mr-3" />
                Write an Article
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center px-3 py-2 text-base font-medium text-stone-800 dark:text-stone-200 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800"
              >
                <LayoutDashboard className="w-5 h-5 mr-3 text-stone-400" />
                Dashboard & Settings
              </Link>
              <Link
                to={`/users/${user?.id || user?._id}`}
                className="flex items-center px-3 py-2 text-base font-medium text-stone-800 dark:text-stone-200 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800"
              >
                <UserIcon className="w-5 h-5 mr-3 text-stone-400" />
                Public Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out ({user?.name})
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex flex-col space-y-2">
              <Link
                to="/login"
                className="w-full text-center py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
