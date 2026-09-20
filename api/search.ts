import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';

/**
 * Normalizes URL and extracts clean domain
 */
function cleanDomain(urlStr: string): string {
  try {
    const formatted = /^https?:\/\//i.test(urlStr) ? urlStr : `https://${urlStr}`;
    return new URL(formatted).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function deriveTitle(domain: string): string {
  const base = domain.split('.')[0] || domain;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

/**
 * Filter out encyclopedia and dictionary domains
 */
function isExcluded(urlOrDomain: string): boolean {
  const lower = urlOrDomain.toLowerCase();
  return (
    lower.includes('wikipedia.org') ||
    lower.includes('wikimedia.org') ||
    lower.includes('wiktionary.org')
  );
}

/**
 * 1. Search via Serper.dev Google Search API
 */
async function searchWithSerper(query: string, apiKey: string) {
  const res = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: query,
      num: 10,
    }),
  });

  if (!res.ok) {
    throw new Error(`Serper API returned status ${res.status}`);
  }

  const data = await res.json();
  const results: Array<{
    title: string;
    url: string;
    domain: string;
    description: string;
    favicon?: string;
  }> = [];

  if (Array.isArray(data.organic)) {
    for (const item of data.organic) {
      if (item.link && !isExcluded(item.link)) {
        const domain = cleanDomain(item.link);
        if (domain && !results.some((r) => r.url === item.link)) {
          results.push({
            title: item.title || deriveTitle(domain),
            url: item.link,
            domain,
            description: item.snippet || `Official website for ${item.title || domain}`,
            favicon: item.favicon || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
          });
        }
      }
    }
  }

  return results;
}

/**
 * 2. Search via Google Search Grounding with Gemini
 */
async function searchWithGoogleGemini(query: string, apiKey: string) {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3.7-flash',
    contents: `Search Google for: "${query}". Return the top official websites, link domains, and descriptions found on Google.
Format output as a JSON array of objects with keys: "title", "url", "domain", "description".`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const results: Array<{
    title: string;
    url: string;
    domain: string;
    description: string;
    favicon?: string;
  }> = [];

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (Array.isArray(chunks)) {
    for (const chunk of chunks) {
      if (chunk.web?.uri) {
        const uri = chunk.web.uri;
        const domain = cleanDomain(uri);
        if (domain && !isExcluded(uri) && !results.some((r) => r.url === uri || r.domain === domain)) {
          results.push({
            title: chunk.web.title || deriveTitle(domain),
            url: uri,
            domain,
            description: `Official web link from Google Search for ${chunk.web.title || domain}`,
            favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
          });
        }
      }
    }
  }

  const text = response.text?.trim() || '';
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item.url && !isExcluded(item.url)) {
            const domain = cleanDomain(item.url) || item.domain;
            if (domain && !results.some((r) => r.url === item.url || r.domain === domain)) {
              results.push({
                title: item.title || deriveTitle(domain),
                url: item.url.startsWith('http') ? item.url : `https://${item.url}`,
                domain,
                description: item.description || `Website for ${domain}`,
                favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
              });
            }
          }
        }
      }
    }
  } catch {
    // fallback
  }

  return results;
}

/**
 * 3. Search via Brave Search API
 */
async function searchWithBrave(query: string, apiKey: string) {
  const res = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=10`,
    {
      headers: {
        Accept: 'application/json',
        'X-Subscription-Token': apiKey,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Brave Search API returned status ${res.status}`);
  }

  const data = await res.json();
  const results: Array<{
    title: string;
    url: string;
    domain: string;
    description: string;
    favicon?: string;
  }> = [];

  if (data.web && Array.isArray(data.web.results)) {
    for (const item of data.web.results) {
      if (item.url && !isExcluded(item.url)) {
        const domain = cleanDomain(item.url);
        if (domain && !results.some((r) => r.url === item.url)) {
          results.push({
            title: item.title || deriveTitle(domain),
            url: item.url,
            domain,
            description: item.description || `Official website for ${item.title || domain}`,
            favicon: item.profile?.icon || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
          });
        }
      }
    }
  }

  return results;
}

/**
 * 4. Google Suggestion Links Resolver
 */
