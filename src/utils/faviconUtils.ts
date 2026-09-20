/**
 * Favicon & Logo Resolution Utility
 * 
 * Accurately resolves websites' favicons and app icons with multi-tiered fallback
 * cascading (Google S2 -> Icon Horse -> DuckDuckGo -> Unavatar -> Direct Origin -> Initials).
 */

export interface ResolvedFavicon {
  url: string;
  hostname: string;
  domain: string;
  primaryFavicon: string;
  fallbackUrls: string[];
}

// Cheerful neo-brutalist backgrounds
export const ICON_PASTEL_COLORS = [
  '#EEF2FF', // Pastel Indigo
  '#FEE2E2', // Pastel Coral/Red
  '#ECFDF5', // Pastel Emerald
  '#FEF3C7', // Pastel Amber
  '#F3E8FF', // Pastel Purple
  '#E0F2FE', // Pastel Sky
  '#FCE7F3', // Pastel Pink
  '#FEF9C3', // Pastel Yellow
  '#E2E8F0', // Pastel Slate
];

/**
 * Safely extracts the canonical hostname (preserving subdomains like mail.google.com)
 */
export function extractHostname(urlOrDomain: string): string {
  if (!urlOrDomain) return '';
  let target = urlOrDomain.trim();
  
  if (!/^https?:\/\//i.test(target)) {
    target = `https://${target}`;
  }

  try {
    const parsed = new URL(target);
    return parsed.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return urlOrDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split('?')[0];
  }
}

/**
 * Extracts the base domain from a hostname (e.g. mail.google.com -> google.com)
 */
export function extractBaseDomain(hostname: string): string {
  if (!hostname) return '';
  const clean = hostname.toLowerCase().replace(/^www\./, '');
  const parts = clean.split('.');
  if (parts.length > 2) {
    const lastTwo = parts.slice(-2).join('.');
    if (['co.uk', 'com.au', 'co.in', 'org.uk', 'gov.in', 'co.nz', 'co.jp'].includes(lastTwo) && parts.length > 2) {
      return parts.slice(-3).join('.');
    }
    return parts.slice(-2).join('.');
  }
  return clean;
}

/**
 * Generates an ordered list of favicon candidate URLs for a website.
 */
export function getFaviconCandidates(urlOrDomain: string): string[] {
  const hostname = extractHostname(urlOrDomain);
  if (!hostname) return [];

  const candidates: string[] = [];

  // 1. Google S2 Favicon Service (sz=128 for high-res clarity)
  candidates.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`);

  // 2. Icon Horse (Fast, multi-format icon provider with Apple Touch Icon extraction)
  candidates.push(`https://icon.horse/icon/${encodeURIComponent(hostname)}`);

  // 3. DuckDuckGo Favicon Service
  candidates.push(`https://icons.duckduckgo.com/ip3/${encodeURIComponent(hostname)}.ico`);

  // 4. Google S2 standard size (sz=64)
  candidates.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=64`);

  // 5. Unavatar API
  candidates.push(`https://unavatar.io/${encodeURIComponent(hostname)}?fallback=false`);

  // 6. Direct /favicon.ico and /apple-touch-icon.png
  candidates.push(`https://${hostname}/favicon.ico`);
  candidates.push(`https://${hostname}/apple-touch-icon.png`);

  // 7. If hostname has a sub-domain (e.g. mail.google.com), also try base domain (google.com)
  const baseDomain = extractBaseDomain(hostname);
  if (baseDomain && baseDomain !== hostname) {
    candidates.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(baseDomain)}&sz=128`);
    candidates.push(`https://icon.horse/icon/${encodeURIComponent(baseDomain)}`);
    candidates.push(`https://icons.duckduckgo.com/ip3/${encodeURIComponent(baseDomain)}.ico`);
  }

  // Deduplicate
  return Array.from(new Set(candidates));
}

/**
 * Primary Favicon URL helper
 */
export function getFaviconUrl(url: string, domain?: string): string {
  const target = domain || url;
  const hostname = extractHostname(target);
  if (!hostname) return '';
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`;
}

/**
 * DuckDuckGo Favicon URL
 */
export function getDuckDuckGoFaviconUrl(domain: string): string {
  const hostname = extractHostname(domain);
  return `https://icons.duckduckgo.com/ip3/${encodeURIComponent(hostname)}.ico`;
}

/**
 * Unavatar Favicon URL
 */
export function getUnavatarUrl(domain: string): string {
  const hostname = extractHostname(domain);
  return `https://unavatar.io/${encodeURIComponent(hostname)}`;
}

/**
 * Resolves all favicon metadata for a bookmark
 */
export function resolveFavicon(url: string, fallbackName?: string): ResolvedFavicon {
  const hostname = extractHostname(url) || fallbackName || '';
  const domain = extractBaseDomain(hostname) || hostname;
  const candidates = getFaviconCandidates(url);

  return {
    url,
    hostname,
    domain,
    primaryFavicon: candidates[0] || '',
    fallbackUrls: candidates.slice(1),
  };
}

/**
 * Deterministic background color generator based on website name / domain
 */
export function getInitialColor(str: string): string {
  if (!str) return ICON_PASTEL_COLORS[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % ICON_PASTEL_COLORS.length;
  return ICON_PASTEL_COLORS[index];
}

/**
 * Deterministic 1-2 letter uppercase initials for fallback display
 */
export function getInitials(name: string, domain: string): string {
  const target = (name || domain || '').trim();
  if (!target) return '★';
  
  // Clean off protocol/www
  const clean = target.replace(/^(https?:\/\/)?(www\.)?/, '');
  const words = clean.split(/[\s.\-_/]+/);
  if (words.length >= 2 && words[0] && words[1]) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}
