import React from 'react';
import { ExternalLink, BookmarkPlus, SlidersHorizontal, Globe } from 'lucide-react';
import { WebSearchResult } from '../types/search';
import { WebsiteLogo } from './WebsiteLogo';

interface SearchResultItemProps {
  result: WebSearchResult;
  isSelected: boolean;
  onSelect: (result: WebSearchResult) => void;
  onAdd: (result: WebSearchResult) => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  result,
  isSelected,
  onSelect,
  onAdd,
}) => {
  return (
    <div
      className={`p-3 sm:p-4 rounded-xl border-2 sm:border-3 transition-all flex flex-col gap-2 cursor-pointer ${
        isSelected
          ? 'bg-amber-100/95 dark:bg-amber-950/80 border-black dark:border-amber-400 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF]'
          : 'bg-white dark:bg-neutral-800 border-black/80 dark:border-white/30 hover:border-black dark:hover:border-white shadow-[2px_2px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] sm:dark:shadow-[3px_3px_0px_0px_#FFF]'
      }`}
      onClick={() => onSelect(result)}
    >
      {/* Top Google-style metadata: Logo + Domain + External Visit */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-hidden min-w-0">
          <WebsiteLogo
            domain={result.domain}
            url={result.url}
            name={result.title}
            favicon={result.favicon}
            iconBg={result.iconBg}
            iconColor={result.iconColor}
            initials={result.initials}
            size="sm"
          />
          <div className="flex items-center gap-1 overflow-hidden text-xs min-w-0">
            <span className="font-black text-slate-900 dark:text-white truncate">
              {result.domain}
            </span>
            <span className="text-slate-400 dark:text-neutral-500 font-mono hidden xs:inline">›</span>
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 truncate hidden xs:inline">
              {result.url.replace(/^https?:\/\//, '')}
            </span>
          </div>
        </div>

        {/* External test link badge */}
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title="Open website in new tab"
          className="text-[11px] font-bold text-slate-600 dark:text-neutral-300 hover:text-black dark:hover:text-white flex items-center gap-1 shrink-0 bg-slate-100 dark:bg-neutral-700 px-2 py-0.5 rounded-md border border-black/20 hover:border-black"
        >
          <span>Open</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Main Title (Google Search Style link) */}
      <div>
        <h3 className="text-xs sm:text-sm md:text-base font-black text-indigo-700 dark:text-indigo-400 hover:underline leading-snug break-words">
          {result.title}
        </h3>
      </div>

      {/* Snippet / Description */}
      {result.description && (
        <p className="text-[11px] sm:text-xs text-slate-600 dark:text-neutral-300 line-clamp-2 leading-relaxed font-medium">
          {result.description}
        </p>
      )}

      {/* Action Bar */}
      <div className="pt-2 mt-0.5 border-t border-dashed border-slate-200 dark:border-neutral-700 flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-neutral-400 flex items-center gap-1 truncate max-w-[140px] sm:max-w-none">
          <Globe className="w-3 h-3 text-indigo-500 shrink-0" />
          <span className="truncate">{result.domain}</span>
        </span>

        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          {/* Customize / Edit details button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(result);
            }}
            title="Customize details before saving"
            className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg font-bold border-2 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              isSelected
                ? 'bg-black text-white dark:bg-white dark:text-black border-black shadow-[1.5px_1.5px_0px_0px_#000]'
                : 'bg-white dark:bg-neutral-700 text-black dark:text-white border-black/50 dark:border-white/40 hover:bg-slate-100 dark:hover:bg-neutral-600 shadow-[1.5px_1.5px_0px_0px_#000]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isSelected ? 'Selected' : 'Customize'}</span>
          </button>

          {/* Direct + Bookmark button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(result);
            }}
            title="Instantly add this website link domain as a bookmark"
            className="text-xs px-3 sm:px-4 py-1.5 rounded-lg font-black bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <BookmarkPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Bookmark</span>
          </button>
        </div>
      </div>
    </div>
  );
};