async function searchWithGoogleSuggest(query: string) {
  try {
    const res = await fetch(
      `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
        signal: AbortSignal.timeout(3000),
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    const suggestions: string[] = Array.isArray(data[1]) ? data[1] : [];
    const results: Array<{
      title: string;
      url: string;
      domain: string;
      description: string;
      favicon?: string;
    }> = [];

    for (const item of suggestions) {
      if (/^https?:\/\//i.test(item)) {
        const domain = cleanDomain(item);
        if (domain && !isExcluded(domain) && !results.some((r) => r.url === item)) {
          results.push({
            title: deriveTitle(domain),
            url: item,
            domain,
            description: `Official destination for ${domain}`,
            favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
          });
        }
      }
    }
    return results;
  } catch {
    return [];
  }
}

/**
 * 5. Smart Multi-TLD Website Resolver
 */
function resolveDomainLinks(query: string) {
  const cleanQ = query.trim();
  const rawClean = cleanQ.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '');
  
  // If user entered full domain with extension
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(rawClean)) {
    const domain = rawClean;
    const title = deriveTitle(domain);
    return [
      {
        title,
        url: `https://${domain}`,
        domain,
        description: `Official direct web portal for ${title} (${domain})`,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      },
    ];
  }

  // Keywords to domains
  const slug = cleanQ.toLowerCase().replace(/[^a-z0-9]/g, '');
  const title = deriveTitle(cleanQ);

  const tlds = [
    { ext: 'com', label: 'Official Portal' },
    { ext: 'to', label: 'Streaming / Hub Portal' },
    { ext: 'org', label: 'Platform & Community' },
    { ext: 'net', label: 'Network & Mirror' },
    { ext: 'io', label: 'Developer & App Hub' },
    { ext: 'app', label: 'Web Application' },
    { ext: 'co', label: 'Global Portal' },
  ];

  return tlds.map((tld) => {
    const domain = `${slug}.${tld.ext}`;
    return {
      title: `${title} (${tld.label})`,
      url: `https://${domain}`,
      domain,
      description: `${title} web destination and online resources on ${domain}`,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    };
  });
}

/**
 * Universal Search Handler (Cascading Multi-Provider)
 */
export async function handleSearchRequest(query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return { query: '', count: 0, results: [], provider: 'fallback' };
  }

  const serperKey = process.env.SERPER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const braveKey = process.env.BRAVE_SEARCH_API_KEY;

  // 1. Serper.dev (Google Search API)
  if (serperKey && serperKey.trim()) {
    try {
      const results = await searchWithSerper(trimmed, serperKey.trim());
      if (results.length > 0) {
        return {
          query: trimmed,
          count: results.length,
          provider: 'serper',
          results: results.slice(0, 10),
        };
      }
    } catch (err) {
      console.warn('Serper search failed, trying next provider:', err);
    }
  }

  // 2. Google Gemini with Search Grounding
  if (geminiKey && geminiKey.trim()) {
    try {
      const results = await searchWithGoogleGemini(trimmed, geminiKey.trim());
      if (results.length > 0) {
        return {
          query: trimmed,
          count: results.length,
          provider: 'google-grounding',
          results: results.slice(0, 10),
        };
      }
    } catch (err) {
      console.warn('Gemini Search Grounding failed, trying web parser:', err);
    }
  }

  // 3. Brave Search
  if (braveKey && braveKey.trim()) {
    try {
      const results = await searchWithBrave(trimmed, braveKey.trim());
      if (results.length > 0) {
        return {
          query: trimmed,
          count: results.length,
          provider: 'brave',
          results: results.slice(0, 10),
        };
      }
    } catch (err) {
      console.warn('Brave search failed, trying next provider:', err);
    }
  }

  // 4. Google Suggestion Resolver
  try {
    const suggestResults = await searchWithGoogleSuggest(trimmed);
    if (suggestResults.length > 0) {
      return {
        query: trimmed,
        count: suggestResults.length,
        provider: 'google-suggest',
        results: suggestResults.slice(0, 10),
      };
    }
  } catch (err) {
    console.warn('Google suggest failed:', err);
  }

  // 5. Smart Multi-TLD Website Resolver
  const domainResults = resolveDomainLinks(trimmed);
  return {
    query: trimmed,
    count: domainResults.length,
    provider: 'domain-resolver',
    results: domainResults.slice(0, 7),
  };
}

/**
 * Vercel Serverless Function Handler
 */
export default async function handler(
  req: IncomingMessage & { query?: { q?: string } },
  res: ServerResponse & { status?: (code: number) => any; json?: (data: any) => void }
) {
  const urlObj = new URL(req.url || '/', 'http://localhost');
  const query = (req.query?.q || urlObj.searchParams.get('q') || '').trim();

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      return res.status(204).end();
    }
    res.statusCode = 204;
    return res.end();
  }

  try {
    const data = await handleSearchRequest(query);
    if (typeof res.status === 'function') {
      return res.status(200).json(data);
    }
    res.statusCode = 200;
    res.end(JSON.stringify(data));
  } catch (err: any) {
    const errorPayload = {
      error: 'Failed to search web. Please try again.',
      query,
      count: 0,
      results: [],
    };
    if (typeof res.status === 'function') {
      return res.status(500).json(errorPayload);
    }
    res.statusCode = 500;
    res.end(JSON.stringify(errorPayload));
  }
}
