export interface CustomCollection {
  id: string;
  name: string;
  color: string; // e.g. 'amber', 'emerald', 'sky', 'indigo', 'rose', 'purple', 'teal', 'orange', 'fuchsia', 'lime'
  icon: string; // e.g. 'star', 'briefcase', 'book', 'palette', 'zap', 'flame', etc.
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  name: string;
  url: string;
  domain: string;
  favicon?: string;
  customIconBg?: string;
  tags?: string[];
  isFavorite: boolean;
  collections?: string[]; // Array of CustomCollection IDs
  clickCount?: number;
  lastOpenedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewFilter = 'all' | 'favorites' | 'recent' | 'tag' | 'collection';

export interface PopularWebsite {
  name: string;
  url: string;
  domain: string;
  category: string;
  iconBg: string;
  iconColor?: string;
  initials?: string;
  description?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
