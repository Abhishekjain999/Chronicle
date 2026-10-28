import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  confirmVariant = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden transform transition-all scale-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 font-serif-heading">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed pl-11">
            {message}
          </p>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2 ${
                confirmVariant === 'danger'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
