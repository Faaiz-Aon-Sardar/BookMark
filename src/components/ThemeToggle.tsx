import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  className = '',
  showLabel = false,
}) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black font-black text-xs transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none select-none ${
        isDark
          ? 'bg-neutral-800 text-amber-300 shadow-[2px_2px_0px_0px_#F59E0B] hover:bg-neutral-700'
          : 'bg-amber-100 text-black shadow-[2px_2px_0px_0px_#000] hover:bg-amber-200'
      } ${showLabel ? 'px-3 py-2 w-full justify-between' : 'w-9 h-9'} ${className}`}
    >
      <div className="flex items-center gap-2">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-300 stroke-[2.5]" />
        ) : (
          <Moon className="w-4 h-4 text-black stroke-[2.5]" />
        )}
        {showLabel && (
          <span className="font-black text-xs">
            {isDark ? 'Light Theme' : 'Dark Theme'}
          </span>
        )}
      </div>

      {showLabel && (
        <span
          className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded border border-black ${
            isDark ? 'bg-amber-300 text-black' : 'bg-black text-white'
          }`}
        >
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};
