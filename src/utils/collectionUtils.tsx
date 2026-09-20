import React from 'react';
import {
  Star,
  Sparkles,
  Flame,
  Briefcase,
  Coffee,
  Zap,
  Bookmark as BookmarkIcon,
  Music,
  Compass,
  Shield,
  Target,
  Folder,
  Code,
  BookOpen,
  Heart,
  Eye,
  Laptop,
  Palette,
  Terminal,
  ShoppingBag,
  Film,
  Rocket,
  Trophy,
  CheckCircle2,
  Cpu,
  Layers,
} from 'lucide-react';
import { CustomCollection } from '../types/bookmark';

export interface CollectionColorDef {
  id: string;
  name: string;
  bg: string;
  bgActive: string;
  badgeBg: string;
  text: string;
  border: string;
  shadow: string;
  previewBg: string;
}

export const COLLECTION_COLORS: Record<string, CollectionColorDef> = {
  amber: {
    id: 'amber',
    name: 'Amber Gold',
    bg: 'bg-amber-100 dark:bg-amber-950/40',
    bgActive: 'bg-amber-300 dark:bg-amber-400 text-black',
    badgeBg: 'bg-amber-300 text-black',
    text: 'text-amber-900 dark:text-amber-300',
    border: 'border-black dark:border-white/40',
    shadow: '#F59E0B',
    previewBg: 'bg-amber-400',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Green',
    bg: 'bg-emerald-100 dark:bg-emerald-950/40',
    bgActive: 'bg-emerald-400 text-black',
    badgeBg: 'bg-emerald-300 text-black',
    text: 'text-emerald-900 dark:text-emerald-300',
    border: 'border-black dark:border-white/40',
    shadow: '#10B981',
    previewBg: 'bg-emerald-400',
  },
  sky: {
    id: 'sky',
    name: 'Sky Blue',
    bg: 'bg-sky-100 dark:bg-sky-950/40',
    bgActive: 'bg-sky-400 text-black',
    badgeBg: 'bg-sky-300 text-black',
    text: 'text-sky-900 dark:text-sky-300',
    border: 'border-black dark:border-white/40',
    shadow: '#0EA5E9',
    previewBg: 'bg-sky-400',
  },
  indigo: {
    id: 'indigo',
    name: 'Indigo Blue',
    bg: 'bg-indigo-100 dark:bg-indigo-950/40',
    bgActive: 'bg-indigo-500 text-white',
    badgeBg: 'bg-indigo-500 text-white',
    text: 'text-indigo-900 dark:text-indigo-300',
    border: 'border-black dark:border-white/40',
    shadow: '#6366F1',
    previewBg: 'bg-indigo-500',
  },
  rose: {
    id: 'rose',
    name: 'Rose Pink',
    bg: 'bg-rose-100 dark:bg-rose-950/40',
    bgActive: 'bg-rose-400 text-black',
    badgeBg: 'bg-rose-300 text-black',
    text: 'text-rose-900 dark:text-rose-300',
    border: 'border-black dark:border-white/40',
    shadow: '#F43F5E',
    previewBg: 'bg-rose-400',
  },
  purple: {
    id: 'purple',
    name: 'Electric Purple',
    bg: 'bg-purple-100 dark:bg-purple-950/40',
    bgActive: 'bg-purple-400 text-black',
    badgeBg: 'bg-purple-300 text-black',
    text: 'text-purple-900 dark:text-purple-300',
    border: 'border-black dark:border-white/40',
    shadow: '#A855F7',
    previewBg: 'bg-purple-400',
  },
  orange: {
    id: 'orange',
    name: 'Sunset Orange',
    bg: 'bg-orange-100 dark:bg-orange-950/40',
    bgActive: 'bg-orange-400 text-black',
    badgeBg: 'bg-orange-300 text-black',
    text: 'text-orange-900 dark:text-orange-300',
    border: 'border-black dark:border-white/40',
    shadow: '#F97316',
    previewBg: 'bg-orange-400',
  },
  teal: {
    id: 'teal',
    name: 'Teal Green',
    bg: 'bg-teal-100 dark:bg-teal-950/40',
    bgActive: 'bg-teal-400 text-black',
    badgeBg: 'bg-teal-300 text-black',
    text: 'text-teal-900 dark:text-teal-300',
    border: 'border-black dark:border-white/40',
    shadow: '#14B8A6',
    previewBg: 'bg-teal-400',
  },
  fuchsia: {
    id: 'fuchsia',
    name: 'Fuchsia Neon',
    bg: 'bg-fuchsia-100 dark:bg-fuchsia-950/40',
    bgActive: 'bg-fuchsia-400 text-black',
    badgeBg: 'bg-fuchsia-300 text-black',
    text: 'text-fuchsia-900 dark:text-fuchsia-300',
    border: 'border-black dark:border-white/40',
    shadow: '#D946EF',
    previewBg: 'bg-fuchsia-400',
  },
  lime: {
    id: 'lime',
    name: 'Lime Zing',
    bg: 'bg-lime-100 dark:bg-lime-950/40',
    bgActive: 'bg-lime-400 text-black',
    badgeBg: 'bg-lime-300 text-black',
    text: 'text-lime-900 dark:text-lime-300',
    border: 'border-black dark:border-white/40',
    shadow: '#84CC16',
    previewBg: 'bg-lime-400',
  },
};

