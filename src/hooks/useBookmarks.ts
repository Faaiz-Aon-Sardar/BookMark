/**
 * useBookmarks Hook
 * Central state management for Bookmark Launcher with Custom Named Collections
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Bookmark, CustomCollection, ToastMessage, ViewFilter } from '../types/bookmark';
import { bookmarkStorage, INITIAL_DEMO_BOOKMARKS } from '../services/bookmarkStorage';
import { isValidUrl, extractDomain, formatUrlForInput } from '../utils/urlUtils';
import { getFaviconUrl } from '../utils/faviconUtils';
import { openInDefaultBrowser } from '../utils/desktopLauncher';
import { INITIAL_CUSTOM_COLLECTIONS } from '../utils/collectionUtils';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => bookmarkStorage.loadBookmarks());
  const [collections, setCollections] = useState<CustomCollection[]>(() => bookmarkStorage.loadCollections());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<ViewFilter>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Keep localStorage synced whenever bookmarks update
  useEffect(() => {
    bookmarkStorage.saveBookmarks(bookmarks);
  }, [bookmarks]);

  // Keep localStorage synced whenever collections update
  useEffect(() => {
    bookmarkStorage.saveCollections(collections);
  }, [collections]);

  // Toast helper
  const showToast = useCallback((title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Filtered lists
  const favorites = useMemo(() => {
    return bookmarks.filter(b => b.isFavorite);
  }, [bookmarks]);

  // Active custom collection object if selected
  const activeCollection = useMemo(() => {
    if (!selectedCollectionId) return undefined;
    return collections.find(c => c.id === selectedCollectionId);
  }, [collections, selectedCollectionId]);

  // Combined tags from bookmarks
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    bookmarks.forEach(b => {
      b.tags?.forEach(t => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [bookmarks]);

  // Search & Filtered Bookmarks
  const filteredBookmarks = useMemo(() => {
    let list = [...bookmarks];

    if (activeFilter === 'favorites') {
      list = list.filter(b => b.isFavorite);
    } else if (activeFilter === 'collection' && selectedCollectionId) {
      list = list.filter(b => b.collections?.includes(selectedCollectionId));
    } else if (activeFilter === 'recent') {
      list.sort((a, b) => {
        const timeA = a.lastOpenedAt ? new Date(a.lastOpenedAt).getTime() : 0;
        const timeB = b.lastOpenedAt ? new Date(b.lastOpenedAt).getTime() : 0;
        return timeB - timeA;
      });
    }

    if (selectedTag) {
      list = list.filter(b => b.tags?.includes(selectedTag));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(b => 
        b.name.toLowerCase().includes(q) ||
        b.domain.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [bookmarks, activeFilter, selectedCollectionId, selectedTag, searchQuery]);

  // Add bookmark
  const addBookmark = useCallback((data: {
    name: string;
    url: string;
    customIconBg?: string;
    tags?: string[];
    isFavorite?: boolean;
    favicon?: string;
    collections?: string[];
  }): { success: boolean; error?: string } => {
    if (!isValidUrl(data.url)) {
      showToast('Invalid URL', 'Please enter a valid website URL.', 'error');
      return { success: false, error: 'Please enter a valid website URL.' };
    }

    // Duplicate check
    const duplicate = bookmarkStorage.findDuplicate(bookmarks, data.url);
    if (duplicate) {
      const msg = `"${duplicate.name}" is already bookmarked.`;
      showToast('Duplicate Website', msg, 'warning');
      return { success: false, error: msg };
    }

    const newBookmark = bookmarkStorage.createBookmark(data);
    setBookmarks(prev => [newBookmark, ...prev]);
    
    // Confetti effect
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#000000', '#FF4081', '#1DB954', '#4285F4', '#FFD600']
      });
    } catch {
      // Ignore if canvas is unavailable
    }

    showToast('Bookmark added!', `Added ${newBookmark.name} to your launcher.`);
    return { success: true };
  }, [bookmarks, showToast]);

  // Update bookmark
  const updateBookmark = useCallback((id: string, data: {
    name: string;
    url: string;
    customIconBg?: string;
    tags?: string[];
    isFavorite?: boolean;
    favicon?: string;
    collections?: string[];
  }): { success: boolean; error?: string } => {
    if (!isValidUrl(data.url)) {
      showToast('Invalid URL', 'Please enter a valid website URL.', 'error');
      return { success: false, error: 'Please enter a valid website URL.' };
    }

    // Check duplicate excluding self
    const duplicate = bookmarkStorage.findDuplicate(bookmarks, data.url, id);
    if (duplicate) {
      const msg = `Another bookmark (${duplicate.name}) already uses this URL.`;
      showToast('Duplicate URL', msg, 'warning');
      return { success: false, error: msg };
    }

    const formattedUrl = formatUrlForInput(data.url);
    const domain = extractDomain(formattedUrl);
    const resolvedFavicon = data.favicon || getFaviconUrl(formattedUrl, domain);

    setBookmarks(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          name: data.name.trim(),
          url: formattedUrl,
          domain,
          favicon: resolvedFavicon,
          customIconBg: data.customIconBg ?? b.customIconBg,
          tags: data.tags ?? b.tags,
          isFavorite: data.isFavorite !== undefined ? data.isFavorite : b.isFavorite,
          collections: data.collections !== undefined ? data.collections : (b.collections || []),
          updatedAt: new Date().toISOString(),
        };
      }
      return b;
    }));

    showToast('Changes saved', `Updated ${data.name}.`);
    return { success: true };
  }, [bookmarks, showToast]);

  // Delete bookmark
  const deleteBookmark = useCallback((id: string) => {
    const target = bookmarks.find(b => b.id === id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
    if (target) {
      showToast('Bookmark deleted', `Removed ${target.name} from launcher.`, 'info');
    }
  }, [bookmarks, showToast]);

  // Toggle favorite
  const toggleFavorite = useCallback((id: string) => {
    setBookmarks(prev => prev.map(b => {
      if (b.id === id) {
        const nextState = !b.isFavorite;
        showToast(
          nextState ? 'Added to favorites' : 'Removed from favorites',
          `${b.name} is ${nextState ? 'now in favorites' : 'removed from favorites'}.`,
          'info'
        );
        return { ...b, isFavorite: nextState, updatedAt: new Date().toISOString() };
      }
      return b;
    }));
  }, [showToast]);

  // Toggle collection membership for a bookmark
  const toggleBookmarkCollection = useCallback((bookmarkId: string, collectionId: string) => {
    const targetCol = collections.find(c => c.id === collectionId);
    setBookmarks(prev => prev.map(b => {
      if (b.id === bookmarkId) {
        const currentCols = b.collections || [];
        const isMember = currentCols.includes(collectionId);
        const updatedCols = isMember
          ? currentCols.filter(id => id !== collectionId)
          : [...currentCols, collectionId];

        if (targetCol) {
          showToast(
            isMember ? `Removed from ${targetCol.name}` : `Added to ${targetCol.name}`,
            `"${b.name}" is ${isMember ? 'removed from' : 'now in'} ${targetCol.name}.`,
            'info'
          );
        }

        return { ...b, collections: updatedCols, updatedAt: new Date().toISOString() };
      }
      return b;
    }));
  }, [collections, showToast]);

  // Add custom collection
  const addCollection = useCallback((data: {
    name: string;
    color?: string;
    icon?: string;
    description?: string;
  }): { success: boolean; collection?: CustomCollection; error?: string } => {
    const trimmed = data.name.trim();
    if (!trimmed) {
      showToast('List Name Required', 'Please enter a name for your custom list.', 'error');
      return { success: false, error: 'Please enter a list name.' };
    }

    // Check duplicate name
    const dup = collections.find(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (dup) {
      showToast('List Already Exists', `A list named "${trimmed}" already exists.`, 'warning');
      return { success: false, error: `A list named "${trimmed}" already exists.` };
    }

    const newCol = bookmarkStorage.createCollection(data);
    setCollections(prev => [...prev, newCol]);

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
      });
    } catch {}

    showToast('Custom List Created!', `Created list "${newCol.name}".`);
    return { success: true, collection: newCol };
  }, [collections, showToast]);

  // Update custom collection
  const updateCollection = useCallback((id: string, data: Partial<CustomCollection>): { success: boolean; error?: string } => {
    if (data.name !== undefined) {
      const trimmed = data.name.trim();
      if (!trimmed) {
        showToast('Invalid Name', 'List name cannot be empty.', 'error');
        return { success: false, error: 'List name cannot be empty.' };
      }
      const dup = collections.find(c => c.id !== id && c.name.toLowerCase() === trimmed.toLowerCase());
      if (dup) {
        showToast('Duplicate Name', `Another list is already named "${trimmed}".`, 'warning');
        return { success: false, error: `Another list is already named "${trimmed}".` };
      }
    }

    setCollections(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          ...data,
          name: data.name ? data.name.trim() : c.name,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    }));

    showToast('List Updated', 'Your custom list was updated successfully.');
    return { success: true };
  }, [collections, showToast]);

  // Delete custom collection
  const deleteCollection = useCallback((id: string) => {
    const target = collections.find(c => c.id === id);
    setCollections(prev => prev.filter(c => c.id !== id));
    // Also remove collection from bookmarks
    setBookmarks(prev => prev.map(b => {
      if (b.collections?.includes(id)) {
        return {
          ...b,
          collections: b.collections.filter(cid => cid !== id),
          updatedAt: new Date().toISOString(),
        };
      }
      return b;
    }));

    if (selectedCollectionId === id) {
      setActiveFilter('all');
      setSelectedCollectionId(null);
    }

    if (target) {
      showToast('List Deleted', `Deleted list "${target.name}".`, 'info');
    }
    return { success: true };
  }, [collections, selectedCollectionId, showToast]);

  // Launch website
  const launchWebsite = useCallback(async (bookmark: Bookmark) => {
    // Record click count & time
    setBookmarks(prev => prev.map(b => {
      if (b.id === bookmark.id) {
        return {
          ...b,
          clickCount: (b.clickCount || 0) + 1,
          lastOpenedAt: new Date().toISOString()
        };
      }
      return b;
    }));

    const result = await openInDefaultBrowser(bookmark.url);
    if (!result.success) {
      showToast('Failed to open link', result.message || 'Check your URL format', 'error');
    }
  }, [showToast]);

  // Export JSON
  const exportData = useCallback(() => {
    const json = bookmarkStorage.exportJSON(bookmarks, collections);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmark-launcher-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Export successful', 'Downloaded your bookmarks and lists backup JSON.');
  }, [bookmarks, collections, showToast]);

  // Import JSON
  const importData = useCallback((jsonString: string) => {
    const result = bookmarkStorage.importJSON(jsonString);
    if (result.success && result.bookmarks) {
      setBookmarks(result.bookmarks);
      if (result.collections && result.collections.length > 0) {
        setCollections(result.collections);
      }
      showToast(
        'Import successful',
        `Imported ${result.bookmarks.length} bookmarks and ${result.collections?.length || 0} lists.`
      );
      return true;
    } else {
      showToast('Import failed', result.error || 'Invalid file format', 'error');
      return false;
    }
  }, [showToast]);

  // Reset to initial demo bookmarks & collections
  const resetToDefaults = useCallback(() => {
    setBookmarks(INITIAL_DEMO_BOOKMARKS);
    setCollections(INITIAL_CUSTOM_COLLECTIONS);
    showToast('Reset to defaults', 'Restored default demo bookmarks and lists.', 'info');
  }, [showToast]);

  // Clear all bookmarks
  const clearAllBookmarks = useCallback(() => {
    setBookmarks([]);
    showToast('All bookmarks cleared', 'Launcher is now empty.', 'warning');
  }, [showToast]);

  return {
    bookmarks,
    favorites,
    collections,
    activeCollection,
    selectedCollectionId,
    setSelectedCollectionId,
    allTags,
    filteredBookmarks,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    selectedTag,
    setSelectedTag,
    toasts,
    removeToast,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    toggleFavorite,
    toggleBookmarkCollection,
    addCollection,
    updateCollection,
    deleteCollection,
    launchWebsite,
    exportData,
    importData,
    resetToDefaults,
    clearAllBookmarks,
    showToast,
  };
}
