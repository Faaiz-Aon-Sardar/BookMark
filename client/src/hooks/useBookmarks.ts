/**
 * useBookmarks Hook
 * Central state management for Bookmark Launcher with MongoDB Backend
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Bookmark, CustomCollection, ToastMessage, ViewFilter } from '../types/bookmark';
import { isValidUrl, extractDomain, formatUrlForInput } from '../utils/urlUtils';
import { getFaviconUrl } from '../utils/faviconUtils';
import { openInDefaultBrowser } from '../utils/desktopLauncher';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [collections, setCollections] = useState<CustomCollection[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<ViewFilter>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load data from MongoDB on mount
  useEffect(() => {
    fetch('/api/collections')
      .then(res => res.json())
      .then(data => setCollections(data))
      .catch(err => console.error('Failed to load collections', err));

    fetch('/api/bookmarks')
      .then(res => res.json())
      .then(data => setBookmarks(data))
      .catch(err => console.error('Failed to load bookmarks', err));
  }, []);

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

  const activeCollection = useMemo(() => {
    if (!selectedCollectionId) return undefined;
    return collections.find(c => c.id === selectedCollectionId);
  }, [collections, selectedCollectionId]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    bookmarks.forEach(b => {
      b.tags?.forEach(t => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [bookmarks]);

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
        (b.domain && b.domain.toLowerCase().includes(q)) ||
        b.url.toLowerCase().includes(q) ||
        b.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [bookmarks, activeFilter, selectedCollectionId, selectedTag, searchQuery]);

  // Add bookmark
  const addBookmark = useCallback(async (data: {
    name: string;
    url: string;
    customIconBg?: string;
    tags?: string[];
    isFavorite?: boolean;
    favicon?: string;
    collections?: string[];
  }) => {
    if (!isValidUrl(data.url)) {
      showToast('Invalid URL', 'Please enter a valid website URL.', 'error');
      return { success: false, error: 'Please enter a valid website URL.' };
    }

    const formattedUrl = formatUrlForInput(data.url);
    const domain = extractDomain(formattedUrl);
    const resolvedFavicon = data.favicon || getFaviconUrl(formattedUrl, domain);
    const payload = { ...data, url: formattedUrl, domain, favicon: resolvedFavicon };

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      const newBookmark = await res.json();
      
      setBookmarks(prev => [newBookmark, ...prev]);
      
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#000000', '#FF4081', '#1DB954', '#4285F4', '#FFD600']
        });
      } catch {}

      showToast('Bookmark added!', `Added ${newBookmark.name} to your launcher.`);
      return { success: true };
    } catch (err: any) {
      showToast('Error', 'Failed to save bookmark.', 'error');
      return { success: false, error: err.message };
    }
  }, [showToast]);

  // Update bookmark
  const updateBookmark = useCallback(async (id: string, data: any) => {
    if (!isValidUrl(data.url)) {
      showToast('Invalid URL', 'Please enter a valid website URL.', 'error');
      return { success: false, error: 'Please enter a valid website URL.' };
    }

    const formattedUrl = formatUrlForInput(data.url);
    const domain = extractDomain(formattedUrl);
    const resolvedFavicon = data.favicon || getFaviconUrl(formattedUrl, domain);
    const payload = { ...data, url: formattedUrl, domain, favicon: resolvedFavicon };

    try {
      const res = await fetch(`/api/bookmarks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      const updatedBookmark = await res.json();

      setBookmarks(prev => prev.map(b => b.id === id ? updatedBookmark : b));
      showToast('Changes saved', `Updated ${data.name}.`);
      return { success: true };
    } catch (err: any) {
      showToast('Error', 'Failed to update bookmark.', 'error');
      return { success: false, error: err.message };
    }
  }, [showToast]);

  // Delete bookmark
  const deleteBookmark = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      
      const target = bookmarks.find(b => b.id === id);
      setBookmarks(prev => prev.filter(b => b.id !== id));
      if (target) {
        showToast('Bookmark deleted', `Removed ${target.name} from launcher.`, 'info');
      }
    } catch (err) {
      showToast('Error', 'Failed to delete bookmark.', 'error');
    }
  }, [bookmarks, showToast]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/bookmarks/${id}/favorite`, { method: 'PUT' });
      if (!res.ok) throw new Error(await res.text());
      const updatedBookmark = await res.json();
      
      setBookmarks(prev => prev.map(b => b.id === id ? updatedBookmark : b));
      
      showToast(
        updatedBookmark.isFavorite ? 'Added to favorites' : 'Removed from favorites',
        `${updatedBookmark.name} is ${updatedBookmark.isFavorite ? 'now in favorites' : 'removed from favorites'}.`,
        'info'
      );
    } catch (err) {
      showToast('Error', 'Failed to toggle favorite.', 'error');
    }
  }, [showToast]);

  // Toggle collection membership for a bookmark
  const toggleBookmarkCollection = useCallback(async (bookmarkId: string, collectionId: string) => {
    const targetCol = collections.find(c => c.id === collectionId);
    const b = bookmarks.find(bm => bm.id === bookmarkId);
    if (!b) return;

    const currentCols = b.collections || [];
    const isMember = currentCols.includes(collectionId);
    const updatedCols = isMember
      ? currentCols.filter(id => id !== collectionId)
      : [...currentCols, collectionId];

    try {
      const res = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collections: updatedCols })
      });
      if (!res.ok) throw new Error();
      const updatedBookmark = await res.json();
      
      setBookmarks(prev => prev.map(bm => bm.id === bookmarkId ? updatedBookmark : bm));
      
      if (targetCol) {
        showToast(
          isMember ? `Removed from ${targetCol.name}` : `Added to ${targetCol.name}`,
          `"${b.name}" is ${isMember ? 'removed from' : 'now in'} ${targetCol.name}.`,
          'info'
        );
      }
    } catch (err) {
      showToast('Error', 'Failed to update collection membership.', 'error');
    }
  }, [bookmarks, collections, showToast]);

  // Add custom collection
  const addCollection = useCallback(async (data: {
    name: string;
    color?: string;
    icon?: string;
    description?: string;
  }) => {
    const trimmed = data.name.trim();
    if (!trimmed) {
      showToast('List Name Required', 'Please enter a name for your custom list.', 'error');
      return { success: false, error: 'Please enter a list name.' };
    }

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      const newCol = await res.json();
      
      setCollections(prev => [...prev, newCol]);

      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      } catch {}

      showToast('Custom List Created!', `Created list "${newCol.name}".`);
      return { success: true, collection: newCol };
    } catch (err: any) {
      showToast('Error', 'Failed to create collection.', 'error');
      return { success: false, error: err.message };
    }
  }, [showToast]);

  // Update custom collection
  const updateCollection = useCallback(async (id: string, data: Partial<CustomCollection>) => {
    try {
      const res = await fetch(`/api/collections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      const updatedCol = await res.json();
      
      setCollections(prev => prev.map(c => c.id === id ? updatedCol : c));
      showToast('List Updated', 'Your custom list was updated successfully.');
      return { success: true };
    } catch (err: any) {
      showToast('Error', 'Failed to update list.', 'error');
      return { success: false, error: err.message };
    }
  }, [showToast]);

  // Delete custom collection
  const deleteCollection = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      
      const target = collections.find(c => c.id === id);
      setCollections(prev => prev.filter(c => c.id !== id));
      setBookmarks(prev => prev.map(b => {
        if (b.collections?.includes(id)) {
          return { ...b, collections: b.collections.filter(cid => cid !== id) };
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
    } catch (err) {
      showToast('Error', 'Failed to delete list.', 'error');
      return { success: false };
    }
  }, [collections, selectedCollectionId, showToast]);

  // Launch website
  const launchWebsite = useCallback(async (bookmark: Bookmark) => {
    // Record click count & time asynchronously
    fetch(`/api/bookmarks/${bookmark.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lastOpenedAt: new Date().toISOString() })
    }).catch(() => {});

    const result = await openInDefaultBrowser(bookmark.url);
    if (!result.success) {
      showToast('Failed to open link', result.message || 'Check your URL format', 'error');
    }
  }, [showToast]);

  // Export JSON
  const exportData = useCallback(() => {
    const json = JSON.stringify({ bookmarks, collections }, null, 2);
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

  // Import JSON - Disabled/Simplified for MERN stack to avoid bulk overwriting DB easily
  const importData = useCallback(async (jsonString: string) => {
    showToast('Import Not Supported', 'Bulk import is currently disabled in the cloud version.', 'warning');
    return false;
  }, [showToast]);

  const resetToDefaults = useCallback(() => {
    showToast('Action Not Supported', 'Reset to defaults is disabled in the cloud version.', 'warning');
  }, [showToast]);

  const clearAllBookmarks = useCallback(() => {
    showToast('Action Not Supported', 'Bulk delete is disabled in the cloud version.', 'warning');
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
