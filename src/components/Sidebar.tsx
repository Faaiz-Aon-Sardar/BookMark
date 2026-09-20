import React from 'react';
import {
  Grid,
  Heart,
  Download,
  Upload,
  Layers,
  Sparkles,
  Monitor,
  X,
  Plus,
  Settings2,
  FolderPlus,
} from 'lucide-react';
import { Bookmark, CustomCollection, ViewFilter } from '../types/bookmark';
import { AppLogo } from './AppLogo';
import { ThemeToggle } from './ThemeToggle';
import { Theme } from '../hooks/useTheme';
import { getCollectionColor, renderCollectionIcon } from '../utils/collectionUtils';

interface SidebarProps {
  activeFilter: ViewFilter;
  onSelectFilter: (filter: ViewFilter) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  collections: CustomCollection[];
  selectedCollectionId: string | null;
  onSelectCollection: (id: string | null) => void;
  onCreateCollection: () => void;
  onEditCollection: (col: CustomCollection) => void;
  bookmarks: Bookmark[];
  tags: string[];
  totalCount: number;
  favoritesCount: number;
  onAddNew?: () => void;
  onExport: () => void;
  onImportClick: () => void;
  onResetDefaults: () => void;
  onOpenPackagingModal: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeFilter,
  onSelectFilter,
  selectedTag,
  onSelectTag,
  collections,
  selectedCollectionId,
  onSelectCollection,
  onCreateCollection,
  onEditCollection,
  bookmarks,
  tags,
  totalCount,
  favoritesCount,
  onExport,
  onImportClick,
  onResetDefaults,
  onOpenPackagingModal,
  isOpenMobile = false,
  onCloseMobile,
  theme,
  onToggleTheme,
}) => {
  const renderNavContent = (isDrawer = false) => (
    <div className="flex flex-col h-full space-y-6 overflow-y-auto no-scrollbar">
      {/* Mobile Drawer Header with Logo & Close */}
      {isDrawer && (
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-black dark:border-white/30">
          <AppLogo size="sm" showText={true} />
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              aria-label="Close navigation drawer"
              className="w-8 h-8 rounded-xl border-2 border-black dark:border-white/40 bg-rose-400 hover:bg-rose-500 flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="space-y-2">
        <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-neutral-400 px-1">
          Views
        </div>
        <nav className="flex flex-col gap-1.5">
          <button
            onClick={() => {
              onSelectFilter('all');
              onSelectTag(null);
              onSelectCollection(null);
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full text-left p-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-between border-2 border-black dark:border-white/30 transition-all cursor-pointer ${
              activeFilter === 'all' && selectedTag === null && selectedCollectionId === null
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-[3px_3px_0px_0px_#6366F1]'
                : 'bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Grid className="w-4 h-4" />
              <span>All Bookmarks</span>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-md font-black border border-black ${
                activeFilter === 'all' && selectedTag === null && selectedCollectionId === null
                  ? 'bg-white text-black'
                  : 'bg-slate-200 dark:bg-neutral-700 text-black dark:text-white'
              }`}
            >
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => {
              onSelectFilter('favorites');
              onSelectTag(null);
              onSelectCollection(null);
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full text-left p-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-between border-2 border-black dark:border-white/30 transition-all cursor-pointer ${
              activeFilter === 'favorites'
                ? 'bg-rose-500 text-white shadow-[3px_3px_0px_0px_#000]'
                : 'bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-rose-50 dark:hover:bg-neutral-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4 fill-current stroke-[2.5]" />
              <span>Favorites</span>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-md font-black border border-black ${
                activeFilter === 'favorites'
                  ? 'bg-white text-black'
                  : 'bg-rose-100 text-rose-800 dark:bg-neutral-700 dark:text-rose-300'
              }`}
            >
              {favoritesCount}
            </span>
          </button>
        </nav>
      </div>

      {/* Custom Named Collections */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-neutral-400">
            Custom Lists
          </span>
          <button
            onClick={() => {
              onCreateCollection();
              if (onCloseMobile) onCloseMobile();
            }}
            title="Create a new custom list"
            className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New List</span>
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          {collections.map((col) => {
            const isSelected = activeFilter === 'collection' && selectedCollectionId === col.id;
            const colBookmarks = bookmarks.filter((b) => (b.collections || []).includes(col.id));
            const colColor = getCollectionColor(col.color);

            return (
              <div
                key={col.id}
                className={`group flex items-center justify-between p-2 rounded-xl border-2 border-black dark:border-white/30 transition-all cursor-pointer ${
                  isSelected
                    ? `${colColor.bgActive} shadow-[3px_3px_0px_0px_#000] font-black`
                    : 'bg-white dark:bg-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-700 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]'
                }`}
                onClick={() => {
                  onSelectCollection(col.id);
                  if (onCloseMobile) onCloseMobile();
                }}
              >
                <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                  <div
                    className={`w-6 h-6 rounded-lg ${colColor.badgeBg} border border-black flex items-center justify-center text-black shrink-0`}
                  >
                    {renderCollectionIcon(col.icon, 'w-3.5 h-3.5 stroke-[2.5]')}
                  </div>
                  <span className="text-xs font-black truncate text-black dark:text-white">
                    {col.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCollection(col);
                    }}
                    title={`Edit ${col.name}`}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 dark:hover:bg-white/20 rounded-md transition-opacity cursor-pointer"
                  >
                    <Settings2 className="w-3 h-3 text-black dark:text-white" />
                  </button>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md border border-black bg-white dark:bg-neutral-900 text-black dark:text-white">
                    {colBookmarks.length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tags / Categories */}
      {tags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Tags
            </span>
            {selectedTag && (
              <button
                onClick={() => onSelectTag(null)}
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => {
                    onSelectTag(isSelected ? null : tag);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg font-black border-2 border-black dark:border-white/30 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000] scale-105'
                      : 'bg-white dark:bg-neutral-800 text-slate-700 dark:text-neutral-200 hover:bg-amber-100 dark:hover:bg-neutral-700 shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#FFF]'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Data Backup & Desktop Shortcuts */}
      <div className="pt-3 border-t-2 border-black dark:border-white/20 space-y-2.5 mt-auto">
        <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-neutral-400 px-1">
          Data &amp; Backup
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onExport}
            className="p-2 text-xs font-bold bg-white dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 text-black dark:text-white rounded-xl border-2 border-black dark:border-white/30 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] flex items-center justify-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            title="Export all bookmarks and lists to JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={onImportClick}
            className="p-2 text-xs font-bold bg-white dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 text-black dark:text-white rounded-xl border-2 border-black dark:border-white/30 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] flex items-center justify-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            title="Import bookmarks from JSON file"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>
        </div>

        <button
          onClick={() => {
            onOpenPackagingModal();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full p-2.5 text-xs font-black bg-cyan-300 hover:bg-cyan-400 text-black rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
        >
          <Monitor className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Desktop App</span>
        </button>

        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 border border-black"></div>
            <span className="text-[11px] font-bold text-slate-600 dark:text-neutral-400">Auto-saved</span>
          </div>
          <button
            onClick={onResetDefaults}
            title="Reset to default bookmarks & lists"
            className="text-[10px] font-bold text-slate-500 hover:text-black dark:hover:text-white underline cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop In-Flow Sticky Sidebar */}
      <aside className="w-64 lg:w-72 shrink-0 hidden md:block sticky top-16 h-[calc(100vh-4rem)] py-6 pr-6 lg:pr-8 border-r-2 border-black dark:border-white/20">
        {renderNavContent(false)}
      </aside>

      {/* Mobile Slide-out Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          {/* Drawer Sheet */}
          <div className="relative w-[280px] max-w-[85vw] h-full bg-white dark:bg-neutral-900 border-r-2 border-black dark:border-white/30 shadow-[4px_0px_0px_0px_#000] p-4 z-10 animate-in slide-in-from-left duration-200 flex flex-col transition-colors">
            {renderNavContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
