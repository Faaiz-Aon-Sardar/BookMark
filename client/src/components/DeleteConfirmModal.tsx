import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';
import { Bookmark } from '../types/bookmark';

interface DeleteConfirmModalProps {
  bookmark: Bookmark | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  bookmark,
  isOpen,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !bookmark) return null;

  const handleConfirm = () => {
    onConfirm(bookmark.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/30 rounded-2xl w-full max-w-md shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#FFF] overflow-hidden"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 bg-rose-50 dark:bg-neutral-900 border-b-2 border-black dark:border-white/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500 border-2 border-black dark:border-white/40 flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#000]">
              <Trash2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-2 border-black dark:border-white/40 flex items-center justify-center text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          <h3 id="delete-dialog-title" className="text-base sm:text-lg font-black text-black dark:text-white mb-1.5">
            Delete Bookmark?
          </h3>
          <p id="delete-dialog-desc" className="text-xs sm:text-sm text-slate-800 dark:text-neutral-300 font-medium leading-relaxed">
            Are you sure you want to remove <span className="font-black text-black dark:text-black bg-rose-200 border border-black px-1 rounded">"{bookmark.name}"</span>? You can re-add it at any time.
          </p>
        </div>

        <div className="px-5 sm:px-6 py-3.5 bg-white dark:bg-neutral-900 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border-2 border-black dark:border-white/30 bg-white dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 font-black text-xs text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl font-black text-xs bg-rose-600 hover:bg-rose-700 text-white border-2 border-black dark:border-white/40 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
