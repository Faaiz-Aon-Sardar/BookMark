import { extractDomain, deriveTitleFromDomain, isValidUrl } from '../utils/urlUtils';
import { getInitialColor, getInitials, getFaviconUrl } from '../utils/faviconUtils';
import { WebSearchResult, SearchApiResponse } from '../types/search';

export type { WebSearchResult, SearchApiResponse };

// Search engine definitions for browser searches
export type SearchEngine = 'google' | 'duckduckgo' | 'bing' | 'perplexity' | 'youtube' | 'scholar';

export const SEARCH_ENGINES: {
  id: SearchEngine;
  name: string;
  icon: string;
  urlTemplate: (q: string) => string;
  color: string;
}[] = [
  {
    id: 'google',
    name: 'Google Search',
    icon: 'G',
    urlTemplate: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    color: '#4285F4',
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    icon: '🦆',
    urlTemplate: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
    color: '#DE5833',
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    icon: 'PX',
    urlTemplate: (q) => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}`,
    color: '#6366F1',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'YT',
    urlTemplate: (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
    color: '#FF0000',
  },
  {
    id: 'scholar',
    name: 'Google Scholar',
    icon: '🎓',
    urlTemplate: (q) => `https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`,
    color: '#2563EB',
  },
];

// In-memory cache for fast repeat searches in the same session
const searchCache = new Map<string, WebSearchResult[]>();

/**
 * Filter to exclude Wikipedia / encyclopedia links from bookmark suggestions
 */
export function isExcludedDomain(urlOrDomain: string): boolean {
  const lower = urlOrDomain.toLowerCase();
  return (
    lower.includes('wikipedia.org') ||
    lower.includes('wikimedia.org') ||
    lower.includes('wiktionary.org')
  );
}

/**
 * Executes a real web search via the server-side proxy (/api/search).
 * Returns normalized web search results from Serper.dev, Brave Search, or search provider.
 * Does NOT use hardcoded search lists.
 */
export async function performWebSearch(
  query: string,
  signal?: AbortSignal
): Promise<WebSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const lowerQ = trimmed.toLowerCase();
  if (searchCache.has(lowerQ)) {
    return searchCache.get(lowerQ)!;
  }

  const results: WebSearchResult[] = [];

  // If user typed a direct URL or domain (e.g. "github.com" or "https://figma.com")
  const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i;
  if (domainPattern.test(trimmed) || /^https?:\/\//i.test(trimmed)) {
    const formattedUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const domain = extractDomain(formattedUrl);
    const title = deriveTitleFromDomain(domain);
    if (domain && !isExcludedDomain(domain)) {
      results.push({
        title,
        url: formattedUrl,
        domain,
        description: `Direct destination website for ${domain}`,
        favicon: getFaviconUrl(formattedUrl, domain),
        iconBg: getInitialColor(domain),
        iconColor: '#000000',
        initials: getInitials(title, domain),
      });
    }
  }

  // Fetch live web search results from server /api/search proxy
  const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal });
  if (!response.ok) {
    throw new Error(`Search request failed with status: ${response.status}`);
  }

  const data: SearchApiResponse = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }

  if (data.results && Array.isArray(data.results)) {
    data.results.forEach((item) => {
      if (item.url && isValidUrl(item.url) && !isExcludedDomain(item.url)) {
        const domain = item.domain || extractDomain(item.url);
        if (domain && !isExcludedDomain(domain) && !results.some((r) => r.url === item.url)) {
          const itemTitle = item.title || deriveTitleFromDomain(domain);
          results.push({
            title: itemTitle,
            url: item.url,
            domain,
            description: item.description || item.snippet || `Official website for ${itemTitle}`,
            snippet: item.snippet || item.description,
            favicon: item.favicon || getFaviconUrl(item.url, domain),
            category: item.category,
            iconBg: item.iconBg || getInitialColor(domain),
            iconColor: item.iconColor || '#000000',
            initials: item.initials || getInitials(itemTitle, domain),
          });
        }
      }
    });
  }

  // Cache results for session
  if (results.length > 0) {
    searchCache.set(lowerQ, results);
  }

  return results;
}

/**
 * Backward compatibility alias for performWebSearch
 */
export async function fetchWebSearchResults(
  query: string,
  signal?: AbortSignal
): Promise<WebSearchResult[]> {
  return performWebSearch(query, signal);
}

export async function fetchAllWebSearchUrls(query: string): Promise<WebSearchResult[]> {
  return performWebSearch(query);
}

/**
 * Returns cached or direct domain matches synchronously
 */
export function getSmartWebResults(query: string): WebSearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  if (searchCache.has(q)) {
    return searchCache.get(q)!;
  }
  return [];
}

/**
 * Fetches top search result for quick add
 */
export async function fetchTopSearchResult(query: string): Promise<WebSearchResult> {
  const results = await performWebSearch(query);
  if (results.length > 0) {
    return results[0];
  }
  const cleanQ = query.trim();
  const domain = `${cleanQ.replace(/\s+/g, '').toLowerCase()}.com`;
  const url = `https://${domain}`;
  return {
    title: cleanQ,
    url,
    domain,
    description: `Official website for ${cleanQ}`,
    favicon: getFaviconUrl(url, domain),
    iconBg: getInitialColor(domain),
    iconColor: '#000000',
    initials: getInitials(cleanQ, domain),
  };
}
