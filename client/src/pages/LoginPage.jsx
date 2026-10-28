import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    const res = await login(data.email, data.password);
    setSubmitting(false);
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  // Quick helper to autofill demo credentials
  const fillDemoAccount = (email) => {
    setValue('email', email);
    setValue('password', 'password123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <span className="font-serif font-black text-2xl">C</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold font-serif-heading text-stone-900 dark:text-stone-100">
            Welcome back
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Sign in to continue publishing and participating in discussions.
          </p>
        </div>

        {/* Demo Accounts Quick-Fill Box */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Accounts (Click to Fill):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('alex@devblog.io')}
              className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 rounded-lg border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shadow-2xs"
            >
              Alex (Architect)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('sarah@devblog.io')}
              className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 rounded-lg border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shadow-2xs"
            >
              Sarah (Cloud)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('maya@devblog.io')}
              className="px-2.5 py-1 text-xs font-medium bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 rounded-lg border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shadow-2xs"
            >
              Maya (AI)
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8 shadow-xl shadow-stone-200/40 dark:shadow-none">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 text-center">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center"
              >
                Create one now
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
