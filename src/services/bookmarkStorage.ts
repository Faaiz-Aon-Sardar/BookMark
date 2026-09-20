/**
 * Bookmark Storage Service
 * Handles persistence, export/import, collections, and initial data seeding
 */

import { Bookmark, CustomCollection } from '../types/bookmark';
import { areUrlsEqual, extractDomain, formatUrlForInput } from '../utils/urlUtils';
import { getFaviconUrl } from '../utils/faviconUtils';
import { INITIAL_CUSTOM_COLLECTIONS } from '../utils/collectionUtils';

const STORAGE_KEY = 'bookmark_launcher_data_v1';
const COLLECTIONS_STORAGE_KEY = 'bookmark_launcher_collections_v1';

export const INITIAL_DEMO_BOOKMARKS: Bookmark[] = [
  {
    id: 'bm-github',
    name: 'GitHub',
    url: 'https://github.com',
    domain: 'github.com',
    favicon: 'https://www.google.com/s2/favicons?domain=github.com&sz=128',
    customIconBg: '#E8F0FE',
    tags: ['Development', 'Tools'],
    isFavorite: true,
    collections: ['col-work'],
    clickCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'bm-youtube',
    name: 'YouTube',
    url: 'https://youtube.com',
    domain: 'youtube.com',
    favicon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128',
    customIconBg: '#FCE8E6',
    tags: ['Media', 'Entertainment'],
    isFavorite: true,
    collections: [],
    clickCount: 8,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'bm-chatgpt',
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    domain: 'chatgpt.com',
    favicon: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128',
    customIconBg: '#E6F4EA',
    tags: ['AI', 'Productivity'],
    isFavorite: true,
    collections: ['col-work', 'col-reading'],
    clickCount: 19,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'bm-google',
    name: 'Google',
    url: 'https://google.com',
    domain: 'google.com',
    favicon: 'https://www.google.com/s2/favicons?domain=google.com&sz=128',
    customIconBg: '#FEF7E0',
    tags: ['Search'],
    isFavorite: false,
    collections: [],
    clickCount: 5,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'bm-spotify',
    name: 'Spotify',
    url: 'https://spotify.com',
    domain: 'spotify.com',
    favicon: 'https://www.google.com/s2/favicons?domain=spotify.com&sz=128',
    customIconBg: '#E6F4EA',
    tags: ['Media', 'Music'],
    isFavorite: false,
    collections: [],
    clickCount: 7,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'bm-reddit',
    name: 'Reddit',
    url: 'https://reddit.com',
    domain: 'reddit.com',
    favicon: 'https://www.google.com/s2/favicons?domain=reddit.com&sz=128',
    customIconBg: '#FEEFC3',
    tags: ['Community', 'News'],
    isFavorite: false,
    collections: ['col-reading'],
    clickCount: 4,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'bm-gmail',
    name: 'Gmail',
    url: 'https://mail.google.com',
    domain: 'mail.google.com',
    favicon: 'https://www.google.com/s2/favicons?domain=mail.google.com&sz=128',
    customIconBg: '#FCE8E6',
    tags: ['Productivity', 'Mail'],
    isFavorite: false,
    collections: ['col-work'],
    clickCount: 15,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'bm-figma',
    name: 'Figma',
    url: 'https://figma.com',
    domain: 'figma.com',
    favicon: 'https://www.google.com/s2/favicons?domain=figma.com&sz=128',
    customIconBg: '#F3E8FD',
    tags: ['Design'],
    isFavorite: false,
    collections: ['col-creative', 'col-work'],
    clickCount: 6,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

export const bookmarkStorage = {
  loadBookmarks(): Bookmark[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load bookmarks from localStorage:', e);
    }
    // Return seeded demo data on initial run
    this.saveBookmarks(INITIAL_DEMO_BOOKMARKS);
    return INITIAL_DEMO_BOOKMARKS;
  },

  saveBookmarks(bookmarks: Bookmark[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      return true;
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage:', e);
      return false;
    }
  },

  loadCollections(): CustomCollection[] {
    try {
      const stored = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load collections from localStorage:', e);
    }
    this.saveCollections(INITIAL_CUSTOM_COLLECTIONS);
    return INITIAL_CUSTOM_COLLECTIONS;
  },

  saveCollections(collections: CustomCollection[]): boolean {
    try {
      localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
      return true;
    } catch (e) {
      console.error('Failed to save collections to localStorage:', e);
      return false;
    }
  },

  createCollection(data: {
    name: string;
    color?: string;
    icon?: string;
    description?: string;
  }): CustomCollection {
    const now = new Date().toISOString();
    return {
      id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      color: data.color || 'amber',
      icon: data.icon || 'star',
      description: data.description?.trim(),
      createdAt: now,
      updatedAt: now,
    };
  },

  findDuplicate(bookmarks: Bookmark[], url: string, excludeId?: string): Bookmark | undefined {
    return bookmarks.find(b => {
      if (excludeId && b.id === excludeId) return false;
      return areUrlsEqual(b.url, url);
    });
  },

  createBookmark(data: {
    name: string;
    url: string;
    customIconBg?: string;
    tags?: string[];
    isFavorite?: boolean;
    favicon?: string;
    collections?: string[];
  }): Bookmark {
    const formattedUrl = formatUrlForInput(data.url);
    const domain = extractDomain(formattedUrl);
    const now = new Date().toISOString();
    return {
      id: `bm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      url: formattedUrl,
      domain,
      favicon: data.favicon || getFaviconUrl(formattedUrl, domain),
      customIconBg: data.customIconBg,
      tags: data.tags || [],
      isFavorite: !!data.isFavorite,
      collections: data.collections || [],
      clickCount: 0,
      createdAt: now,
      updatedAt: now,
    };
  },

  exportJSON(bookmarks: Bookmark[], collections: CustomCollection[] = []): string {
    return JSON.stringify(
      {
        app: 'Bookmark Launcher',
        version: '2.5',
        exportedAt: new Date().toISOString(),
        count: bookmarks.length,
        collectionsCount: collections.length,
        collections,
        bookmarks,
      },
      null,
      2
    );
  },

  importJSON(jsonString: string): {
    success: boolean;
    bookmarks?: Bookmark[];
    collections?: CustomCollection[];
    error?: string;
  } {
    try {
      const data = JSON.parse(jsonString);
      const list = Array.isArray(data) ? data : data.bookmarks;
      if (!Array.isArray(list)) {
        return { success: false, error: 'Invalid JSON format: missing bookmark list.' };
      }
      
      const validatedBookmarks: Bookmark[] = list.map((item: Partial<Bookmark>) => {
        const formattedUrl = formatUrlForInput(item.url || 'https://example.com');
        const domain = extractDomain(formattedUrl);
        return {
          id: item.id || `bm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: item.name || domain,
          url: formattedUrl,
          domain,
          favicon: item.favicon || getFaviconUrl(formattedUrl, domain),
          customIconBg: item.customIconBg,
          tags: Array.isArray(item.tags) ? item.tags : [],
          isFavorite: !!item.isFavorite,
          collections: Array.isArray(item.collections) ? item.collections : [],
          clickCount: typeof item.clickCount === 'number' ? item.clickCount : 0,
          lastOpenedAt: item.lastOpenedAt,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        };
      });

      let validatedCollections: CustomCollection[] | undefined = undefined;
      if (Array.isArray(data.collections)) {
        validatedCollections = data.collections.map((col: Partial<CustomCollection>) => ({
          id: col.id || `col-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: col.name || 'Untitled List',
          color: col.color || 'amber',
          icon: col.icon || 'star',
          description: col.description,
          createdAt: col.createdAt || new Date().toISOString(),
          updatedAt: col.updatedAt || new Date().toISOString(),
        }));
      }

      return {
        success: true,
        bookmarks: validatedBookmarks,
        collections: validatedCollections,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to parse JSON file',
      };
    }
  }
};
