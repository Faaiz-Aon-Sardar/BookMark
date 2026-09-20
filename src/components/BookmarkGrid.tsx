import React, { useState, useEffect, useRef } from 'react';
import { Bookmark, CustomCollection, ViewFilter } from '../types/bookmark';
import { BookmarkCard } from './BookmarkCard';
import { EmptyState } from './EmptyState';
import { WebsiteLogo } from './WebsiteLogo';
import {
  Plus,
  Heart,
  Grid,
  Search,
  ExternalLink,
  Loader2,
  ListChecks,
  Settings2,
} from 'lucide-react';
import {
  getSmartWebResults,
  fetchAllWebSearchUrls,
  WebSearchResult,
} from '../services/webSearchService';
import { getCollectionColor, renderCollectionIcon } from '../utils/collectionUtils';

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  favorites: Bookmark[];
  filteredBookmarks: Bookmark[];
  collections?: CustomCollection[];
  activeCollection?: CustomCollection;
  searchQuery: string;
  activeFilter: ViewFilter;
  onLaunch: (bookmark: Bookmark) => void;
  onDirectLaunch?: (url: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleCollection?: (bookmarkId: string, collectionId: string) => void;
  onEdit: (bookmark: Bookmark) => void;
  onEditCollection?: (collection: CustomCollection) => void;
  onDeleteRequest: (bookmark: Bookmark) => void;
  onAddNew: () => void;
  onAddWithQuery?: (query: string) => void;
  onInstantAddTopResult?: (query: string) => void;
  onClearSearch: () => void;
  onCopyLink?: (url: string) => void;
  onSelectTag?: (tag: string) => void;
}

