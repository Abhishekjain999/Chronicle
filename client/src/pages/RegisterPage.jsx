import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User as UserIcon, Mail, Lock, Image as ImageIcon, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      profileImage: '',
      bio: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      profileImage: data.profileImage ? data.profileImage.trim() : '',
      bio: data.bio ? data.bio.trim() : '',
    };

    const res = await registerAuth(payload);
    setSubmitting(false);
    if (res.success) {
      navigate('/dashboard', { replace: true });
    }
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
            Create an account
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Join our publication community to share stories and connect.
          </p>
        </div>

        {/* Register Form Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8 shadow-xl shadow-stone-200/40 dark:shadow-none">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
                  })}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  placeholder="name@domain.com"
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
                  placeholder="At least 6 characters"
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

            {/* Optional Avatar URL */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Profile Avatar URL (Optional)
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  {...register('profileImage')}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            {/* Optional Bio */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                Short Bio (Optional)
              </label>
              <textarea
                placeholder="What topics do you love writing about?"
                rows={2}
                maxLength={500}
                {...register('bio')}
                className="w-full p-3 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
              />
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
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 text-center">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center"
              >
                Sign in here
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
