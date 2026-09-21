export interface WebSearchResult {
  title: string;
  url: string;
  domain: string;
  description: string;
  snippet?: string;
  favicon?: string;
  category?: string;
  iconBg?: string;
  iconColor?: string;
  initials?: string;
}

export interface SearchApiResponse {
  query: string;
  provider: 'serper' | 'brave' | 'duckduckgo' | 'fallback';
  count: number;
  results: WebSearchResult[];
  error?: string;
}
