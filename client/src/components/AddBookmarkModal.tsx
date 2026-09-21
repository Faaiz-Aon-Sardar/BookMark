import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Search,
  Globe,
  Tag,
  Heart,
  Plus,
  ExternalLink,
  Loader2,
  Sparkles,
  Check,
  FolderPlus,
  RefreshCw,
  Zap,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { Bookmark, CustomCollection } from '../types/bookmark';
import {
  extractDomain,
  isValidUrl,
  areUrlsEqual,
  formatUrlForInput,
} from '../utils/urlUtils';
import {
  WebSearchResult,
  fetchWebSearchResults,
} from '../services/webSearchService';
import { getFaviconUrl } from '../utils/faviconUtils';
import { WebsiteLogo } from './WebsiteLogo';
import { SearchResultItem } from './SearchResultItem';
import { getCollectionColor, renderCollectionIcon } from '../utils/collectionUtils';

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
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
  initialSearchQuery?: string;
}

type SearchStatus = 'idle' | 'loading' | 'results' | 'no-results' | 'error';

const SEARCH_EXAMPLES = [
  'Grok',
  'Figma',
  'Notion',
  'GitHub',
  'Google Drive',
  'Canva',
  'ChatGPT',
  'Linear',
  'Spotify',
  'Bollyflix',
];

