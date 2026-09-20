import React, { useState, useEffect } from 'react';
import { CustomCollection } from '../types/bookmark';
import {
  COLLECTION_COLORS,
  COLLECTION_ICONS,
  getCollectionColor,
  renderCollectionIcon,
} from '../utils/collectionUtils';
import { X, Sparkles, Plus, Check, Trash2, FolderPlus, Palette } from 'lucide-react';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    color: string;
    icon: string;
    description?: string;
  }) => { success: boolean; error?: string };
  onDelete?: (id: string) => void;
  initialCollection?: CustomCollection | null;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialCollection,
}) => {
  const isEditing = Boolean(initialCollection);

  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>('amber');
  const [icon, setIcon] = useState<string>('star');
  const [description, setDescription] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (initialCollection) {
        setName(initialCollection.name);
        setColor(initialCollection.color || 'amber');
        setIcon(initialCollection.icon || 'star');
        setDescription(initialCollection.description || '');
      } else {
        setName('');
        setColor('amber');
        setIcon('star');
        setDescription('');
      }
      setErrorMsg(null);
      setShowConfirmDelete(false);
    }
  }, [isOpen, initialCollection]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMsg('Please enter a name for this list.');
      return;
    }

    const res = onSave({
      name: trimmedName,
      color,
      icon,
      description: description.trim() || undefined,
    });

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to save list.');
    }
  };

  const selectedColorDef = getCollectionColor(color);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF8F5] dark:bg-neutral-900 border-4 border-black dark:border-white w-full max-w-md rounded-2xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#FFF] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b-3 border-black dark:border-white/40 flex items-center justify-between bg-amber-300 dark:bg-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black text-amber-300 dark:bg-white dark:text-black flex items-center justify-center border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000]">
              <FolderPlus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-black dark:text-white leading-tight">
                {isEditing ? 'Edit Custom List' : 'Create Custom List'}
              </h2>
              <p className="text-xs font-bold text-black/70 dark:text-white/70">
                Organize bookmarks like Favorites with your custom name
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white border-2 border-black dark:border-white flex items-center justify-center shadow-[2px_2px_0px_0px_#000] transition-colors"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-100 dark:bg-rose-950/60 border-2 border-rose-600 rounded-xl text-xs font-black text-rose-800 dark:text-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Live Preview Banner */}
          <div>
            <label className="block text-[11px] font-black text-slate-600 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
              Live List Preview
            </label>
            <div className="p-3 bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/30 rounded-xl flex items-center justify-between shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center gap-2.5 truncate min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg ${selectedColorDef.badgeBg} border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000] shrink-0`}
                >
                  {renderCollectionIcon(icon, 'w-4 h-4 text-black stroke-[2.5]')}
                </div>
                <div className="truncate min-w-0">
                  <p className="text-sm font-black text-black dark:text-white truncate">
                    {name || 'New Custom List'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                    {description || '0 bookmarks saved in this list'}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-black ${selectedColorDef.badgeBg}`}>
                Active
              </span>
            </div>
          </div>

          {/* List Name */}
          <div>
            <label className="block text-xs font-black text-black dark:text-white uppercase tracking-wider mb-1">
              List Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Work Daily, Design Tools, Must Watch, Finance"
              maxLength={40}
              className="w-full px-3.5 py-2.5 text-sm font-bold bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/40 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-black dark:text-white shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-xs font-black text-black dark:text-white uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              <span>Badge Color</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Object.values(COLLECTION_COLORS).map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  title={c.name}
                  className={`h-9 rounded-xl border-2 border-black flex items-center justify-center transition-all ${c.previewBg} ${
                    color === c.id
                      ? 'scale-105 shadow-[2px_2px_0px_0px_#000] ring-2 ring-black dark:ring-white'
                      : 'opacity-80 hover:opacity-100 hover:scale-102 shadow-[1px_1px_0px_0px_#000]'
                  }`}
                >
                  {color === c.id && <Check className="w-4 h-4 text-black stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-black text-black dark:text-white uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>List Icon</span>
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/30 rounded-xl shadow-[2px_2px_0px_0px_#000]">
              {COLLECTION_ICONS.map((item) => {
                const isSelected = icon === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setIcon(item.id)}
                    title={item.label}
                    className={`p-2 rounded-lg border flex items-center justify-center transition-all ${
                      isSelected
                        ? `${selectedColorDef.badgeBg} border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] scale-105`
                        : 'border-transparent hover:border-black/30 dark:hover:border-white/30 hover:bg-slate-100 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 stroke-[2.5]" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Description */}
          <div>
            <label className="block text-xs font-black text-black dark:text-white uppercase tracking-wider mb-1">
              Description <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short note about what goes into this list..."
              maxLength={100}
              className="w-full px-3.5 py-2 text-xs font-medium bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/40 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-black dark:text-white shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          {/* Delete section for Edit mode */}
          {isEditing && onDelete && initialCollection && (
            <div className="pt-2 border-t-2 border-dashed border-slate-300 dark:border-neutral-700">
              {showConfirmDelete ? (
                <div className="p-3 bg-rose-100 dark:bg-rose-950/80 border-2 border-rose-600 rounded-xl space-y-2">
                  <p className="text-xs font-black text-rose-900 dark:text-rose-200">
                    Delete list "{initialCollection.name}"? Bookmarks will stay in your launcher.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(initialCollection.id);
                        onClose();
                      }}
                      className="px-3 py-1 text-xs font-black bg-rose-600 text-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000] hover:bg-rose-700"
                    >
                      Yes, Delete List
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmDelete(false)}
                      className="px-3 py-1 text-xs font-bold bg-white dark:bg-neutral-800 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="text-xs font-black text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete this Custom List</span>
                </button>
              )}
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-black bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/40 rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] hover:bg-slate-100 dark:hover:bg-neutral-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-black bg-amber-300 dark:bg-amber-400 text-black border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_#000] hover:bg-amber-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5"
            >
              {isEditing ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Create List</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
