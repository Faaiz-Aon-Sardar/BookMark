import React, { useState, useEffect, useRef } from 'react';
import {
  BookmarkPlus,
  Heart,
  ExternalLink,
  Loader2,
  ListChecks,
  Plus,
  FolderPlus,
} from 'lucide-react';
import { CustomCollection } from '../types/bookmark';
import { WebsiteLogo } from './WebsiteLogo';
import { getSmartWebResults, fetchAllWebSearchUrls, WebSearchResult } from '../services/webSearchService';
import { getCollectionColor, renderCollectionIcon } from '../utils/collectionUtils';

interface EmptyStateProps {
  type: 'no-bookmarks' | 'no-favorites' | 'no-search-results' | 'no-collection-items';
  searchQuery?: string;
  collection?: CustomCollection;
  onAction?: () => void;
  onClearSearch?: () => void;
  onDirectLaunch?: (url: string) => void;
  onAddWithQuery?: (query: string) => void;
  onInstantAddTopResult?: (query: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  searchQuery,
  collection,
  onAction,
  onClearSearch,
  onDirectLaunch,
  onAddWithQuery,
  onInstantAddTopResult,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [webResults, setWebResults] = useState<WebSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchTimeoutRef = useRef<any>(null);

  const query = searchQuery?.trim() || '';

  useEffect(() => {
    if (type === 'no-search-results' && query) {
      const immediate = getSmartWebResults(query);
      setWebResults(immediate);

      setIsLoading(true);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const live = await fetchAllWebSearchUrls(query);
          setWebResults(live);
        } catch {
          // fallback stays
        } finally {
          setIsLoading(false);
        }
      }, 200);
    }
  }, [type, query]);

  if (type === 'no-collection-items' && collection) {
    const colColor = getCollectionColor(collection.color);
    return (
      <div className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/30 rounded-2xl p-6 sm:p-8 text-center shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF] max-w-lg mx-auto my-4 sm:my-6">
        <div
          className={`w-14 h-14 ${colColor.badgeBg} border-2 border-black rounded-2xl mx-auto mb-3.5 flex items-center justify-center shadow-[2px_2px_0px_0px_#000]`}
        >
          {renderCollectionIcon(collection.icon, 'w-7 h-7 text-black stroke-[2.5]')}
        </div>
        <h4 className="text-base sm:text-lg font-black text-black dark:text-white mb-1">
          No websites in "{collection.name}"
        </h4>
        <p className="text-slate-600 dark:text-neutral-400 font-medium text-xs sm:text-sm leading-relaxed mb-4">
          {collection.description ||
            `Add websites to this list using the custom list selector on any card or in the Add Bookmark modal.`}
        </p>
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-1.5 bg-amber-300 hover:bg-amber-400 text-black font-black text-xs sm:text-sm py-2 px-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Bookmark to this List</span>
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-search-results') {
    const handleQuickAdd = async (urlToAdd: string) => {
      if (!onInstantAddTopResult) return;
      setIsAdding(true);
      try {
        await onInstantAddTopResult(urlToAdd);
      } finally {
        setIsAdding(false);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center py-6 sm:py-10 px-4 text-center max-w-3xl mx-auto">
        <div className="w-14 h-14 bg-amber-300 border-2 border-black dark:border-white/40 rounded-2xl flex items-center justify-center mb-3.5 text-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF]">
          <ListChecks className="w-7 h-7 stroke-[2.5]" />
        </div>

        <h4 className="text-base sm:text-lg font-black text-black dark:text-white mb-1 flex items-center justify-center gap-2">
          <span>Web Search Links for "{query}"</span>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
        </h4>
        <p className="text-slate-600 dark:text-neutral-400 font-medium text-xs sm:text-sm mb-4 leading-relaxed">
          Click any link to check if it's the website you want, or click <strong>＋ Add</strong> to save it directly:
        </p>

        {/* Display all real web search result links with logos and clickable URLs */}
        {webResults.length > 0 && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5 text-left">
            {webResults.map((res, idx) => (
              <div
                key={idx}
                className="p-3 bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/30 rounded-xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] flex items-start justify-between gap-2.5"
              >
                <div className="flex items-start gap-2.5 overflow-hidden min-w-0 flex-1">
                  <WebsiteLogo
                    domain={res.domain}
                    url={res.url}
                    name={res.title}
                    favicon={res.favicon}
                    iconBg={res.iconBg}
                    iconColor={res.iconColor}
                    initials={res.initials}
                    size="sm"
                  />
                  <div className="truncate min-w-0 flex-1">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in new tab to test website"
                      className="group/link text-xs font-black text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100 hover:underline truncate flex items-center gap-1 leading-tight"
                    >
                      <span className="truncate">{res.title}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-70 group-hover/link:opacity-100" />
                    </a>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline font-mono truncate block mt-0.5"
                    >
                      {res.url}
                    </a>
                    {res.snippet && (
                      <p className="text-[10px] text-slate-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-snug">
                        {res.snippet}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-start">
                  {onInstantAddTopResult && (
                    <button
                      onClick={() => handleQuickAdd(res.url)}
                      disabled={isAdding}
                      className="text-xs px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-lg border border-black shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {onAddWithQuery && (
            <button
              onClick={() => onAddWithQuery(query)}
              className="bg-white dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 text-black dark:text-white font-black text-xs sm:text-sm py-2 px-4 rounded-xl border-2 border-black dark:border-white/40 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Custom URL / Picker</span>
            </button>
          )}

          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="text-xs font-bold text-slate-500 hover:text-black dark:hover:text-white underline px-2 py-1 cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>
    );
  }

  if (type === 'no-favorites') {
    return (
      <div className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/30 rounded-2xl p-6 sm:p-8 text-center shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF] max-w-lg mx-auto my-4 sm:my-6">
        <div className="w-14 h-14 bg-rose-400 border-2 border-black dark:border-white/40 text-black rounded-2xl mx-auto mb-3.5 flex items-center justify-center shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF]">
          <Heart className="w-7 h-7 fill-white stroke-[2.5]" />
        </div>
        <h4 className="text-base sm:text-lg font-black text-black dark:text-white mb-1">No favorites pinned yet</h4>
        <p className="text-slate-600 dark:text-neutral-400 font-medium text-xs sm:text-sm leading-relaxed mb-4">
          Click the <Heart className="w-3.5 h-3.5 inline text-rose-500 mx-0.5 fill-rose-500" /> heart icon on any website card to pin it here for rapid access.
        </p>
      </div>
    );
  }

  // type === 'no-bookmarks'
  return (
    <div className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/30 rounded-2xl p-8 sm:p-12 text-center shadow-[5px_5px_0px_0px_#000] dark:shadow-[5px_5px_0px_0px_#FFF] max-w-lg mx-auto my-8">
      <div className="w-16 h-16 bg-amber-400 border-2 border-black dark:border-white/40 text-black rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF]">
        <BookmarkPlus className="w-8 h-8 stroke-[2.5]" />
      </div>
      <h3 className="text-lg sm:text-xl font-black text-black dark:text-white mb-1.5">No bookmarks saved yet</h3>
      <p className="text-slate-600 dark:text-neutral-400 font-medium text-xs sm:text-sm leading-relaxed mb-6">
        Start building your personal desktop launcher by adding your favorite websites, web apps, and tools.
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm py-2.5 px-6 rounded-xl border-2 border-black dark:border-white/40 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          <BookmarkPlus className="w-4 h-4 stroke-[3]" />
          <span>Add Your First Website</span>
        </button>
      )}
    </div>
  );
};