export const COLLECTION_ICONS: Array<{ id: string; label: string; icon: React.FC<{ className?: string }> }> = [
  { id: 'star', label: 'Star', icon: Star },
  { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { id: 'flame', label: 'Flame / Hot', icon: Flame },
  { id: 'briefcase', label: 'Work', icon: Briefcase },
  { id: 'coffee', label: 'Daily / Coffee', icon: Coffee },
  { id: 'zap', label: 'Quick / Zap', icon: Zap },
  { id: 'bookmark', label: 'Bookmark', icon: BookmarkIcon },
  { id: 'book', label: 'Reading', icon: BookOpen },
  { id: 'palette', label: 'Design', icon: Palette },
  { id: 'code', label: 'Code / Dev', icon: Code },
  { id: 'terminal', label: 'Tech', icon: Terminal },
  { id: 'laptop', label: 'Productivity', icon: Laptop },
  { id: 'rocket', label: 'Projects', icon: Rocket },
  { id: 'trophy', label: 'Top Picks', icon: Trophy },
  { id: 'shopping-bag', label: 'Shopping', icon: ShoppingBag },
  { id: 'music', label: 'Audio / Music', icon: Music },
  { id: 'film', label: 'Media / Video', icon: Film },
  { id: 'compass', label: 'Explore', icon: Compass },
  { id: 'shield', label: 'Security', icon: Shield },
  { id: 'target', label: 'Focus / Goal', icon: Target },
  { id: 'folder', label: 'Archive', icon: Folder },
  { id: 'cpu', label: 'AI & Hardware', icon: Cpu },
  { id: 'layers', label: 'General', icon: Layers },
];

export const INITIAL_CUSTOM_COLLECTIONS: CustomCollection[] = [
  {
    id: 'col-work',
    name: 'Work Essentials',
    icon: 'briefcase',
    color: 'indigo',
    description: 'Tools, dashboards, and portals for daily work.',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'col-reading',
    name: 'Must Read & Research',
    icon: 'book',
    color: 'amber',
    description: 'Articles, blogs, documentation, and references.',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'col-creative',
    name: 'Design & Inspiration',
    icon: 'palette',
    color: 'rose',
    description: 'Creative inspiration, assets, and design tools.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export function getCollectionColor(colorId?: string): CollectionColorDef {
  if (colorId && COLLECTION_COLORS[colorId]) {
    return COLLECTION_COLORS[colorId];
  }
  return COLLECTION_COLORS.amber;
}

export function renderCollectionIcon(iconId?: string, className: string = 'w-4 h-4') {
  const found = COLLECTION_ICONS.find((i) => i.id === iconId);
  const IconComp = found ? found.icon : Star;
  return <IconComp className={className} />;
}
