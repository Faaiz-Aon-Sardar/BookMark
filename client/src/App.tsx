/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useBookmarks } from './hooks/useBookmarks';
import { useTheme } from './hooks/useTheme';
import { Bookmark, CustomCollection } from './types/bookmark';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { BookmarkGrid } from './components/BookmarkGrid';
import { AddBookmarkModal } from './components/AddBookmarkModal';
import { EditBookmarkModal } from './components/EditBookmarkModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { CollectionModal } from './components/CollectionModal';
import { WindowsPackagingModal } from './components/WindowsPackagingModal';
import { ToastContainer } from './components/Toast';
import { Heart, Plus, Layers, X, FolderPlus, Settings2 } from 'lucide-react';
import { openInDefaultBrowser } from './utils/desktopLauncher';
import { getCollectionColor, renderCollectionIcon } from './utils/collectionUtils';
import { SEARCH_ENGINES, SearchEngine, fetchTopSearchResult } from './services/webSearchService';

export default function App() {
  const {
    bookmarks,
    favorites,
    collections,
    activeCollection,
    selectedCollectionId,
    setSelectedCollectionId,
    allTags,
    filteredBookmarks,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    selectedTag,
    setSelectedTag,
    toasts,
    removeToast,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    toggleFavorite,
    toggleBookmarkCollection,
    addCollection,
    updateCollection,
    deleteCollection,
    launchWebsite,
    exportData,
    importData,
    resetToDefaults,
    showToast,
  } = useBookmarks();

  const { theme, toggleTheme } = useTheme();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [addModalInitialQuery, setAddModalInitialQuery] = useState<string>('');
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [deletingBookmark, setDeletingBookmark] = useState<Bookmark | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState<boolean>(false);
  const [editingCollection, setEditingCollection] = useState<CustomCollection | null>(null);
  const [isPackagingModalOpen, setIsPackagingModalOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Capture PWA install prompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleTriggerPwaInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('success', 'Bookmark Launcher installed to desktop!');
      setDeferredPrompt(null);
    }
  };

  // Global keyboard shortcuts (Ctrl+N for Add, Esc handled in modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setAddModalInitialQuery('');
        setIsAddModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetHome = () => {
    setActiveFilter('all');
    setSelectedTag(null);
    setSelectedCollectionId(null);
    setSearchQuery('');
  };

  // Open Create Collection modal
  const handleOpenCreateCollection = () => {
    setEditingCollection(null);
    setIsCollectionModalOpen(true);
  };

  // Open Edit Collection modal
  const handleOpenEditCollection = (col: CustomCollection) => {
    setEditingCollection(col);
    setIsCollectionModalOpen(true);
  };

  // Save Collection (Create or Update)
  const handleSaveCollection = (data: {
    name: string;
    color: string;
    icon: string;
    description?: string;
  }) => {
    if (editingCollection) {
      return updateCollection(editingCollection.id, data);
    } else {
      const res = addCollection(data);
      if (res.success && res.collection) {
        // Automatically activate new collection
        setActiveFilter('collection');
        setSelectedCollectionId(res.collection.id);
        setSelectedTag(null);
      }
      return res;
    }
  };

  // Launch arbitrary URL directly in default browser
  const handleDirectLaunch = async (url: string) => {
    const res = await openInDefaultBrowser(url);
    if (res.success) {
      showToast('Launching in Browser', `Opening ${url.replace(/^https?:\/\//, '')}`);
    } else {
      showToast('Failed to open link', res.message || 'Could not launch URL', 'error');
    }
  };

  // When Enter is pressed or Search Web is clicked in main search bar
  const handleSearchSubmit = (query: string, engine: SearchEngine = 'google') => {
    const trimmed = query.trim();
    if (!trimmed) return;

    // If exact single bookmark match in filtered list, launch it
    if (filteredBookmarks.length === 1 && !trimmed.startsWith('http')) {
      launchWebsite(filteredBookmarks[0]);
      return;
    }

    const eng = SEARCH_ENGINES.find((s) => s.id === engine) || SEARCH_ENGINES[0];
    const searchUrl = eng.urlTemplate(trimmed);
    
    // Open search engine in second window / tab
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
    showToast(`Searching on ${eng.name}`, `Opened search in new window for "${trimmed}"`);
  };

  const handleAddWithQuery = (query: string) => {
    setAddModalInitialQuery(query);
    setIsAddModalOpen(true);
  };

  // Instant 1-click Auto-Search and save top URL as bookmark
  const handleInstantAddTopResult = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    try {
      const topResult = await fetchTopSearchResult(trimmed);
      const targetName = topResult.title.replace(/\s*\(Google Search\)/i, '');
      const res = addBookmark({
        name: targetName,
        url: topResult.url,
        customIconBg: topResult.iconBg,
        tags: topResult.category ? [topResult.category] : undefined,
        favicon: topResult.favicon,
        collections: selectedCollectionId ? [selectedCollectionId] : undefined,
      });

      if (res.success) {
        showToast('Bookmark Added!', `Auto-saved "${targetName}" (${topResult.url})`);
        setSearchQuery('');
      } else {
        showToast('Note', res.error || 'Failed to add bookmark', 'error');
      }
    } catch (err) {
      showToast('Search Failed', 'Could not retrieve top URL', 'error');
    }
  };

  const activeColColor = activeCollection ? getCollectionColor(activeCollection.color) : null;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FAF8F5] dark:bg-[#121212] text-black dark:text-white flex flex-col antialiased selection:bg-amber-300 dark:selection:bg-amber-400 selection:text-black transition-colors">
      {/* Hidden File Input for Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportFileChange}
        className="hidden"
      />

      {/* Top Header */}
      <Header
        activeFilter={activeFilter}
        onSelectFilter={(filter) => {
          setActiveFilter(filter);
          setSelectedTag(null);
          setSelectedCollectionId(null);
        }}
        onAddNew={() => {
          setAddModalInitialQuery('');
          setIsAddModalOpen(true);
        }}
        onOpenPackagingModal={() => setIsPackagingModalOpen(true)}
        onToggleMobileMenu={() => setIsMobileDrawerOpen(true)}
        onResetHome={handleResetHome}
        favoritesCount={favorites.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex-1 flex w-full max-w-full overflow-x-hidden px-3 sm:px-6 lg:px-8">
        {/* Sidebar (Desktop docked + Mobile slide-out drawer) */}
        <Sidebar
          activeFilter={activeFilter}
          onSelectFilter={(filter) => {
            setActiveFilter(filter);
            setSelectedTag(null);
          }}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          collections={collections}
          selectedCollectionId={selectedCollectionId}
          onSelectCollection={(id) => {
            setSelectedCollectionId(id);
            if (id) {
              setActiveFilter('collection');
            }
          }}
          onCreateCollection={handleOpenCreateCollection}
          onEditCollection={handleOpenEditCollection}
          bookmarks={bookmarks}
          tags={allTags}
          totalCount={bookmarks.length}
          favoritesCount={favorites.length}
          onAddNew={() => {
            setAddModalInitialQuery('');
            setIsAddModalOpen(true);
          }}
          onExport={exportData}
          onImportClick={() => fileInputRef.current?.click()}
          onResetDefaults={resetToDefaults}
          onOpenPackagingModal={() => setIsPackagingModalOpen(true)}
          isOpenMobile={isMobileDrawerOpen}
          onCloseMobile={() => setIsMobileDrawerOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Main Content Area - Full fluid desktop width */}
        <main className="flex-1 min-w-0 w-full max-w-full overflow-x-hidden py-4 sm:py-6 md:pl-8 lg:pl-10 pb-24 md:pb-12">
          {/* Header & Search Zone - High z-index to float over grid */}
          <div className="mb-4 sm:mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-6 relative z-30 w-full max-w-full">
            <div className="shrink-0 min-w-0">
              <h2 className="text-lg sm:text-2xl font-black text-black dark:text-white tracking-tight truncate">
                {activeFilter === 'favorites' ? (
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-rose-500 text-rose-500 stroke-[2.5]" />
                    <span>Favorite Websites</span>
                  </span>
                ) : activeFilter === 'collection' && activeCollection ? (
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg ${activeColColor?.badgeBg} border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_#000]`}
                    >
                      {renderCollectionIcon(activeCollection.icon, 'w-3.5 h-3.5 sm:w-4 sm:h-4 text-black stroke-[2.5]')}
                    </span>
                    <span className="truncate">{activeCollection.name}</span>
                  </span>
                ) : selectedTag ? (
                  <span className="flex items-center gap-2">
                    <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                    <span className="truncate">Category: #{selectedTag}</span>
                  </span>
                ) : (
                  <span>All Bookmarks &amp; Launcher</span>
                )}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-neutral-400 mt-0.5 sm:mt-1 truncate">
                {activeFilter === 'favorites'
                  ? 'Your quick-access pinned websites and favorite tools.'
                  : activeFilter === 'collection' && activeCollection
                  ? activeCollection.description || `Custom list with ${filteredBookmarks.length} websites saved.`
                  : selectedTag
                  ? `Showing websites filtered under #${selectedTag}`
                  : 'Search saved apps, discover new websites, or launch web queries.'}
              </p>
            </div>

            {/* Fluid Omni Search Bar */}
            <div className="w-full max-w-full lg:max-w-xl xl:max-w-2xl min-w-0">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                onSubmit={handleSearchSubmit}
              />
            </div>
          </div>

          {/* Mobile Horizontal Category & List Chips */}
          {(allTags.length > 0 || collections.length > 0) && (
            <div className="md:hidden mb-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setSelectedTag(null);
                  setSelectedCollectionId(null);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-black whitespace-nowrap border-2 border-black dark:border-white/40 transition-all ${
                  activeFilter === 'all' && selectedTag === null && selectedCollectionId === null
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-[2px_2px_0px_0px_#4F46E5]'
                    : 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#FFF]'
                }`}
              >
                All
              </button>

              {/* Collections chips */}
              {collections.map((col) => {
                const isSelected = activeFilter === 'collection' && selectedCollectionId === col.id;
                const colColor = getCollectionColor(col.color);
                return (
                  <button
                    key={col.id}
                    onClick={() => {
                      setActiveFilter('collection');
                      setSelectedCollectionId(col.id);
                      setSelectedTag(null);
                    }}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-black whitespace-nowrap border-2 border-black transition-all flex items-center gap-1 ${
                      isSelected
                        ? `${colColor.bgActive} shadow-[2px_2px_0px_0px_#000]`
                        : 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-[1.5px_1.5px_0px_0px_#000]'
                    }`}
                  >
                    {renderCollectionIcon(col.icon, 'w-3 h-3 stroke-[2.5]')}
                    <span>{col.name}</span>
                  </button>
                );
              })}

              {/* Tag chips */}
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(selectedTag === tag ? null : tag);
                    setSelectedCollectionId(null);
                    setActiveFilter('tag');
                  }}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-black whitespace-nowrap border-2 border-black dark:border-white/40 transition-all ${
                    selectedTag === tag
                      ? 'bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]'
                      : 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#FFF]'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Active Tag Filter Indicator */}
          {selectedTag && (
            <div className="mb-5 flex items-center justify-between gap-2 bg-yellow-200 dark:bg-neutral-800 border-2 border-black dark:border-white/30 p-2 sm:p-2.5 rounded-xl max-w-fit shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]">
              <span className="text-xs font-black text-black dark:text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
                Filtered by: <span className="font-black text-black dark:text-amber-300">#{selectedTag}</span>
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                aria-label="Clear category filter"
                className="text-xs text-black dark:text-white bg-white dark:bg-neutral-900 hover:bg-black hover:text-white dark:hover:bg-neutral-700 border border-black dark:border-white/30 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-[1px_1px_0px_0px_#000] dark:shadow-[1px_1px_0px_0px_#FFF] active:shadow-none transition-colors font-bold"
              >
                <X className="w-3 h-3 stroke-[3]" />
                <span>Clear</span>
              </button>
            </div>
          )}

          {/* Main Grid View */}
          <BookmarkGrid
            bookmarks={bookmarks}
            favorites={favorites}
            filteredBookmarks={filteredBookmarks}
            collections={collections}
            activeCollection={activeCollection}
            searchQuery={searchQuery}
            activeFilter={activeFilter}
            onLaunch={launchWebsite}
            onDirectLaunch={handleDirectLaunch}
            onToggleFavorite={toggleFavorite}
            onToggleCollection={toggleBookmarkCollection}
            onEdit={(bm) => setEditingBookmark(bm)}
            onEditCollection={handleOpenEditCollection}
            onDeleteRequest={(bm) => setDeletingBookmark(bm)}
            onAddNew={() => {
              setAddModalInitialQuery('');
              setIsAddModalOpen(true);
            }}
            onAddWithQuery={handleAddWithQuery}
            onInstantAddTopResult={handleInstantAddTopResult}
            onClearSearch={() => setSearchQuery('')}
            onCopyLink={() => showToast('Link copied', 'Website URL copied to clipboard.')}
            onSelectTag={setSelectedTag}
          />
        </main>
      </div>

      {/* Bottom Floating Navigation Bar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full md:hidden flex justify-around items-center py-2 px-3 bg-white dark:bg-neutral-900 border-t-2 border-black dark:border-white/30 shadow-[0_-2px_0px_0px_rgba(0,0,0,0.1)] z-40 transition-colors">
        <button
          onClick={() => {
            setActiveFilter('all');
            setSelectedTag(null);
            setSelectedCollectionId(null);
          }}
          className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 transition-all ${
            activeFilter === 'all' && selectedTag === null && selectedCollectionId === null
              ? 'text-black font-black bg-amber-300 dark:bg-amber-400 border border-black rounded-lg shadow-[1px_1px_0px_0px_#000]'
              : 'text-slate-700 dark:text-neutral-400 font-bold'
          }`}
        >
          <span className="text-[10px] mt-0.5 font-black">All</span>
        </button>

        <button
          onClick={() => {
            setActiveFilter('favorites');
            setSelectedTag(null);
            setSelectedCollectionId(null);
          }}
          className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 transition-all ${
            activeFilter === 'favorites'
              ? 'text-white font-black bg-rose-500 border border-black dark:border-white/40 rounded-lg shadow-[1px_1px_0px_0px_#000]'
              : 'text-slate-700 dark:text-neutral-400 font-bold'
          }`}
        >
          <Heart className={`w-4 h-4 stroke-[2.5] ${activeFilter === 'favorites' ? 'fill-white' : ''}`} />
          <span className="text-[10px] mt-0.5 font-black">Favorites</span>
        </button>

        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center rounded-xl px-3 py-1 text-black dark:text-white font-bold active:scale-95"
        >
          <FolderPlus className="w-4 h-4 stroke-[2.5]" />
          <span className="text-[10px] mt-0.5 font-black">Lists</span>
        </button>

        <button
          onClick={() => {
            setAddModalInitialQuery('');
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-3.5 py-1.5 rounded-xl border-2 border-black dark:border-white/40 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add</span>
        </button>
      </nav>

      {/* Modals */}
      <AddBookmarkModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAddModalInitialQuery('');
        }}
        onAdd={addBookmark}
        existingBookmarks={bookmarks}
        collections={collections}
        onCreateCollection={handleOpenCreateCollection}
        initialSearchQuery={addModalInitialQuery}
      />

      <EditBookmarkModal
        bookmark={editingBookmark}
        isOpen={!!editingBookmark}
        onClose={() => setEditingBookmark(null)}
        onSave={updateBookmark}
        existingBookmarks={bookmarks}
        collections={collections}
        onCreateCollection={handleOpenCreateCollection}
      />

      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => {
          setIsCollectionModalOpen(false);
          setEditingCollection(null);
        }}
        onSave={handleSaveCollection}
        onDelete={deleteCollection}
        initialCollection={editingCollection}
      />

      <DeleteConfirmModal
        bookmark={deletingBookmark}
        isOpen={!!deletingBookmark}
        onClose={() => setDeletingBookmark(null)}
        onConfirm={deleteBookmark}
      />

      <WindowsPackagingModal
        isOpen={isPackagingModalOpen}
        onClose={() => setIsPackagingModalOpen(false)}
        onExportBackup={exportData}
        deferredPrompt={deferredPrompt}
        onTriggerPwaInstall={handleTriggerPwaInstall}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
