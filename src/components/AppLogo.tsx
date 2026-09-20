import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base font-black',
    lg: 'text-lg font-black',
    xl: 'text-xl font-black',
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Bold Playful Neo-Brutalist Launcher Icon */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-amber-400 border-2 border-black text-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#FFF] shrink-0 transition-transform active:translate-x-0.5 active:translate-y-0.5 group-hover:rotate-2`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-black"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" fill="#FF4081" />
          <path d="M12 7v5" stroke="currentColor" strokeWidth="2.5" />
          <path d="M9.5 9.5l2.5-2.5 2.5 2.5" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      </div>

      {showText && (
        <div className="leading-none">
          <span className={`tracking-tight text-black dark:text-white font-black ${textSizes[size]}`}>
            Bookmark<span className="text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-1 py-0.5 rounded-md border border-black dark:border-white/40 ml-1 shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#FFF]">Launcher</span>
          </span>
        </div>
      )}
    </div>
  );
};