export const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingBookmarks,
  collections = [],
  onCreateCollection,
  initialSearchQuery = '',
}) => {
  // Search state
  const [searchInput, setSearchInput] = useState<string>('');
  const [lastSubmittedQuery, setLastSubmittedQuery] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle');
  const [searchResults, setSearchResults] = useState<WebSearchResult[]>([]);
  const [selectedResultUrl, setSelectedResultUrl] = useState<string | null>(null);

  // Step 2 Form States
  const [customName, setCustomName] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [customFavicon, setCustomFavicon] = useState<string | undefined>(undefined);
  const [customIconBg, setCustomIconBg] = useState<string | undefined>(undefined);
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [formErrorMsg, setFormErrorMsg] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Common tags gathered from user's current bookmarks
  const existingTags = useMemo(() => {
    const set = new Set<string>();
    existingBookmarks.forEach((b) => {
      b.tags?.forEach((t) => set.add(t));
    });
    const defaults = [
      'AI & Tools',
      'Development',
      'Design',
      'Productivity',
      'Media',
      'Social',
      'Learning',
      'Finance',
    ];
    defaults.forEach((d) => set.add(d));
    return Array.from(set);
  }, [existingBookmarks]);

  // Execute Web Search via server-side API proxy
  const handleExecuteSearch = async (queryToSearch: string) => {
    const cleanQuery = queryToSearch.trim();
    if (!cleanQuery) {
      setFormErrorMsg('Please enter a word or website to search.');
      return;
    }

    if (searchStatus === 'loading') {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setSearchStatus('loading');
    setLastSubmittedQuery(cleanQuery);
    setFormErrorMsg(null);

    try {
      const results = await fetchWebSearchResults(cleanQuery, abortControllerRef.current.signal);
      if (results && results.length > 0) {
        setSearchResults(results);
        setSearchStatus('results');
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      } else {
        setSearchResults([]);
        setSearchStatus('no-results');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setSearchResults([]);
      setSearchStatus('error');
    }
  };

  // Handle modal open initialization
  useEffect(() => {
    if (isOpen) {
      setSearchInput(initialSearchQuery);
      setLastSubmittedQuery('');
      setCustomName('');
      setCustomUrl('');
      setCustomFavicon(undefined);
      setCustomIconBg(undefined);
      setTags([]);
      setSelectedCollections([]);
      setIsFavorite(false);
      setDuplicateWarning(null);
      setFormErrorMsg(null);
      setSearchResults([]);
      setSelectedResultUrl(null);
      setSearchStatus('idle');

      if (initialSearchQuery && initialSearchQuery.trim()) {
        handleExecuteSearch(initialSearchQuery.trim());
      }

      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 80);
    } else {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, [isOpen, initialSearchQuery]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Real-time URL duplicate checker for Step 2
  useEffect(() => {
    if (!customUrl.trim()) {
      setDuplicateWarning(null);
      return;
    }
    const formatted = formatUrlForInput(customUrl);
    const existing = existingBookmarks.find((b) => areUrlsEqual(b.url, formatted));
    if (existing) {
      setDuplicateWarning(`"${existing.name}" is already in your launcher.`);
    } else {
      setDuplicateWarning(null);
    }
  }, [customUrl, existingBookmarks]);

  // Update favicon preview whenever customUrl is changed
  useEffect(() => {
    if (customUrl.trim() && isValidUrl(customUrl)) {
      const domain = extractDomain(customUrl);
      if (!customFavicon || customFavicon.includes('google.com/s2')) {
        setCustomFavicon(getFaviconUrl(customUrl, domain));
      }
    }
  }, [customUrl]);

  if (!isOpen) return null;

  // Click on "Customize" / "Select" in a search result item
  const handleSelectResult = (result: WebSearchResult) => {
    setSelectedResultUrl(result.url);
    setCustomUrl(result.url);
    setCustomName(result.title);
    setCustomFavicon(result.favicon || getFaviconUrl(result.url, result.domain));
    setCustomIconBg(result.iconBg);
    if (result.category && !tags.includes(result.category)) {
      setTags((prev) => [...prev, result.category!]);
    }
    setFormErrorMsg(null);

    // Scroll smoothly to Step 2 Customize Details
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      urlInputRef.current?.focus();
    }, 100);
  };

  // Click on "+ Bookmark Domain" button (instant add)
  const handleAddResultDirectly = (result: WebSearchResult) => {
    const targetUrl = result.url;
    const targetName = result.title || extractDomain(targetUrl) || 'Website';
    const targetTags = tags.length > 0 ? tags : (result.category ? [result.category] : undefined);
    const targetFavicon = result.favicon || getFaviconUrl(targetUrl, result.domain);

    const outcome = onAdd({
      name: targetName,
      url: targetUrl,
      customIconBg: result.iconBg,
      tags: targetTags,
      isFavorite,
      favicon: targetFavicon,
      collections: selectedCollections,
    });

    if (outcome.success) {
      onClose();
    } else {
      setFormErrorMsg(outcome.error || 'Failed to add bookmark');
    }
  };

  // Tag toggling
  const toggleTag = (tagName: string) => {
    const clean = tagName.trim().replace(/^#/, '');
    if (!clean) return;
    if (tags.includes(clean)) {
      setTags(tags.filter((t) => t !== clean));
    } else {
      setTags([...tags, clean]);
    }
  };

  const handleAddCustomTag = (e?: React.FormEvent) => {
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

  // Collection selection
  const toggleCollectionSelection = (collectionId: string) => {
    if (selectedCollections.includes(collectionId)) {
      setSelectedCollections(selectedCollections.filter((id) => id !== collectionId));
    } else {
      setSelectedCollections([...selectedCollections, collectionId]);
    }
  };

  // Submit Step 2 form
  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormErrorMsg(null);

    let targetUrl = customUrl.trim();
    let targetName = customName.trim();

    if (!targetUrl) {
      setFormErrorMsg('Please search and select a website or enter a website URL.');
      return;
    }

    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    if (!isValidUrl(targetUrl)) {
      setFormErrorMsg('Please enter a valid website URL (e.g. https://example.com).');
      return;
    }

    const domain = extractDomain(targetUrl);
    if (!targetName) {
      targetName = domain || 'Website';
    }

    const resolvedFavicon = customFavicon || getFaviconUrl(targetUrl, domain);

    const outcome = onAdd({
      name: targetName,
      url: targetUrl,
      customIconBg,
      tags: tags.length > 0 ? tags : undefined,
      isFavorite,
      favicon: resolvedFavicon,
      collections: selectedCollections,
    });

    if (outcome.success) {
      onClose();
    } else {
      setFormErrorMsg(outcome.error || 'Failed to add bookmark');
    }
  };

  const previewDomain = extractDomain(customUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-[#FAF8F5] dark:bg-neutral-900 border-3 sm:border-4 border-black dark:border-white w-full max-w-2xl rounded-2xl shadow-[6px_6px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#FFF] sm:dark:shadow-[8px_8px_0px_0px_#FFF] overflow-hidden flex flex-col max-h-[94dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b-2 sm:border-b-3 border-black dark:border-white/40 flex items-center justify-between bg-amber-300 dark:bg-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black text-amber-300 dark:bg-white dark:text-black flex items-center justify-center border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] shrink-0">
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
            </div>
            <div className="truncate min-w-0">
              <h2 id="modal-title" className="text-sm sm:text-base md:text-lg font-black text-black dark:text-white leading-tight truncate">
                Add Bookmark
              </h2>
              <p className="text-[11px] sm:text-xs font-bold text-black/80 dark:text-white/80 truncate">
                Search Google for any website domain &amp; auto-link its authentic logo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white border-2 border-black dark:border-white flex items-center justify-center shadow-[2px_2px_0px_0px_#000] transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0 overscroll-contain">
          <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-5 flex-1">
            {/* Form Error Alert */}
            {formErrorMsg && (
              <div className="p-3 bg-rose-100 dark:bg-rose-950/80 border-2 border-black dark:border-rose-500 rounded-xl text-xs font-black text-rose-900 dark:text-rose-200 flex items-center justify-between shadow-[2px_2px_0px_0px_#000]">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formErrorMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormErrorMsg(null)}
                  className="text-rose-900 dark:text-rose-200 hover:opacity-75 p-1"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            )}

            {/* Duplicate Notice */}
            {duplicateWarning && (
              <div className="p-2.5 bg-amber-100 dark:bg-amber-950/80 border-2 border-black dark:border-amber-500 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
                <span>⚠️ Note: {duplicateWarning}</span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 1: FIND WEBSITE VIA GOOGLE / WEB SEARCH                              */}
            {/* ========================================================================= */}
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="website-search-input"
                  className="text-xs font-black text-black dark:text-white uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                  <span>Step 1 — Find Website</span>
                </label>
                <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400">
                  Google Search Links
                </span>
              </div>

              {/* Search Form Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleExecuteSearch(searchInput);
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1 min-w-0">
                  <input
                    ref={searchInputRef}
                    id="website-search-input"
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search the web for a website..."
                    className="w-full h-11 pl-9 sm:pl-10 pr-9 rounded-xl border-2 sm:border-3 border-black dark:border-white/40 bg-white dark:bg-neutral-800 font-bold text-xs sm:text-sm text-black dark:text-white focus:outline-none focus:shadow-[3px_3px_0px_0px_#6366F1] shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] transition-all"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500 stroke-[2.5]" />

                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput('');
                        searchInputRef.current?.focus();
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-black dark:hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4 stroke-[3]" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={searchStatus === 'loading' || !searchInput.trim()}
                  className="px-3.5 sm:px-5 h-11 rounded-xl bg-amber-300 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed font-black text-xs sm:text-sm text-black border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {searchStatus === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                      <span className="hidden sm:inline">Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 stroke-[2.5]" />
                      <span>Search Web</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Suggestion Pills */}
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="text-[11px] font-black text-slate-500 dark:text-neutral-400 shrink-0 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Examples:</span>
                </span>
                {SEARCH_EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      setSearchInput(example);
                      handleExecuteSearch(example);
                    }}
                    className="text-[11px] px-2 py-0.5 rounded-lg font-black bg-white dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-neutral-700 text-black dark:text-white border-2 border-black dark:border-white/30 shadow-[1px_1px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{example}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SEARCH RESULTS / STATES                                                   */}
            {/* ========================================================================= */}
            <div ref={resultsRef}>
              {/* Idle State */}
              {searchStatus === 'idle' && (
                <div className="p-4 sm:p-5 bg-white dark:bg-neutral-800 border-2 border-dashed border-black/30 dark:border-white/30 rounded-xl text-center space-y-1.5">
                  <HelpCircle className="w-6 h-6 mx-auto text-slate-400 dark:text-neutral-500" />
                  <p className="text-xs font-black text-black dark:text-white">
                    Search the web to find website link domains to bookmark.
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-neutral-400">
                    Type any website name, service, or keyword above and click Search Web.
                  </p>
                </div>
              )}

              {/* Loading State */}
              {searchStatus === 'loading' && (
                <div className="p-5 sm:p-6 bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/30 rounded-xl flex flex-col items-center justify-center gap-2 shadow-[2px_2px_0px_0px_#000]">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                  <span className="text-xs font-black text-black dark:text-white">
                    Searching Google for &ldquo;{lastSubmittedQuery}&rdquo;...
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 text-center">
                    Fetching link domains and official website logos
                  </span>
                </div>
              )}

              {/* No Results State */}
              {searchStatus === 'no-results' && (
                <div className="p-4 sm:p-5 bg-white dark:bg-neutral-800 border-2 border-black dark:border-white/30 rounded-xl text-center space-y-2 shadow-[2px_2px_0px_0px_#000]">
                  <p className="text-xs font-black text-black dark:text-white">
                    No websites found for &ldquo;{lastSubmittedQuery}&rdquo;.
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-neutral-400">
                    Try checking for typos or enter the URL directly in Step 2 below.
                  </p>
                </div>
              )}

              {/* Error State */}
              {searchStatus === 'error' && (
                <div className="p-4 sm:p-5 bg-rose-50 dark:bg-rose-950/60 border-2 border-black dark:border-rose-500 rounded-xl text-center space-y-2 shadow-[2px_2px_0px_0px_#000]">
                  <p className="text-xs font-black text-rose-900 dark:text-rose-200">
                    We couldn&apos;t search the web right now. Please try again.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleExecuteSearch(lastSubmittedQuery || searchInput)}
                    className="px-4 py-1.5 text-xs font-black bg-rose-600 hover:bg-rose-700 text-white rounded-lg border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Search</span>
                  </button>
                </div>
              )}

              {/* Results List */}
              {searchStatus === 'results' && searchResults.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black dark:text-white flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                      <span>Google Search Results ({searchResults.length})</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 hidden sm:inline">
                      Click &ldquo;+ Bookmark Domain&rdquo; or &ldquo;Customize&rdquo;
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-72 sm:max-h-80 overflow-y-auto pr-1">
                    {searchResults.map((res) => (
                      <SearchResultItem
                        key={res.url}
                        result={res}
                        isSelected={selectedResultUrl === res.url || customUrl === res.url}
                        onSelect={handleSelectResult}
                        onAdd={handleAddResultDirectly}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* STEP 2: CUSTOMIZE DETAILS                                                 */}
            {/* ========================================================================= */}
            <div
              ref={step2Ref}
              className="space-y-3.5 sm:space-y-4 pt-3.5 sm:pt-4 border-t-2 border-dashed border-slate-300 dark:border-neutral-700"
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-black dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 stroke-[2.5]" />
                  <span>Step 2 — Customize Details</span>
                </label>
                {customUrl && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Logo Linked</span>
                  </span>
                )}
              </div>

              {/* Live Preview Box */}
              {customUrl ? (
                <div className="p-3 sm:p-3.5 bg-indigo-50/90 dark:bg-neutral-800 border-2 border-black dark:border-white/30 rounded-xl flex items-center justify-between gap-3 shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden min-w-0">
                    <WebsiteLogo
                      domain={previewDomain}
                      url={customUrl}
                      name={customName}
                      favicon={customFavicon}
                      iconBg={customIconBg}
                      size="md"
                    />
                    <div className="truncate min-w-0">
                      <p className="text-xs sm:text-sm font-black text-black dark:text-white truncate">
                        {customName || previewDomain || 'New Bookmark'}
                      </p>
                      <a
                        href={customUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-700 dark:text-indigo-300 hover:underline font-mono truncate flex items-center gap-1"
                      >
                        <span className="truncate">{customUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>

                  <a
                    href={customUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 sm:px-3 py-1.5 text-xs font-bold bg-white dark:bg-neutral-700 border-2 border-black rounded-lg shrink-0 flex items-center gap-1 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#000]"
                  >
                    <span>Test</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : null}

              {/* URL & Name Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Website URL */}
                <div>
                  <label
                    htmlFor="custom-url-field"
                    className="block text-[11px] font-black text-black dark:text-neutral-300 mb-1 flex items-center gap-1"
                  >
                    <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Website URL *</span>
                  </label>
                  <input
                    ref={urlInputRef}
                    id="custom-url-field"
                    type="text"
                    value={customUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomUrl(val);
                      if (formErrorMsg) setFormErrorMsg(null);
                    }}
                    placeholder="https://example.com"
                    className="w-full h-10 px-3 rounded-xl border-2 border-black dark:border-white/30 bg-white dark:bg-neutral-800 font-bold text-xs text-black dark:text-white focus:outline-none focus:shadow-[2px_2px_0px_0px_#6366F1] shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#FFF]"
                  />
                </div>

                {/* Display Name */}
                <div>
                  <label
                    htmlFor="custom-name-field"
                    className="block text-[11px] font-black text-black dark:text-neutral-300 mb-1 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Display Name</span>
                  </label>
                  <input
                    id="custom-name-field"
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Grok or Figma"
                    className="w-full h-10 px-3 rounded-xl border-2 border-black dark:border-white/30 bg-white dark:bg-neutral-800 font-bold text-xs text-black dark:text-white focus:outline-none focus:shadow-[2px_2px_0px_0px_#6366F1] shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#FFF]"
                  />
                </div>
              </div>

              {/* Custom Named Lists / Collections */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-black text-black dark:text-neutral-300 flex items-center gap-1">
                    <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
                    <span>Add to Custom Lists</span>
                  </label>
                  {onCreateCollection && (
                    <button
                      type="button"
                      onClick={onCreateCollection}
                      className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                      <span>Create New List</span>
                    </button>
                  )}
                </div>

                {collections.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {collections.map((col) => {
                      const isSelected = selectedCollections.includes(col.id);
                      const colColor = getCollectionColor(col.color);
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => toggleCollectionSelection(col.id)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-black border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
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
                ) : (
                  <p className="text-xs font-bold text-slate-500">
                    No custom lists created yet. You can create lists anytime from the sidebar.
                  </p>
                )}
              </div>

              {/* Tags & Categories */}
              <div>
                <label
                  htmlFor="custom-tag-field"
                  className="block text-[11px] font-black text-black dark:text-neutral-300 mb-1 flex items-center gap-1"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Tags & Categories</span>
                </label>

                {/* Tag Input */}
                <div className="flex gap-2 mb-1.5">
                  <input
                    id="custom-tag-field"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                    placeholder="Type custom tag (e.g. AI, Dev, Movies)..."
                    className="flex-1 h-9 px-3 rounded-xl border-2 border-black dark:border-white/30 bg-white dark:bg-neutral-800 font-bold text-xs text-black dark:text-white focus:outline-none focus:shadow-[2px_2px_0px_0px_#6366F1] shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#FFF]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCustomTag()}
                    className="px-3.5 h-9 rounded-xl border-2 border-black dark:border-white/30 bg-amber-300 hover:bg-amber-400 font-black text-xs text-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0"
                  >
                    Add Tag
                  </button>
                </div>

                {/* Active Tags */}
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
                          aria-label={`Remove tag ${t}`}
                          className="hover:text-rose-400 dark:hover:text-rose-600 cursor-pointer p-0.5"
                        >
                          <X className="w-3 h-3 stroke-[3]" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Tag Quick Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 no-scrollbar scroll-smooth">
                  {existingTags.map((cat) => {
                    const isTagSelected = tags.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleTag(cat)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-black whitespace-nowrap border-2 transition-all shrink-0 cursor-pointer ${
                          isTagSelected
                            ? 'bg-indigo-600 text-white border-black shadow-[1.5px_1.5px_0px_0px_#000]'
                            : 'bg-white dark:bg-neutral-800 text-black dark:text-white border-black/40 dark:border-white/30 hover:bg-amber-100 dark:hover:bg-neutral-700 shadow-[1px_1px_0px_0px_#000]'
                        }`}
                      >
                        {isTagSelected ? `✓ #${cat}` : `+ #${cat}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pin to Favorites Bar */}
              <div
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2.5 rounded-xl border-2 border-black dark:border-white/30 flex items-center justify-between cursor-pointer transition-all ${
                  isFavorite
                    ? 'bg-rose-100 dark:bg-rose-950/60 shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-slate-50 dark:bg-neutral-800/60 hover:bg-slate-100 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-md border-2 border-black flex items-center justify-center ${
                      isFavorite ? 'bg-rose-500 text-white' : 'bg-white'
                    }`}
                  >
                    {isFavorite && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-black text-black dark:text-white flex items-center gap-1">
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                      }`}
                    />
                    <span>Pin to Favorites bar</span>
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-neutral-400">
                  {isFavorite ? 'Pinned' : 'Optional'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-3.5 sm:px-6 py-3 sm:py-3.5 border-t-2 border-black dark:border-white/30 bg-slate-50 dark:bg-neutral-800/80 flex items-center justify-between gap-2 shrink-0">
            <div className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 hidden sm:block truncate">
              {customUrl
                ? `Ready to save: ${extractDomain(customUrl)}`
                : 'Search the web in Step 1 or enter details in Step 2'}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 sm:px-4 py-2 rounded-xl border-2 border-black dark:border-white/30 bg-white dark:bg-neutral-800 hover:bg-slate-100 font-black text-xs text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFormSubmit}
                className="px-4 sm:px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 border-2 border-black shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Save Bookmark &amp; Go</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