export const BookmarkGrid: React.FC<BookmarkGridProps> = ({
  bookmarks,
  favorites,
  filteredBookmarks,
  collections = [],
  activeCollection,
  searchQuery,
  activeFilter,
  onLaunch,
  onDirectLaunch,
  onToggleFavorite,
  onToggleCollection,
  onEdit,
  onEditCollection,
  onDeleteRequest,
  onAddNew,
  onAddWithQuery,
  onInstantAddTopResult,
  onClearSearch,
  onCopyLink,
  onSelectTag,
}) => {
  const [isInstantAdding, setIsInstantAdding] = useState<boolean>(false);
  const [showAllWebResults, setShowAllWebResults] = useState<boolean>(true);
  const [liveWebResults, setLiveWebResults] = useState<WebSearchResult[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const searchTimeoutRef = useRef<any>(null);

  // Fetch real web search results when searchQuery changes
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setLiveWebResults([]);
      setIsLoadingSearch(false);
      return;
    }

    // Instant local results
    const immediate = getSmartWebResults(trimmed);
    setLiveWebResults(immediate);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsLoadingSearch(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await fetchAllWebSearchUrls(trimmed);
        setLiveWebResults(results);
      } catch {
        // Keep immediate results on failure
      } finally {
        setIsLoadingSearch(false);
      }
    }, 450);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const trimmedQuery = searchQuery.trim();

  // Search Results Mode
  if (trimmedQuery) {
    if (filteredBookmarks.length === 0 && liveWebResults.length === 0 && !isLoadingSearch) {
      return (
        <EmptyState
          type="search-empty"
          query={trimmedQuery}
          onAction={() => {
            if (onAddWithQuery) {
              onAddWithQuery(trimmedQuery);
            } else {
              onAddNew();
            }
          }}
          onClearSearch={onClearSearch}
        />
      );
    }

    const handleQuickAdd = async (urlToAdd: string) => {
      if (!onInstantAddTopResult) return;
      setIsInstantAdding(true);
      try {
        await onInstantAddTopResult(urlToAdd);
      } finally {
        setIsInstantAdding(false);
      }
    };

    return (
      <div className="space-y-5 sm:space-y-8 w-full max-w-full">
        {/* Saved Bookmarks Search Results */}
        <section className="w-full max-w-full">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-black text-sm sm:text-lg tracking-tight flex items-center gap-1.5 sm:gap-2 text-black dark:text-white truncate">
              <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5] shrink-0" />
              <span className="truncate">Saved Bookmarks for "{trimmedQuery}"</span>
            </h3>
            <span className="font-black text-[11px] sm:text-xs bg-amber-300 text-black border-2 border-black px-2 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_0px_#000] shrink-0 ml-1">
              {filteredBookmarks.length} found
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-4 md:gap-5 w-full">
            {filteredBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                collections={collections}
                onLaunch={onLaunch}
                onToggleFavorite={onToggleFavorite}
                onToggleCollection={onToggleCollection}
                onEdit={onEdit}
                onDeleteRequest={onDeleteRequest}
                onCopyLink={onCopyLink}
                onSelectTag={onSelectTag}
              />
            ))}
          </div>
        </section>

        {/* Live Web Search Results Links Box */}
        {liveWebResults.length > 0 && (
          <section className="p-3.5 sm:p-5 bg-white dark:bg-neutral-850 border-2 border-black dark:border-white/30 rounded-xl sm:rounded-2xl shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] w-full max-w-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-300 border border-black flex items-center justify-center text-black shadow-[1px_1px_0px_0px_#000] shrink-0">
                  <ListChecks className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-black dark:text-white leading-tight flex items-center gap-1.5 truncate">
                    <span className="truncate">Web Links for "{trimmedQuery}"</span>
                    {isLoadingSearch && (
                      <Loader2 className="w-3 h-3 animate-spin text-indigo-600 shrink-0" />
                    )}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                    Click to test or click <strong>＋ Add</strong> to save
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAllWebResults(!showAllWebResults)}
                className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer shrink-0 ml-2"
              >
                {showAllWebResults ? 'Hide' : `Show (${liveWebResults.length})`}
              </button>
            </div>

            {showAllWebResults && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                {liveWebResults.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 sm:p-3 bg-slate-50 dark:bg-neutral-800 border-2 border-black dark:border-white/30 rounded-xl flex items-start justify-between gap-2.5 shadow-[2px_2px_0px_0px_#000] hover:bg-amber-50 dark:hover:bg-neutral-750 transition-colors"
                  >
                    <div className="flex items-start gap-2 overflow-hidden min-w-0 flex-1">
                      <WebsiteLogo
                        domain={res.domain}
                        url={res.url}
                        name={res.title}
                        favicon={res.favicon}
                        iconBg={res.iconBg}
                        iconColor={res.iconColor}
                        initials={res.initials}
                        size="sm"
                        className="shrink-0 mt-0.5"
                      />
                      <div className="overflow-hidden min-w-0 flex-1">
                        <p className="text-xs font-black text-black dark:text-white truncate">
                          {res.title}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-neutral-400 font-mono truncate">
                          {res.domain}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 self-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (onDirectLaunch) {
                            onDirectLaunch(res.url);
                          } else {
                            window.open(res.url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        className="p-1.5 rounded-lg bg-white dark:bg-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-black dark:border-white/30 transition-colors cursor-pointer"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={isInstantAdding}
                        onClick={() => handleQuickAdd(res.url)}
                        className="px-2 py-1 text-[11px] font-black bg-amber-300 hover:bg-amber-400 text-black border border-black rounded-lg shadow-[1px_1px_0px_0px_#000] flex items-center gap-1 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                        title="Save to your bookmarks"
                      >
                        <Plus className="w-3 h-3 stroke-[3]" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    );
  }

  // Custom Named List View
  if (activeFilter === 'collection' && activeCollection) {
    const colColor = getCollectionColor(activeCollection.color);

    if (filteredBookmarks.length === 0) {
      return (
        <EmptyState
          type="no-collection-items"
          collection={activeCollection}
          onAction={onAddNew}
        />
      );
    }

    return (
      <div className="space-y-5 sm:space-y-8 w-full max-w-full">
        {/* Custom List Banner Header */}
        <div
          className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-black ${colColor.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[3px_3px_0px_0px_#000] w-full max-w-full`}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${colColor.badgeBg} border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_#000] shrink-0`}
            >
              {renderCollectionIcon(activeCollection.icon, 'w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]')}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-black text-black dark:text-white leading-tight truncate">
                  {activeCollection.name}
                </h2>
                <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full border border-black bg-white dark:bg-neutral-800 text-black dark:text-white shadow-[1px_1px_0px_0px_#000]">
                  {filteredBookmarks.length} items
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-700 dark:text-neutral-300 mt-0.5 truncate">
                {activeCollection.description || 'Custom named list for quick launch access.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            {onEditCollection && (
              <button
                type="button"
                onClick={() => onEditCollection(activeCollection)}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-black bg-white dark:bg-neutral-800 text-black dark:text-white border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 dark:hover:bg-neutral-700 flex items-center gap-1 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Edit List</span>
              </button>
            )}
            <button
              type="button"
              onClick={onAddNew}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-black bg-amber-300 hover:bg-amber-400 text-black border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] flex items-center gap-1 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Bookmarks Grid in this Custom List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-4 md:gap-5 w-full">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              collections={collections}
              onLaunch={onLaunch}
              onToggleFavorite={onToggleFavorite}
              onToggleCollection={onToggleCollection}
              onEdit={onEdit}
              onDeleteRequest={onDeleteRequest}
              onCopyLink={onCopyLink}
              onSelectTag={onSelectTag}
            />
          ))}
        </div>
      </div>
    );
  }

  // Favorites Only Tab
  if (activeFilter === 'favorites') {
    if (favorites.length === 0) {
      return <EmptyState type="no-favorites" onAction={onAddNew} />;
    }

    return (
      <div className="space-y-5 sm:space-y-8 w-full max-w-full">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm sm:text-lg tracking-tight flex items-center gap-1.5 sm:gap-2 text-black dark:text-white">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-rose-500 text-rose-500 stroke-[2.5]" />
            <span>Favorites</span>
          </h3>
          <span className="font-black text-[11px] sm:text-xs bg-rose-400 text-black border-2 border-black px-2 sm:px-2.5 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_0px_#000]">
            {favorites.length} Pinned
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-4 md:gap-5 w-full">
          {favorites.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              collections={collections}
              onLaunch={onLaunch}
              onToggleFavorite={onToggleFavorite}
              onToggleCollection={onToggleCollection}
              onEdit={onEdit}
              onDeleteRequest={onDeleteRequest}
              onCopyLink={onCopyLink}
              onSelectTag={onSelectTag}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default Standard View: Favorites on Top, All Bookmarks below
  return (
    <div className="space-y-6 sm:space-y-10 w-full max-w-full">
      {/* 1. Favorites Section */}
      <section className="w-full max-w-full">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="font-black text-sm sm:text-lg tracking-tight flex items-center gap-1.5 sm:gap-2 text-black dark:text-white">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 stroke-[2.5]" />
            <span>Favorites</span>
          </h3>
          {favorites.length > 0 && (
            <span className="font-black text-[11px] sm:text-xs bg-rose-400 text-black border-2 border-black px-2 sm:px-2.5 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_0px_#000]">
              {favorites.length} Pinned
            </span>
          )}
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-4 md:gap-5 w-full">
            {favorites.map((bookmark) => (
              <BookmarkCard
                key={`fav-${bookmark.id}`}
                bookmark={bookmark}
                collections={collections}
                onLaunch={onLaunch}
                onToggleFavorite={onToggleFavorite}
                onToggleCollection={onToggleCollection}
                onEdit={onEdit}
                onDeleteRequest={onDeleteRequest}
                onCopyLink={onCopyLink}
                onSelectTag={onSelectTag}
              />
            ))}
          </div>
        ) : (
          <div className="p-3.5 sm:p-5 bg-white dark:bg-neutral-800/80 border-2 border-dashed border-black/30 dark:border-white/20 rounded-xl sm:rounded-2xl text-center">
            <p className="text-xs font-bold text-slate-500 dark:text-neutral-400">
              No favorites pinned yet. Click the <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-rose-500" /> heart icon on any card to pin it here.
            </p>
          </div>
        )}
      </section>

      {/* 2. All Bookmarks Section */}
      <section className="w-full max-w-full">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="font-black text-sm sm:text-lg tracking-tight flex items-center gap-1.5 sm:gap-2 text-black dark:text-white">
            <Grid className="w-4 h-4 text-black dark:text-white" />
            <span>All Bookmarks</span>
          </h3>
          <span className="font-black text-[11px] sm:text-xs bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white border-2 border-black dark:border-white/30 px-2 sm:px-2.5 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#FFF]">
            {filteredBookmarks.length} Total
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-4 md:gap-5 w-full">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              collections={collections}
              onLaunch={onLaunch}
              onToggleFavorite={onToggleFavorite}
              onToggleCollection={onToggleCollection}
              onEdit={onEdit}
              onDeleteRequest={onDeleteRequest}
              onCopyLink={onCopyLink}
              onSelectTag={onSelectTag}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
