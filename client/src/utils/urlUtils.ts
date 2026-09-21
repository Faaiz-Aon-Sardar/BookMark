/**
 * URL Utilities for Bookmark Launcher
 */

export function isValidUrl(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  const trimmed = input.trim();
  
  // Quick test or attempt to construct URL
  try {
    const url = new URL(trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.');
  } catch {
    return false;
  }
}

export function formatUrlForInput(input: string): string {
  let trimmed = input.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
}

export function extractDomain(input: string): string {
  try {
    const formatted = formatUrlForInput(input);
    const url = new URL(formatted);
    return url.hostname.replace(/^www\./, '');
  } catch {
    // Fallback extraction
    const clean = input.replace(/^https?:\/\//, '').split('/')[0].split('?')[0];
    return clean.replace(/^www\./, '') || input;
  }
}

export function normalizeUrl(input: string): string {
  try {
    const formatted = formatUrlForInput(input);
    const url = new URL(formatted);
    // Lowercase hostname and remove trailing slash from path
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    let pathname = url.pathname;
    if (pathname.endsWith('/') && pathname.length > 1) {
      pathname = pathname.slice(0, -1);
    }
    if (pathname === '/') {
      pathname = '';
    }
    return `${url.protocol}//${hostname}${pathname}${url.search}`;
  } catch {
    return input.trim().toLowerCase().replace(/\/+$/, '');
  }
}

export function areUrlsEqual(url1: string, url2: string): boolean {
  return normalizeUrl(url1) === normalizeUrl(url2);
}

export function deriveTitleFromDomain(domain: string): string {
  const parts = domain.split('.');
  if (parts.length > 0) {
    const main = parts[0];
    return main.charAt(0).toUpperCase() + main.slice(1);
  }
  return domain;
}

/**
 * Smartly resolves user queries to a direct web URL, known service, or search engine link
 */
export function resolveQueryToUrl(query: string): {
  url: string;
  name: string;
  isSearchEngine?: boolean;
  category?: string;
} {
  const q = query.trim();
  if (!q) {
    return { url: '', name: '' };
  }

  // Already a full URL
  if (/^https?:\/\//i.test(q)) {
    const domain = extractDomain(q);
    return {
      url: q,
      name: deriveTitleFromDomain(domain),
      category: 'Web',
    };
  }

  // Has domain extension (e.g. "aistudio.google.com", "example.com/path", "vite.dev", "react.dev")
  const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i;
  if (domainPattern.test(q)) {
    const fullUrl = `https://${q}`;
    const domain = extractDomain(fullUrl);
    return {
      url: fullUrl,
      name: deriveTitleFromDomain(domain),
      category: 'Web',
    };
  }

  const lower = q.toLowerCase();

  // Known special mappings
  const knownMappings: Record<string, { url: string; name: string; category: string }> = {
    'google ai studio': { url: 'https://aistudio.google.com', name: 'Google AI Studio', category: 'AI & Tools' },
    'ai studio': { url: 'https://aistudio.google.com', name: 'Google AI Studio', category: 'AI & Tools' },
    'gemini': { url: 'https://gemini.google.com', name: 'Google Gemini', category: 'AI & Tools' },
    'google gemini': { url: 'https://gemini.google.com', name: 'Google Gemini', category: 'AI & Tools' },
    'chatgpt': { url: 'https://chatgpt.com', name: 'ChatGPT', category: 'AI & Tools' },
    'openai': { url: 'https://openai.com', name: 'OpenAI', category: 'AI & Tools' },
    'claude': { url: 'https://claude.ai', name: 'Claude', category: 'AI & Tools' },
    'anthropic': { url: 'https://claude.ai', name: 'Claude AI', category: 'AI & Tools' },
    'perplexity': { url: 'https://perplexity.ai', name: 'Perplexity AI', category: 'AI & Tools' },
    'deepseek': { url: 'https://chat.deepseek.com', name: 'DeepSeek', category: 'AI & Tools' },
    'midjourney': { url: 'https://midjourney.com', name: 'Midjourney', category: 'AI & Tools' },
    'cursor': { url: 'https://cursor.com', name: 'Cursor AI', category: 'Development' },
    'huggingface': { url: 'https://huggingface.co', name: 'Hugging Face', category: 'AI & Tools' },
    'hugging face': { url: 'https://huggingface.co', name: 'Hugging Face', category: 'AI & Tools' },
    'replit': { url: 'https://replit.com', name: 'Replit', category: 'Development' },
    'v0': { url: 'https://v0.dev', name: 'v0 by Vercel', category: 'Development' },
    'github copilot': { url: 'https://github.com/features/copilot', name: 'GitHub Copilot', category: 'Development' },
    'wolfram': { url: 'https://www.wolframalpha.com', name: 'Wolfram Alpha', category: 'Science & Math' },
    'wolfram alpha': { url: 'https://www.wolframalpha.com', name: 'Wolfram Alpha', category: 'Science & Math' },
    'arxiv': { url: 'https://arxiv.org', name: 'arXiv', category: 'Science & Math' },
    'overleaf': { url: 'https://www.overleaf.com', name: 'Overleaf LaTeX', category: 'Science & Math' },
    'desmos': { url: 'https://www.desmos.com/calculator', name: 'Desmos Graphing', category: 'Science & Math' },
    'physics stack exchange': { url: 'https://physics.stackexchange.com', name: 'Physics Stack Exchange', category: 'Science & Math' },
    'brilliant': { url: 'https://brilliant.org', name: 'Brilliant', category: 'Learning' },
    'khan academy': { url: 'https://www.khanacademy.org', name: 'Khan Academy', category: 'Learning' },
    'google scholar': { url: 'https://scholar.google.com', name: 'Google Scholar', category: 'Science & Math' },
    'youtube': { url: 'https://youtube.com', name: 'YouTube', category: 'Media' },
    'yt': { url: 'https://youtube.com', name: 'YouTube', category: 'Media' },
    'github': { url: 'https://github.com', name: 'GitHub', category: 'Development' },
    'gh': { url: 'https://github.com', name: 'GitHub', category: 'Development' },
    'stackoverflow': { url: 'https://stackoverflow.com', name: 'Stack Overflow', category: 'Development' },
    'stack overflow': { url: 'https://stackoverflow.com', name: 'Stack Overflow', category: 'Development' },
    'reddit': { url: 'https://reddit.com', name: 'Reddit', category: 'Social' },
    'spotify': { url: 'https://spotify.com', name: 'Spotify', category: 'Media' },
    'notion': { url: 'https://notion.so', name: 'Notion', category: 'Productivity' },
    'figma': { url: 'https://figma.com', name: 'Figma', category: 'Design' },
    'twitter': { url: 'https://x.com', name: 'X / Twitter', category: 'Social' },
    'x': { url: 'https://x.com', name: 'X / Twitter', category: 'Social' },
    'linkedin': { url: 'https://linkedin.com', name: 'LinkedIn', category: 'Social' },
    'gmail': { url: 'https://mail.google.com', name: 'Gmail', category: 'Productivity' },
    'google docs': { url: 'https://docs.google.com', name: 'Google Docs', category: 'Productivity' },
    'google drive': { url: 'https://drive.google.com', name: 'Google Drive', category: 'Productivity' },
    'google maps': { url: 'https://maps.google.com', name: 'Google Maps', category: 'Search' },
    'wikipedia': { url: 'https://wikipedia.org', name: 'Wikipedia', category: 'Learning' },
    'netflix': { url: 'https://netflix.com', name: 'Netflix', category: 'Media' },
    'twitch': { url: 'https://twitch.tv', name: 'Twitch', category: 'Media' },
    'amazon': { url: 'https://amazon.com', name: 'Amazon', category: 'Shopping' },
  };

  if (knownMappings[lower]) {
    return knownMappings[lower];
  }

  // Capitalize words for clean display name
  const formattedName = q
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // If simple single-word without spaces, guess https://word.com
  if (!q.includes(' ')) {
    return {
      url: `https://${lower}.com`,
      name: formattedName,
      category: 'Web',
    };
  }

  // Multi-word phrase fallback: direct Google search
  return {
    url: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    name: `${formattedName} (Google Search)`,
    isSearchEngine: true,
    category: 'Search',
  };
}
