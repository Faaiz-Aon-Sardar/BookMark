import React, { useState, useEffect, useMemo } from 'react';
import {
  getFaviconCandidates,
  getInitials,
  getInitialColor,
  extractHostname,
} from '../utils/faviconUtils';
import { getBrandSvg } from '../utils/brandIcons';

export interface WebsiteLogoProps {
  domain?: string;
  url?: string;
  name?: string;
  favicon?: string;
  iconBg?: string;
  iconColor?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  hoverEffect?: boolean;
}

export const WebsiteLogo: React.FC<WebsiteLogoProps> = ({
  domain = '',
  url = '',
  name = '',
  favicon,
  iconBg,
  iconColor,
  initials: customInitials,
  size = 'md',
  className = '',
  hoverEffect = false,
}) => {
  const [candidateIndex, setCandidateIndex] = useState<number>(0);

  const hostname = useMemo(() => {
    return extractHostname(url || domain || '');
  }, [url, domain]);

  // Generate candidate favicon sources
  const candidateList = useMemo(() => {
    const list: string[] = [];
    if (favicon && favicon.trim()) {
      list.push(favicon.trim());
    }
    if (url || domain) {
      const generated = getFaviconCandidates(url || domain);
      generated.forEach((cand) => {
        if (!list.includes(cand)) {
          list.push(cand);
        }
      });
    }
    return list;
  }, [url, domain, favicon]);

  // Reset candidate index when inputs change
  useEffect(() => {
    setCandidateIndex(0);
  }, [url, domain, favicon]);

  const brandSvg = getBrandSvg(
    hostname || domain,
    size === 'xs'
      ? 'w-4 h-4'
      : size === 'sm'
      ? 'w-5 h-5'
      : size === 'md'
      ? 'w-7 h-7'
      : size === 'lg'
      ? 'w-8 h-8 sm:w-9 sm:h-9'
      : 'w-10 h-10',
    name
  );

  const bgHue = iconBg || getInitialColor(hostname || name || 'site');
  const displayInitials = customInitials || getInitials(name, hostname || domain);

  // Size specifications
  const sizeClasses = {
    xs: 'w-6 h-6 rounded-md text-[10px]',
    sm: 'w-8 h-8 rounded-lg text-xs',
    md: 'w-10 h-10 rounded-xl text-sm',
    lg: 'w-13 h-13 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-2xl text-base sm:text-lg',
    xl: 'w-16 h-16 rounded-2xl text-xl',
  }[size];

  const imgSizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10',
    xl: 'w-11 h-11',
  }[size];

  const currentSrc = candidateIndex < candidateList.length ? candidateList[candidateIndex] : null;

  return (
    <div
      className={`relative border-2 border-black dark:border-white/40 flex items-center justify-center overflow-hidden shrink-0 shadow-[1.5px_1.5px_0px_0px_#000] dark:shadow-[1.5px_1.5px_0px_0px_#FFF] transition-all duration-150 select-none ${sizeClasses} ${
        hoverEffect ? 'group-hover:scale-105 group-hover:rotate-1' : ''
      } ${className}`}
      style={{
        backgroundColor: bgHue,
        color: iconColor || '#000000',
      }}
      title={name || hostname || domain || 'Website Logo'}
    >
      {brandSvg ? (
        <div className="flex items-center justify-center p-0.5">{brandSvg}</div>
      ) : currentSrc ? (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={`${name || hostname || domain} logo`}
          className={`${imgSizeClasses} object-contain drop-shadow-xs transition-opacity duration-150`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onError={() => {
            setCandidateIndex((prev) => prev + 1);
          }}
        />
      ) : (
        <span className="font-black tracking-tight uppercase leading-none font-mono">
          {displayInitials}
        </span>
      )}
    </div>
  );
};
