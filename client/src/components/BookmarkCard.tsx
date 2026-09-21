import React, { useState, useRef, useEffect } from 'react';
import { Bookmark, CustomCollection } from '../types/bookmark';
import { WebsiteLogo } from './WebsiteLogo';
import {
  Heart,
  MoreVertical,
  ExternalLink,
  Edit3,
  Trash2,
  Copy,
  Check,
  FolderPlus,
  ArrowUpRight,
} from 'lucide-react';
import { getCollectionColor, renderCollectionIcon } from '../utils/collectionUtils';

interface BookmarkCardProps {
  bookmark: Bookmark;
  collections?: CustomCollection[];
  onLaunch: (bookmark: Bookmark) => void;
  onToggleFavorite: (id: string) => void;
  onToggleCollection?: (bookmarkId: string, collectionId: string) => void;
  onEdit: (bookmark: Bookmark) => void;
  onDeleteRequest: (bookmark: Bookmark) => void;
  onCopyLink?: (url: string) => void;
  onSelectTag?: (tag: string) => void;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  collections = [],
  onLaunch,
  onToggleFavorite,
  onToggleCollection,
  onEdit,
  onDeleteRequest,
  onCopyLink,
  onSelectTag,
}) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [collectionMenuOpen, setCollectionMenuOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const colMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (colMenuRef.current && !colMenuRef.current.contains(event.target as Node)) {
        setCollectionMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCardClick = (e: React.MouseEvent) => {
    if (menuOpen || collectionMenuOpen) return;
    onLaunch(bookmark);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(bookmark.id);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
    setCollectionMenuOpen(false);
  };

  const handleColMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCollectionMenuOpen(!collectionMenuOpen);
    setMenuOpen(false);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    if (onCopyLink) onCopyLink(bookmark.url);
    setTimeout(() => {
      setCopied(false);
      setMenuOpen(false);
    }, 1200);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(bookmark);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDeleteRequest(bookmark);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    if (onSelectTag) {
      onSelectTag(tag);
    }
  };

  // Find collections this bookmark belongs to
  const assignedCollections = collections.filter((c) =>
    (bookmark.collections || []).includes(c.id)
  );

  return (
    <article
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/30 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between cursor-pointer select-none transition-all duration-150 shadow-[2.5px_2.5px_0px_0px_#000] dark:shadow-[2.5px_2.5px_0px_0px_#FFF] hover:shadow-[4px_4px_0px_0px_#000] dark:hover:shadow-[4px_4px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none h-[184px] sm:h-[204px] w-full max-w-full min-w-0"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onLaunch(bookmark);
        }
      }}
      aria-label={`Launch ${bookmark.name} (${bookmark.domain})`}
    >
      {/* Top Bar inside Card - Symmetrical Buttons */}
      <div className="w-full flex items-center justify-between relative z-10 h-6.5 sm:h-7 shrink-0">
        {/* Left: Options Context Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={handleMenuToggle}
            aria-label={`Options for ${bookmark.name}`}
            className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg bg-slate-100 dark:bg-neutral-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-black dark:border-white/40 flex items-center justify-center text-black dark:text-white shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#FFF] active:shadow-none transition-all cursor-pointer"
          >
            <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </button>

          {/* Context Dropdown */}
          {menuOpen && (
            <div
              className="absolute top-8 left-0 w-44 sm:w-52 bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/40 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF] overflow-hidden z-40 py-1 animate-in fade-in zoom-in-95 duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onLaunch(bookmark);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 sm:py-2 hover:bg-amber-200 dark:hover:bg-neutral-800 text-xs font-bold text-black dark:text-white text-left border-b border-slate-100 dark:border-neutral-800 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                <span>Open in Browser</span>
              </button>
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-2 px-3 py-1.5 sm:py-2 hover:bg-amber-200 dark:hover:bg-neutral-800 text-xs font-bold text-black dark:text-white text-left border-b border-slate-100 dark:border-neutral-800 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                    <span className="text-emerald-700 dark:text-emerald-300 font-black">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600 dark:text-neutral-400" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
              <button
                onClick={handleEditClick}
                className="w-full flex items-center gap-2 px-3 py-1.5 sm:py-2 hover:bg-amber-200 dark:hover:bg-neutral-800 text-xs font-bold text-black dark:text-white text-left border-b border-slate-100 dark:border-neutral-800 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-600 dark:text-neutral-400" />
                <span>Edit Details</span>
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full flex items-center gap-2 px-3 py-1.5 sm:py-2 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-xs font-bold text-rose-600 dark:text-rose-400 text-left cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Right side actions: Uniform square buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Custom Lists Quick Selector Popover */}
          {collections.length > 0 && onToggleCollection && (
            <div className="relative" ref={colMenuRef}>
              <button
                type="button"
                onClick={handleColMenuToggle}
                title={
                  assignedCollections.length > 0
                    ? `In lists: ${assignedCollections.map((c) => c.name).join(', ')}`
                    : 'Add to custom lists'
                }
                className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg border border-black dark:border-white/40 flex items-center justify-center transition-all shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#FFF] active:shadow-none cursor-pointer ${
                  assignedCollections.length > 0
                    ? 'bg-amber-300 dark:bg-amber-400 text-black font-black'
                    : 'bg-white dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-700'
                }`}
              >
                {assignedCollections.length > 0 ? (
                  renderCollectionIcon(assignedCollections[0].icon, 'w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]')
                ) : (
                  <FolderPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                )}
              </button>

              {/* Collections Quick Dropdown */}
              {collectionMenuOpen && (
                <div
                  className="absolute top-8 right-0 w-48 sm:w-52 bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/40 rounded-xl shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF] overflow-hidden z-40 py-1 animate-in fade-in zoom-in-95 duration-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-1 border-b border-slate-200 dark:border-neutral-800 text-[10px] font-black uppercase text-slate-500 dark:text-neutral-400 tracking-wider">
                    Custom Lists
                  </div>
                  {collections.map((col) => {
                    const isMember = (bookmark.collections || []).includes(col.id);
                    const colColor = getCollectionColor(col.color);
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCollection(bookmark.id, col.id);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold text-left transition-colors cursor-pointer ${
                          isMember
                            ? `${colColor.bg} text-black dark:text-white font-black`
                            : 'hover:bg-slate-100 dark:hover:bg-neutral-800 text-black dark:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate min-w-0">
                          <span
                            className={`w-4.5 h-4.5 rounded ${colColor.badgeBg} border border-black flex items-center justify-center shrink-0`}
                          >
                            {renderCollectionIcon(col.icon, 'w-2.5 h-2.5 text-black stroke-[2.5]')}
                          </span>
                          <span className="truncate">{col.name}</span>
                        </div>
                        {isMember && <Check className="w-3.5 h-3.5 text-black dark:text-amber-300 stroke-[3] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Favorite Heart Toggle */}
          <button
            onClick={handleFavoriteClick}
            aria-label={
              bookmark.isFavorite
                ? `Remove ${bookmark.name} from favorites`
                : `Add ${bookmark.name} to favorites`
            }
            className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg border border-black dark:border-white/40 flex items-center justify-center transition-all shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#FFF] active:shadow-none cursor-pointer ${
              bookmark.isFavorite
                ? 'text-white bg-rose-500'
                : 'text-black dark:text-white bg-white dark:bg-neutral-800 hover:bg-rose-100 dark:hover:bg-neutral-700'
            }`}
          >
            <Heart
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5] ${
                bookmark.isFavorite ? 'fill-white text-white' : 'text-black dark:text-white'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Center Website Logo & Identity */}
      <div className="flex flex-col items-center justify-center my-auto w-full py-0.5 min-w-0">
        <WebsiteLogo
          domain={bookmark.domain}
          url={bookmark.url}
          name={bookmark.name}
          favicon={bookmark.favicon}
          iconBg={bookmark.customIconBg}
          size="md"
          hoverEffect={true}
          className="mb-1.5"
        />

        {/* Website Name & Subtitle */}
        <div className="text-center w-full px-1 min-w-0">
          <p className="font-black text-xs sm:text-sm text-black dark:text-white truncate tracking-tight leading-tight group-hover:text-indigo-600 dark:group-hover:text-amber-300 transition-colors">
            {bookmark.name}
          </p>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-neutral-400 truncate mt-0.5 font-mono">
            {bookmark.domain}
          </p>
        </div>
      </div>

      {/* Card bottom: Tag badges & Launch button on exact same baseline */}
      <div className="w-full flex items-center justify-between pt-1.5 sm:pt-2 border-t-2 border-black dark:border-white/30 shrink-0 h-7 sm:h-8">
        <div className="flex items-center gap-1 overflow-hidden min-w-0 flex-1">
          {assignedCollections.length > 0 ? (
            <span
              title={`In list: ${assignedCollections[0].name}`}
              className={`h-5 text-[9px] sm:text-[10px] font-black border border-black px-1.5 rounded-md truncate max-w-[80px] sm:max-w-[120px] flex items-center gap-1 shadow-[1px_1px_0px_0px_#000] shrink-0 ${getCollectionColor(assignedCollections[0].color).badgeBg}`}
            >
              {renderCollectionIcon(assignedCollections[0].icon, 'w-2.5 h-2.5 shrink-0 stroke-[3]')}
              <span className="truncate">{assignedCollections[0].name}</span>
            </span>
          ) : bookmark.tags && bookmark.tags.length > 0 ? (
            <button
              type="button"
              onClick={(e) => handleTagClick(e, bookmark.tags![0])}
              title={`Filter by tag #${bookmark.tags[0]}`}
              className="h-5 text-[9px] sm:text-[10px] font-black text-black bg-amber-200 hover:bg-amber-300 border border-black dark:border-white/40 px-1.5 rounded-md truncate max-w-[80px] sm:max-w-[120px] shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 transition-all text-left flex items-center cursor-pointer shrink-0"
            >
              #{bookmark.tags[0]}
            </button>
          ) : (
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-neutral-500 font-mono">
              Direct
            </span>
          )}
        </div>

        <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md bg-slate-100 dark:bg-neutral-800 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-amber-300 dark:group-hover:text-black border border-black dark:border-white/30 flex items-center justify-center text-slate-700 dark:text-neutral-300 shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#FFF] transition-colors shrink-0 ml-1">
          <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
        </div>
      </div>
    </article>
  );
};
