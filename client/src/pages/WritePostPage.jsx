import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import {
  Save,
  Send,
  Eye,
  PenTool,
  Columns,
  Image as ImageIcon,
  ArrowLeft,
  Heading,
  Bold,
  Italic,
  Code,
  Quote,
  List,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const CATEGORIES = [
  'Technology',
  'Backend',
  'Frontend',
  'Design',
  'Cloud',
  'Security',
  'AI',
  'Career',
];

const WritePostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [viewMode, setViewMode] = useState('split'); // 'edit' | 'preview' | 'split'
  const [submitting, setSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      category: 'Technology',
      coverImage: '',
      tags: '',
      content: '',
      status: 'draft',
    },
  });

  const contentValue = watch('content');
  const coverImageValue = watch('coverImage');
  const titleValue = watch('title');

  // If in edit mode, fetch existing post details
  useEffect(() => {
    if (isEditing) {
      const fetchPostToEdit = async () => {
        try {
          const { data } = await api.get(`/posts/my-posts`);
          if (data.success) {
            const found = data.posts.find((p) => p._id === id);
            if (found) {
              setValue('title', found.title);
              setValue('category', found.category);
              setValue('coverImage', found.coverImage || '');
              setValue('tags', Array.isArray(found.tags) ? found.tags.join(', ') : found.tags || '');
              setValue('content', found.content);
              setValue('status', found.status);
            } else {
              // Try fetching via public slug or ID if not in recent my-posts
              toast.error('Post not found in your drafts or posts.');
              navigate('/dashboard');
            }
          }
        } catch (err) {
          toast.error(err.message || 'Failed to load post for editing');
          navigate('/dashboard');
        } finally {
          setInitialLoading(false);
        }
      };

      fetchPostToEdit();
    }
  }, [id, isEditing, setValue, navigate]);

  // Insert markdown snippets into content
  const insertFormatting = (prefix, suffix = '') => {
    const current = contentValue || '';
    setValue('content', current + `${prefix}text${suffix}`);
  };

  const onSubmit = async (formData, submitStatus) => {
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category.trim(),
        coverImage: formData.coverImage.trim(),
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        status: submitStatus,
      };

      if (isEditing) {
        const { data } = await api.patch(`/posts/${id}`, payload);
        if (data.success) {
          toast.success(
            submitStatus === 'published' ? 'Story published!' : 'Draft updated!'
          );
          navigate(`/posts/${data.post.slug}`);
        }
      } else {
        const { data } = await api.post('/posts', payload);
        if (data.success) {
          toast.success(
            submitStatus === 'published' ? 'Story published!' : 'Draft saved!'
          );
          navigate(`/posts/${data.post.slug}`);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save story');
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-pulse">
        <p className="text-stone-500">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold font-serif-heading text-stone-900 dark:text-stone-100">
            {isEditing ? 'Edit Story' : 'Write a Story'}
          </h1>
        </div>

        {/* Action Controls & Publish Buttons */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'edit'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 inline mr-1" />
              Editor
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <Columns className="w-3.5 h-3.5 inline mr-1" />
              Split
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              Preview
            </button>
          </div>

          {/* Draft Save */}
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save Draft
          </button>

          {/* Publish */}
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit((data) => onSubmit(data, 'published'))}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4 mr-1.5" />
            {isEditing ? 'Update & Publish' : 'Publish Story'}
          </button>
        </div>
      </div>

      {/* Editor Form */}
      <form className="space-y-6">
        {/* Story Title */}
        <div>
          <input
            type="text"
            placeholder="Title of your story..."
            {...register('title', {
              required: 'Title is required',
              maxLength: { value: 200, message: 'Title cannot exceed 200 characters' },
            })}
            className="w-full text-3xl sm:text-4xl font-bold font-serif-heading placeholder-stone-300 dark:placeholder-stone-700 bg-transparent border-0 border-b border-transparent focus:border-emerald-500 focus:outline-none py-2 text-stone-900 dark:text-stone-100"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Metadata Grid: Category, Cover Image URL, Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
              Category
            </label>
            <select
              {...register('category', { required: 'Please select a category' })}
              className="w-full text-sm p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
              Cover Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                {...register('coverImage')}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. react, architecture, cloud"
              {...register('tags')}
              className="w-full p-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>

        {/* Cover Image Instant Preview */}
        {coverImageValue && (
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9] max-h-48 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800">
            <img
              src={coverImageValue}
              alt="Cover Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-semibold bg-black/60 text-white rounded">
              Cover Preview
            </span>
          </div>
        )}

        {/* Markdown Toolbar */}
        <div className="flex items-center space-x-1 p-2 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <button
            type="button"
            onClick={() => insertFormatting('## ')}
            className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded"
            title="Heading 2"
          >
            <Heading className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n```javascript\n', '\n```\n')}
            className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded"
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('> ')}
            className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded"
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('- ')}
            className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded"
            title="Bullet list"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Content Editor & Live Preview (Split, Edit, or Preview mode) */}
        <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Editor Textarea */}
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div>
              <textarea
                placeholder="Tell your story in Markdown..."
                rows={20}
                {...register('content', { required: 'Post content cannot be empty' })}
                className="w-full p-4 text-base font-mono rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-y shadow-sm leading-relaxed"
              />
              {errors.content && (
                <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
              )}
            </div>
          )}

          {/* Live Markdown Preview */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 overflow-y-auto max-h-[600px] shadow-sm">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 block mb-3">
                Live Story Preview
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-stone-900 dark:text-stone-100 mb-4">
                {titleValue || 'Untitled Story'}
              </h2>
              <div className="editorial-prose text-stone-800 dark:text-stone-200">
                {contentValue ? (
                  <ReactMarkdown>{contentValue}</ReactMarkdown>
                ) : (
                  <p className="text-stone-400 dark:text-stone-600 italic">
                    Start typing on the left to see the editorial live preview...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default WritePostPage;
