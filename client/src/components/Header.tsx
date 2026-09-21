import React from 'react';
import { Plus, Heart, Grid, Download, Menu } from 'lucide-react';
import { ViewFilter } from '../types/bookmark';
import { AppLogo } from './AppLogo';
import { ThemeToggle } from './ThemeToggle';
import { Theme } from '../hooks/useTheme';

interface HeaderProps {
  activeFilter: ViewFilter;
  onSelectFilter: (filter: ViewFilter) => void;
  onAddNew: () => void;
  onOpenPackagingModal: () => void;
  onToggleMobileMenu?: () => void;
  onResetHome?: () => void;
  favoritesCount: number;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeFilter,
  onSelectFilter,
  onAddNew,
  onOpenPackagingModal,
  onToggleMobileMenu,
  onResetHome,
  favoritesCount,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="w-full max-w-full bg-white dark:bg-neutral-900 border-b-2 border-black dark:border-white/20 sticky top-0 z-30 shadow-[0_2px_0px_0px_rgba(0,0,0,0.05)] transition-colors">
      <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Zone */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              aria-label="Open navigation menu"
              className="md:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-2 border-black dark:border-white/40 bg-amber-300 dark:bg-amber-400 hover:bg-amber-400 flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all shrink-0 cursor-pointer"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
          )}
          <AppLogo size="sm" showText={true} onClick={onResetHome} />
        </div>

        {/* Zone 2: Navigation Links (Desktop/Tablet) */}
        <nav className="hidden md:flex items-center gap-2 p-1 bg-slate-100 dark:bg-neutral-800 rounded-xl border-2 border-black dark:border-white/20">
          <button
            onClick={() => onSelectFilter('all')}
            className={`h-8 px-4 rounded-lg font-black text-xs sm:text-sm transition-all whitespace-nowrap border-2 flex items-center justify-center cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-[2px_2px_0px_0px_#4F46E5]'
                : 'bg-transparent text-slate-800 dark:text-neutral-300 border-transparent hover:border-black dark:hover:border-white/40 hover:bg-white dark:hover:bg-neutral-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Grid className="w-4 h-4" />
              <span>All Bookmarks</span>
            </span>
          </button>

          <button
            onClick={() => onSelectFilter('favorites')}
            className={`h-8 px-4 rounded-lg font-black text-xs sm:text-sm transition-all whitespace-nowrap border-2 flex items-center justify-center cursor-pointer ${
              activeFilter === 'favorites'
                ? 'bg-rose-500 text-white border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]'
                : 'bg-transparent text-slate-800 dark:text-neutral-300 border-transparent hover:border-black dark:hover:border-white/40 hover:bg-white dark:hover:bg-neutral-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-current stroke-[2.5]" />
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-white text-black font-black border border-black ml-0.5">
                  {favoritesCount}
                </span>
              )}
            </span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Theme Toggle Button (Always visible) */}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {/* Download / Install Desktop App Button (Hidden on small mobile to avoid overflow, accessible via drawer/bottom bar) */}
          <button
            onClick={onOpenPackagingModal}
            className="hidden sm:flex h-9 items-center justify-center gap-1.5 text-xs font-black px-3.5 rounded-xl border-2 border-black dark:border-white/40 bg-cyan-300 hover:bg-cyan-400 text-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer whitespace-nowrap"
            title="Download or Install Desktop App for Windows & Mac"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden md:inline">Download App</span>
            <span className="md:hidden">Install</span>
          </button>

          {/* Add Bookmark Button (Hidden on small mobile to avoid header overflow, prominent in mobile bottom nav bar) */}
          <button
            onClick={onAddNew}
            className="hidden sm:flex h-9 items-center justify-center gap-1.5 text-xs sm:text-sm font-black px-3.5 sm:px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-black dark:border-white/40 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden md:inline">Add Bookmark</span>
            <span className="md:hidden">Add</span>
          </button>
        </div>
      </div>
    </header>
  );
};
