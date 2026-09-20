import React, { useState, useEffect, useMemo } from 'react';
import { X, Globe, Tag, Heart, Save, AlertCircle, Check, Plus, FolderPlus, Sparkles, ExternalLink } from 'lucide-react';
import { Bookmark, CustomCollection } from '../types/bookmark';
import { extractDomain, isValidUrl } from '../utils/urlUtils';
import { getFaviconUrl } from '../utils/faviconUtils';
import { WebsiteLogo } from './WebsiteLogo';
import { getCollectionColor, renderCollectionIcon } from '../utils/collectionUtils';

interface EditBookmarkModalProps {
  bookmark: Bookmark | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: {
    name: string;
    url: string;
    customIconBg?: string;
    tags?: string[];
    isFavorite?: boolean;
    favicon?: string;
    collections?: string[];
  }) => { success: boolean; error?: string };
  existingBookmarks: Bookmark[];
  collections?: CustomCollection[];
  onCreateCollection?: () => void;
}

export const EditBookmarkModal: React.FC<EditBookmarkModalProps> = ({
  bookmark,
  isOpen,
  onClose,
  onSave,
  existingBookmarks,
  collections = [],
  onCreateCollection,
}) => {
  const [name, setName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Collect all existing tags across all bookmarks
  const allExistingTags = useMemo(() => {
    const set = new Set<string>();
    existingBookmarks.forEach((b) => {
      b.tags?.forEach((t) => set.add(t));
    });
    const defaults = ['AI & Tools', 'Development', 'Science & Math', 'Productivity', 'Media', 'Social', 'Design', 'Learning'];
    defaults.forEach((d) => set.add(d));
    return Array.from(set);
  }, [existingBookmarks]);

  useEffect(() => {
    if (bookmark) {
      setName(bookmark.name);
      setUrl(bookmark.url);
      setTags(bookmark.tags || []);
      setSelectedCollections(bookmark.collections || []);
      setIsFavorite(bookmark.isFavorite);
      setTagInput('');
      setErrorMsg(null);
    }
  }, [bookmark]);

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

  if (!isOpen || !bookmark) return null;

  const toggleTag = (tagName: string) => {
    const clean = tagName.trim().replace(/^#/, '');
    if (!clean) return;
    if (tags.includes(clean)) {
      setTags(tags.filter((t) => t !== clean));
    } else {
      setTags([...tags, clean]);
    }
  };

  const handleAddTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const toggleCollectionSelection = (collectionId: string) => {
    if (selectedCollections.includes(collectionId)) {
      setSelectedCollections(selectedCollections.filter((id) => id !== collectionId));
    } else {
      setSelectedCollections([...selectedCollections, collectionId]);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    let targetUrl = url.trim();
    if (!targetUrl) {
      setErrorMsg('Please enter a website URL.');
      return;
    }

    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    if (!isValidUrl(targetUrl)) {
      setErrorMsg('Please enter a valid website URL (e.g. https://example.com).');
      return;
    }

    const domain = extractDomain(targetUrl);
    const targetName = name.trim() || domain || 'Website';
    const resolvedFavicon = getFaviconUrl(targetUrl, domain);

    const result = onSave(bookmark.id, {
      name: targetName,
      url: targetUrl,
      customIconBg: bookmark.customIconBg,
      tags: tags.length > 0 ? tags : undefined,
      isFavorite,
      favicon: resolvedFavicon,
      collections: selectedCollections,
    });

    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.error || 'Failed to update bookmark.');
    }
  };

  const previewDomain = extractDomain(url) || bookmark.domain;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF8F5] dark:bg-neutral-900 border-4 border-black dark:border-white w-full max-w-lg rounded-2xl shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#FFF] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-3 border-black dark:border-white/40 flex items-center justify-between bg-amber-300 dark:bg-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-amber-300 dark:bg-white dark:text-black flex items-center justify-center border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000]">
              <Save className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-black dark:text-white leading-tight">
                Edit Bookmark
              </h2>
              <p className="text-xs font-bold text-black/70 dark:text-white/70">
                Update name, website URL, custom lists & tags
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white border-2 border-black dark:border-white flex items-center justify-center shadow-[2px_2px_0px_0px_#000] transition-colors"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-100 dark:bg-rose-950/60 border-2 border-rose-600 rounded-xl flex items-center gap-2 text-xs font-black text-rose-800 dark:text-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Live Preview Box */}
          <div className="p-3.5 bg-indigo-50/80 dark:bg-neutral-800 border-2 border-black dark:border-white/30 rounded-xl flex items-center justify-between gap-3 shadow-[2px_2px_0px_0px_#000]">
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
              <WebsiteLogo
                domain={previewDomain}
                url={url || bookmark.url}
                name={name || bookmark.name}
                favicon={bookmark.favicon}
                iconBg={bookmark.customIconBg}
                size="md"
              />
              <div className="truncate min-w-0">
                <p className="text-xs font-black text-black dark:text-white truncate">
                  {name || previewDomain || 'Website'}
                </p>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono truncate block">
                  {url || bookmark.url}
                </span>
              </div>
            </div>

            {isValidUrl(url || bookmark.url) && (
              <a
                href={url || bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 text-xs font-bold bg-white dark:bg-neutral-700 border-2 border-black/40 rounded-lg shrink-0 flex items-center gap-1 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#000]"
              >
                <span>Test</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Website Name */}
          <div>
            <label className="block text-xs font-black text-black dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Display Name</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. GitHub"
              className="w-full px-3.5 py-2.5 text-sm font-bold bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/40 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-black dark:text-white shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-xs font-black text-black dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Website URL</span>
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 text-sm font-bold bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/40 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-black dark:text-white shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          {/* Custom Named Lists / Collections Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-black dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
                <span>Custom Named Lists</span>
              </label>
              {onCreateCollection && (
                <button
                  type="button"
                  onClick={onCreateCollection}
                  className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                  <span>Create New List</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {collections.map((col) => {
                const isSelected = selectedCollections.includes(col.id);
                const colColor = getCollectionColor(col.color);
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => toggleCollectionSelection(col.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-black border-2 transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? `${colColor.badgeBg} border-black shadow-[2px_2px_0px_0px_#000] scale-102`
                        : 'bg-white dark:bg-neutral-800 text-black dark:text-white border-black/40 dark:border-white/30 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#000]'
                    }`}
                  >
                    {renderCollectionIcon(col.icon, 'w-3.5 h-3.5 stroke-[2.5]')}
                    <span>{col.name}</span>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-black text-black dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              <span>Tags</span>
            </label>

            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-black border border-black"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-rose-400 dark:hover:text-rose-600"
                    >
                      <X className="w-3 h-3 stroke-[3]" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Input */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add custom tag (e.g. Design, Work)..."
                className="flex-1 px-3 py-1.5 text-xs font-bold bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/40 rounded-xl focus:outline-hidden text-black dark:text-white shadow-[1px_1px_0px_0px_#000]"
              />
              <button
                type="button"
                onClick={() => handleAddTag()}
                className="px-3 py-1.5 text-xs font-black bg-amber-300 hover:bg-amber-400 text-black border-2 border-black rounded-xl shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
              >
                Add
              </button>
            </div>

            {/* Tag suggestions */}
            <div className="flex flex-wrap gap-1">
              {allExistingTags.slice(0, 10).map((t) => {
                const isSelected = tags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`text-[11px] px-2 py-0.5 rounded-md font-bold border transition-colors ${
                      isSelected
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black'
                        : 'bg-white dark:bg-neutral-800 text-black dark:text-white border-black/30 dark:border-white/30 hover:bg-amber-100'
                    }`}
                  >
                    #{t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Favorite Toggle */}
          <div
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-3 rounded-xl border-2 border-black dark:border-white/40 flex items-center justify-between cursor-pointer transition-all ${
              isFavorite
                ? 'bg-rose-100 dark:bg-rose-950/60 shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white dark:bg-neutral-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                }`}
              />
              <span className="text-xs font-black text-black dark:text-white">
                Pin to Favorites Bar
              </span>
            </div>
            <div
              className={`w-5 h-5 rounded-md border-2 border-black flex items-center justify-center ${
                isFavorite ? 'bg-rose-500 text-white' : 'bg-white'
              }`}
            >
              {isFavorite && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-black/10 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-black bg-white dark:bg-neutral-800 hover:bg-slate-100 text-black dark:text-white border-2 border-black dark:border-white/40 rounded-xl shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-black bg-amber-400 hover:bg-amber-500 text-black border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
