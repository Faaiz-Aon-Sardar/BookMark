import React, { useRef, useEffect, useState } from 'react';
import { Search, X, Command, ExternalLink, ChevronDown } from 'lucide-react';
import { SEARCH_ENGINES, SearchEngine } from '../services/webSearchService';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit?: (query: string, engine?: SearchEngine) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = 'Search bookmarks, type URL, or web query...',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>('google');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Global Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      handleLaunchSearchEngine();
    }
  };

  const handleLaunchSearchEngine = () => {
    const q = value.trim();
    if (!q) return;

    if (onSubmit) {
      onSubmit(q, selectedEngine);
    } else {
      const eng = SEARCH_ENGINES.find((s) => s.id === selectedEngine) || SEARCH_ENGINES[0];
      window.open(eng.urlTemplate(q), '_blank', 'noopener,noreferrer');
    }
  };

  const currentEngineObj = SEARCH_ENGINES.find((e) => e.id === selectedEngine) || SEARCH_ENGINES[0];

  return (
    <div className="w-full max-w-full min-w-0 flex items-center gap-1.5 sm:gap-2.5 relative z-40" ref={dropdownRef}>
      {/* Search Engine Selector Dropdown Pill */}
      <div className="relative shrink-0 z-50">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          title={`Search Engine: ${currentEngineObj.name} (Click to switch engine)`}
          className="h-10 sm:h-12 px-2 sm:px-3 rounded-xl sm:rounded-2xl bg-amber-300 hover:bg-amber-400 dark:bg-amber-400 dark:hover:bg-amber-300 text-black font-black text-xs flex items-center gap-1 sm:gap-1.5 border-2 border-black dark:border-white/30 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer select-none shrink-0"
        >
          <span className="text-xs font-black">{currentEngineObj.icon}</span>
          <span className="hidden sm:inline text-xs font-black">{currentEngineObj.name}</span>
          <ChevronDown
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3] transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180 text-indigo-700' : ''
            }`}
          />
        </button>

        {/* Floating Dropdown Menu with solid opaque background and highest z-index */}
        {isDropdownOpen && (
          <div
            className="absolute left-0 top-full mt-2 w-52 sm:w-56 bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/40 rounded-2xl shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#FFF] z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            role="menu"
          >
            <div className="px-3.5 py-1.5 text-[10px] font-black text-slate-500 dark:text-neutral-400 uppercase tracking-wider border-b border-black/10 dark:border-white/10">
              Select Search Engine
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {SEARCH_ENGINES.map((engine) => {
                const isSelected = selectedEngine === engine.id;
                return (
                  <button
                    key={engine.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setSelectedEngine(engine.id);
                      setIsDropdownOpen(false);
                      inputRef.current?.focus();
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-300 dark:bg-amber-400 text-black font-black'
                        : 'hover:bg-slate-100 dark:hover:bg-neutral-800 text-black dark:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="font-black text-xs">{engine.icon}</span>
                      <span>{engine.name}</span>
                    </span>
                    {isSelected && (
                      <span className="font-black text-xs text-indigo-700 dark:text-black">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Search Input Container */}
      <div className="relative flex-1 min-w-0 flex items-center bg-white dark:bg-neutral-900 border-2 border-black dark:border-white/30 rounded-xl sm:rounded-2xl shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] focus-within:shadow-[3px_3px_0px_0px_#4F46E5] transition-all h-10 sm:h-12">
        <div className="pl-2.5 sm:pl-3.5 pr-1 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500 shrink-0">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        </div>

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search or enter web query"
          className="w-full min-w-0 h-full bg-transparent pl-1 pr-8 sm:pr-12 text-xs sm:text-sm font-bold text-black dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-neutral-500"
        />

        {/* Clear or Shortcut badge */}
        <div className="absolute right-2 sm:right-3 flex items-center gap-1.5 shrink-0">
          {value ? (
            <button
              onClick={onClear}
              aria-label="Clear search query"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white hover:bg-rose-500 hover:text-white flex items-center justify-center border border-black/30 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-black text-black bg-amber-200 border border-black px-1.5 py-0.5 rounded pointer-events-none shadow-[1px_1px_0px_0px_#000]">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          )}
        </div>
      </div>

      {/* Web Search Button */}
      <button
        type="button"
        onClick={handleLaunchSearchEngine}
        title={`Search on ${currentEngineObj.name} in new window`}
        className="h-10 sm:h-12 px-2.5 sm:px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl border-2 border-black dark:border-white/30 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
      >
        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        <span className="hidden md:inline">Search Web</span>
        <span className="md:hidden text-[11px] font-bold">Go</span>
      </button>
    </div>
  );
};
