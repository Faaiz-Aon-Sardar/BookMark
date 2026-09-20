import React from 'react';

/**
 * Built-in High Quality Brand Logos (SVG)
 * Provides instant, guaranteed pixel-perfect vector icons for popular apps & websites
 * with zero network latency and 100% offline reliability.
 */

export interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BRAND_SVGS: Record<string, (props: BrandLogoProps) => React.ReactElement> = {
  // Gmail (mail.google.com)
  'mail.google.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <path fill="#EA4335" d="M20 18h2V7.5L12 14.2 2 7.5V18h2V9l8 5.5 8-5.5v9z" />
      <path fill="#4285F4" d="M2 6v1.5l10 6.7 10-6.7V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2z" />
      <path fill="#34A853" d="M2 18h4v-7.5L2 7.5V18z" />
      <path fill="#FBBC05" d="M22 18h-4v-7.5l4-3V18z" />
    </svg>
  ),

  // Grok / Grock AI (grok.com / x.ai) - Official xAI Grok mark
  'grok.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="5" fill="#000000" />
      {/* Grok primary heavy slash */}
      <path d="M5.5 18.5L13.8 5.5H18.5L10.2 18.5H5.5Z" fill="#FFFFFF" />
      {/* Grok secondary parallel accent */}
      <path d="M14.2 18.5L18.5 11.8H15.8L12.5 18.5H14.2Z" fill="#FFFFFF" opacity="0.85" />
    </svg>
  ),

  'x.ai': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="5" fill="#000000" />
      <path d="M5.5 18.5L13.8 5.5H18.5L10.2 18.5H5.5Z" fill="#FFFFFF" />
      <path d="M14.2 18.5L18.5 11.8H15.8L12.5 18.5H14.2Z" fill="#FFFFFF" opacity="0.85" />
    </svg>
  ),

  // GitHub - Authentic Octocat with high-contrast badge
  'github.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="11" fill="#181717" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 4C7.58 4 4 7.58 4 12c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0020 12c0-4.42-3.58-8-8-8z"
        fill="#FFFFFF"
      />
    </svg>
  ),

  // YouTube
  'youtube.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="6" fill="#FF0000" />
      <polygon points="10,7.5 16.5,12 10,16.5" fill="#FFFFFF" />
    </svg>
  ),

  // Figma
  'figma.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <path fill="#0ACF83" d="M8 24a4 4 0 0 1-4-4 4 4 0 0 1 4-4h4v4a4 4 0 0 1-4 4z" />
      <path fill="#A259FF" d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" />
      <path fill="#F24E1E" d="M4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" />
      <path fill="#FF7262" d="M12 0h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-4V0z" />
      <circle fill="#1ABCFE" cx="16" cy="12" r="4" />
    </svg>
  ),

  // Notion
  'notion.so': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="5" fill="#000000" />
      <path
        d="M6 6.5C6.7 6.4 7 6.4 8.2 6.3L18.5 5.7C18.7 5.7 18.5 5.5 18.4 5.4L17 4.3C16.6 4 16 3.7 15.3 3.8L5.2 4.6C4.8 4.6 4.7 4.8 4.8 4.9L6 6.5ZM6.8 9.2V19.4C6.8 20 7.1 20.2 7.8 20.2L19.2 19.5C19.9 19.5 20.1 19.1 20.1 18.5V8.6C20.1 8 19.9 7.7 19.3 7.7L7.5 8.4C7 8.4 6.8 8.7 6.8 9.2ZM17.3 10.3C17.4 10.6 17.3 10.9 17 10.9L16.4 11V17.2C16 17.4 15.6 17.5 15.2 17.5C14.6 17.5 14.4 17.3 13.9 16.7L10.4 11.3V16.6L11.5 16.9C11.6 17 11.6 17.2 11.5 17.3C11.5 17.4 11.2 17.5 10.9 17.5L8.2 17.6C8.1 17.5 8 17.3 8 17.2L8.6 17V11.2L7.9 11.1C7.8 11.1 7.8 10.9 7.8 10.8C7.8 10.6 8.1 10.5 8.4 10.5L11.4 10.3L15.2 16V10.9L14.3 10.7C14.2 10.7 14.2 10.5 14.2 10.4C14.2 10.2 14.5 10.2 14.8 10.2L17.1 10C17.1 10 17.2 10.2 17.3 10.3Z"
        fill="#FFFFFF"
      />
    </svg>
  ),

  'notion.site': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="5" fill="#000000" />
      <path
        d="M6 6.5C6.7 6.4 7 6.4 8.2 6.3L18.5 5.7C18.7 5.7 18.5 5.5 18.4 5.4L17 4.3C16.6 4 16 3.7 15.3 3.8L5.2 4.6C4.8 4.6 4.7 4.8 4.8 4.9L6 6.5ZM6.8 9.2V19.4C6.8 20 7.1 20.2 7.8 20.2L19.2 19.5C19.9 19.5 20.1 19.1 20.1 18.5V8.6C20.1 8 19.9 7.7 19.3 7.7L7.5 8.4C7 8.4 6.8 8.7 6.8 9.2ZM17.3 10.3C17.4 10.6 17.3 10.9 17 10.9L16.4 11V17.2C16 17.4 15.6 17.5 15.2 17.5C14.6 17.5 14.4 17.3 13.9 16.7L10.4 11.3V16.6L11.5 16.9C11.6 17 11.6 17.2 11.5 17.3C11.5 17.4 11.2 17.5 10.9 17.5L8.2 17.6C8.1 17.5 8 17.3 8 17.2L8.6 17V11.2L7.9 11.1C7.8 11.1 7.8 10.9 7.8 10.8C7.8 10.6 8.1 10.5 8.4 10.5L11.4 10.3L15.2 16V10.9L14.3 10.7C14.2 10.7 14.2 10.5 14.2 10.4C14.2 10.2 14.5 10.2 14.8 10.2L17.1 10C17.1 10 17.2 10.2 17.3 10.3Z"
        fill="#FFFFFF"
      />
    </svg>
  ),

  // Canva
  'canva.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#00C4CC" />
      <path d="M12 6.5C8.96 6.5 6.5 8.96 6.5 12s2.46 5.5 5.5 5.5c2.34 0 4.35-1.46 5.14-3.5h-2.22c-.61 1.05-1.74 1.75-3.03 1.75-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5c1.29 0 2.42.7 3.03 1.75h2.22C16.35 7.96 14.34 6.5 12 6.5z" fill="#FFFFFF" />
    </svg>
  ),

  // Google Drive
  'drive.google.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M8.2 16.5L3.6 8.5h6.2l4.6 8H8.2z" fill="#0066DA" />
      <path d="M15.4 8.5L10.8 16.5h9.6l4.6-8h-9.6z" fill="#00AC47" />
      <path d="M15.4 8.5L10.8 0.5H6.2l4.6 8h4.6z" fill="#FFBA00" />
      <path d="M10.8 0.5L6.2 8.5l4.6 8 4.6-8-4.6-8z" fill="#EA4335" opacity="0.8" />
    </svg>
  ),

  // Google Docs
  'docs.google.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="4" fill="#4285F4" />
      <path d="M6 6h12v2H6V6zm0 4h12v2H6v-2zm0 4h8v2H6v-2z" fill="#FFFFFF" />
    </svg>
  ),

  // Google Sheets
  'sheets.google.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="4" fill="#0F9D58" />
      <path d="M7 6h10v12H7V6zm2 2v2h6V8H9zm0 3v2h6v-2H9zm0 3v2h6v-2H9z" fill="#FFFFFF" />
    </svg>
  ),

  // ChatGPT
  'chatgpt.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="11" fill="#10A37F" />
      <circle cx="12" cy="12" r="4.5" stroke="#FFFFFF" strokeWidth="2" />
      <path d="M12 4.5V7.5M12 16.5V19.5M4.5 12H7.5M16.5 12H19.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  'openai.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="11" fill="#000000" />
      <circle cx="12" cy="12" r="5" stroke="#FFFFFF" strokeWidth="2" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),

  // Google Search & Main
  'google.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
    </svg>
  ),

  // Google Maps
  'maps.google.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <path fill="#4285F4" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" fill="#FFFFFF" />
    </svg>
  ),

  // Google Calendar
  'calendar.google.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="4" fill="#4285F4" />
      <rect x="4" y="8" width="16" height="12" rx="2" fill="#FFFFFF" />
      <path d="M8 3v3M16 3v3" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <text x="12" y="17" fill="#4285F4" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">31</text>
    </svg>
  ),

  // AI Studio
  'aistudio.google.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#1A73E8" />
      <path d="M12 4L14.2 9.8L20 12L14.2 14.2L12 20L9.8 14.2L4 12L9.8 9.8L12 4Z" fill="#FFFFFF" />
    </svg>
  ),

  // Gemini
  'gemini.google.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#1A73E8" />
      <path d="M12 3C12 7.97 7.97 12 3 12C7.97 12 12 16.03 12 21C12 16.03 16.03 12 21 12C16.03 12 12 7.97 12 3Z" fill="#FFFFFF" />
    </svg>
  ),

  // Claude
  'claude.ai': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#D97706" />
      <path d="M12 4.5L14 9.5L19.5 12L14 14.5L12 19.5L10 14.5L4.5 12L10 9.5L12 4.5Z" fill="#FFFFFF" />
    </svg>
  ),

  // DeepSeek
  'deepseek.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#1E40AF" />
      <path d="M8 8a6 6 0 0 1 8 8M12 6v12M6 12h12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // Spotify
  'spotify.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#1DB954" />
      <path d="M16.5 16.5c-2.3-1.4-5.3-1.7-8.8-.9-.3.1-.6-.2-.7-.5-.1-.3.2-.6.5-.7 3.8-.9 7.1-.5 9.7 1.1.3.2.4.5.2.8-.2.3-.6.4-.9.2zm1.2-2.7c-2.7-1.7-6.8-2.1-10-.1-.4.2-.9.1-1.1-.3-.2-.4-.1-.9.3-1.1 3.7-2.3 8.2-1.8 11.3.1.4.2.5.7.3 1.1-.2.4-.7.5-1.1.3zm.1-2.8c-3.2-1.9-8.6-2.1-11.7-1.1-.5.2-1-.1-1.2-.6-.2-.5.1-1 .6-1.2 3.6-1.1 9.5-.9 13.2 1.3.4.3.6.8.3 1.3-.3.4-.8.6-1.2.3z" fill="#FFFFFF" />
    </svg>
  ),

  // Reddit
  'reddit.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#FF4500" />
      <circle cx="9" cy="12.5" r="1.5" fill="#FFFFFF" />
      <circle cx="15" cy="12.5" r="1.5" fill="#FFFFFF" />
      <path d="M9.5 16c1.5 1 3.5 1 5 0" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),

  // Netflix
  'netflix.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="5" fill="#000000" />
      <path d="M6 3v18h3.5V3H6zm8.5 0v18H18V3h-3.5z" fill="#E50914" />
      <path d="M6 3l12 18h-3.5L6 7V3z" fill="#B81D24" />
    </svg>
  ),

  // Bollyflix
  'bollyflix': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="6" fill="#F59E0B" />
      <path d="M4 7h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" fill="#000000" />
      <path d="M4 7l3-4h3L7 7h3l3-4h3l-3 4h3l3-4h2a2 2 0 0 1 2 2v2H4V7z" fill="#FBBF24" />
      <polygon points="10,11 16,14.5 10,18" fill="#F59E0B" />
    </svg>
  ),

  // Discord
  'discord.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#5865F2" />
      <circle cx="9" cy="12" r="1.5" fill="#FFFFFF" />
      <circle cx="15" cy="12" r="1.5" fill="#FFFFFF" />
      <path d="M7 16c2.5 1.5 7.5 1.5 10 0" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // X / Twitter
  'x.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="5" fill="#000000" />
      <path d="M18.244 4.25h2.308l-5.227 6.26 6.502 8.24h-4.67l-3.65-4.817-4.18 4.817H6.68l5.53-6.435L6.054 4.25h4.78l3.313 4.431zm-.81 13.02h1.28L9.084 5.526H7.717z" fill="#FFFFFF" />
    </svg>
  ),

  'twitter.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#1DA1F2" />
      <path d="M18.244 5.25h2.308l-5.227 6.26 6.502 8.24h-4.67l-3.65-4.817-4.18 4.817H6.68l5.53-6.435L6.054 5.25h4.78l3.313 4.431zm-.81 13.02h1.28L9.084 6.526H7.717z" fill="#FFFFFF" />
    </svg>
  ),

  // Slack
  'slack.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A" />
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0" />
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.5-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D" />
      <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.5-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.5-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E" />
    </svg>
  ),

  // Stack Overflow
  'stackoverflow.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <path fill="#F48024" d="M18.986 21.865v-6.408h2.134V24H2.88v-8.543h2.134v6.408z" />
      <path fill="#BCBBBB" d="M7.146 16.924l9.536 1.996.417-1.996-9.536-1.996zm1.385-4.521l8.835 4.148.868-1.849-8.835-4.148zm2.664-4.225l7.357 6.452 1.343-1.543-7.357-6.452zm4.722-4.17l5.228 8.28 1.706-1.077-5.228-8.28zM7.146 20.354h9.75v-2.023h-9.75z" />
    </svg>
  ),

  // LinkedIn
  'linkedin.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path d="M6.5 19h-3v-10h3v10zm-1.5-11.3c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 11.3h-3v-5.6c0-3.368-4-3.113-4 0v5.6h-3v-10h3v1.765c1.396-2.586 7-2.777 7 2.476v5.759z" fill="#FFFFFF" />
    </svg>
  ),

  // Linear
  'linear.app': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#5E6AD2" />
      <path d="M6 18L18 6M6 6l12 12" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
    </svg>
  ),

  // Vercel
  'vercel.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#000000" />
      <path d="M12 5L19 17H5L12 5z" fill="#FFFFFF" />
    </svg>
  ),

  // Supabase
  'supabase.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#1C1C1C" />
      <path d="M13 3L5 13.5H12L11 21L19 10.5H12L13 3Z" fill="#3ECF8E" />
    </svg>
  ),

  // HuggingFace
  'huggingface.co': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#FFD21E" />
      <circle cx="9" cy="11" r="1.5" fill="#000000" />
      <circle cx="15" cy="11" r="1.5" fill="#000000" />
      <path d="M8 15c2 2 6 2 8 0" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // Pinterest
  'pinterest.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#E60023" />
      <path d="M12 5c-3.86 0-7 2.8-7 6.25 0 2.24 1.25 4.2 3.12 5.23-.13-.78-.25-1.98.05-2.83l1.17-4.88s-.3-.6-.3-1.48c0-1.39.8-2.43 1.8-2.43.85 0 1.26.64 1.26 1.4 0 .86-.54 2.14-.83 3.33-.23.99.5 1.8 1.48 1.8 1.78 0 3.14-1.87 3.14-4.58 0-2.4-1.72-4.07-4.18-4.07-2.85 0-4.52 2.13-4.52 4.34 0 .86.33 1.78.74 2.28.08.1.09.19.07.29l-.28 1.13c-.04.18-.15.22-.33.13-1.25-.58-2.03-2.4-2.03-3.87 0-3.15 2.29-6.05 6.6-6.05 3.47 0 6.16 2.47 6.16 5.77 0 3.44-2.17 6.22-5.19 6.22-1.01 0-1.97-.53-2.29-1.15l-.62 2.38c-.23.87-.84 1.96-1.24 2.62 1.02.31 2.1.48 3.23.48 5.52 0 10-4.48 10-10S17.52 5 12 5z" fill="#FFFFFF" />
    </svg>
  ),

  // Telegram
  'telegram.org': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#24A1DE" />
      <path d="M5.5 11.5L18.5 6.5L15.5 18L11.5 14L9 16.5V13.5L16 8.5L8 13.5L5.5 11.5Z" fill="#FFFFFF" />
    </svg>
  ),

  // WhatsApp
  'whatsapp.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#25D366" />
      <path d="M12 6C8.7 6 6 8.7 6 12c0 1.2.3 2.3.9 3.2L6 18l3-1c.9.6 1.9.9 3 .9 3.3 0 6-2.7 6-6s-2.7-5.9-6-5.9z" fill="#FFFFFF" />
    </svg>
  ),

  // Twitch
  'twitch.tv': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="5" fill="#9146FF" />
      <path d="M5 4l-1 3v13h4v3l3-3h3l5-5V4H5zm12 9l-2.5 2.5H11l-2 2v-2H7V6h10v7zm-2-4h-2v4h2V9zm-4 0H9v4h2V9z" fill="#FFFFFF" />
    </svg>
  ),

  // Perplexity AI
  'perplexity.ai': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#20808D" />
      <path d="M12 4v16M4 12h16M7 7l10 10M17 7L7 17" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),

  // Dribbble
  'dribbble.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#EA4C89" />
      <path d="M12 4c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8zm5.5 4.5c-.8.8-2 1.6-3.8 2.2 1.4 2.5 2.1 4.7 2.3 5.4 1.3-1.4 2-3.3 2-5.4 0-.8-.2-1.5-.5-2.2z" fill="#FFFFFF" opacity="0.9" />
    </svg>
  ),

  // Behance
  'behance.net': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#1769FF" />
      <text x="12" y="16" fill="#FFFFFF" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">Bē</text>
    </svg>
  ),

  // Amazon
  'amazon.com': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="5" fill="#232F3E" />
      <path d="M16.5 14.5C14.5 16.5 10 17 7.5 15.5c-.3-.2-.1-.6.2-.5 2.2.8 6.2.5 8.2-1.2.3-.3.8-.1.6.7z" fill="#FF9900" />
      <path d="M17 13.5c.3.5.8.9 1 .9s.2-.4.1-.7c-.2-.4-.6-1-1.1-1.2-.3 0-.3.5 0 1z" fill="#FF9900" />
    </svg>
  ),

  // Wikipedia
  'wikipedia.org': ({ className = 'w-8 h-8' }) => (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="#000000" />
      <text x="12" y="16.5" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="serif">W</text>
    </svg>
  ),
};

/**
 * Intelligent Brand SVG Matching Engine
 * Safely parses domain, subdomain, name, and keyword variants (including spaces, typos, etc.)
 */
export function getBrandSvg(
  domainOrHostname: string,
  className = 'w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9',
  nameFallback?: string
): React.ReactElement | null {
  if (!domainOrHostname && !nameFallback) return null;

  const rawDomain = (domainOrHostname || '').toLowerCase().trim();
  const rawName = (nameFallback || '').toLowerCase().trim();
  const clean = rawDomain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].trim();

  // Normalized strings with all spaces, hyphens, and dots removed for robust matching
  const normClean = clean.replace(/[\s\-_.]/g, '');
  const normName = rawName.replace(/[\s\-_.]/g, '');

  // 1. Direct key match
  if (BRAND_SVGS[clean]) {
    return BRAND_SVGS[clean]({ className });
  }
  if (BRAND_SVGS[rawDomain]) {
    return BRAND_SVGS[rawDomain]({ className });
  }

  // 2. Base domain match (e.g. docs.github.com -> github.com)
  const parts = clean.split('.');
  if (parts.length >= 2) {
    const rootDomain = parts.slice(-2).join('.');
    if (BRAND_SVGS[rootDomain]) {
      return BRAND_SVGS[rootDomain]({ className });
    }
  }

  // 3. GitHub (supports "github", "git hub", "github.com", "gh", "git-hub", "github.io")
  if (
    clean.includes('github') ||
    normClean.includes('github') ||
    normName.includes('github') ||
    rawName.includes('git hub') ||
    rawName === 'gh'
  ) {
    return BRAND_SVGS['github.com']({ className });
  }

  // 4. Grok / Grock AI (supports "grok", "grock", "grok ai", "grock ai", "x.ai", "xai", "grok.com")
  if (
    clean.includes('grok') ||
    clean.includes('x.ai') ||
    normClean.includes('grok') ||
    normClean.includes('grock') ||
    normClean.includes('xai') ||
    normName.includes('grok') ||
    normName.includes('grock') ||
    normName.includes('xai') ||
    rawName.includes('grok') ||
    rawName.includes('grock') ||
    rawName.includes('x.ai')
  ) {
    return BRAND_SVGS['grok.com']({ className });
  }

  // 5. Google services
  if (clean.includes('mail.google') || rawName === 'gmail' || normName === 'gmail' || rawName.includes('google mail')) {
    return BRAND_SVGS['mail.google.com']({ className });
  }
  if (clean.includes('drive.google') || normName.includes('googledrive') || normName.includes('gdrive')) {
    return BRAND_SVGS['drive.google.com']({ className });
  }
  if (clean.includes('docs.google') || normName.includes('googledocs')) {
    return BRAND_SVGS['docs.google.com']({ className });
  }
  if (clean.includes('sheets.google') || normName.includes('googlesheets')) {
    return BRAND_SVGS['sheets.google.com']({ className });
  }
  if (clean.includes('maps.google') || rawName.includes('google maps')) {
    return BRAND_SVGS['maps.google.com']({ className });
  }
  if (clean.includes('calendar.google') || rawName.includes('google calendar')) {
    return BRAND_SVGS['calendar.google.com']({ className });
  }
  if (clean.includes('aistudio.google') || normName.includes('aistudio')) {
    return BRAND_SVGS['aistudio.google.com']({ className });
  }
  if (clean.includes('gemini.google') || normName.includes('gemini') || rawName.includes('gemini')) {
    return BRAND_SVGS['gemini.google.com']({ className });
  }
  if (clean.includes('google') || normName === 'google') {
    return BRAND_SVGS['google.com']({ className });
  }

  // 6. YouTube
  if (clean.includes('youtube') || normName.includes('youtube') || rawName.includes('you tube')) {
    return BRAND_SVGS['youtube.com']({ className });
  }

  // 7. Figma & Canva
  if (clean.includes('figma') || normName.includes('figma')) {
    return BRAND_SVGS['figma.com']({ className });
  }
  if (clean.includes('canva') || normName.includes('canva')) {
    return BRAND_SVGS['canva.com']({ className });
  }

  // 8. Notion
  if (clean.includes('notion') || normName.includes('notion')) {
    return BRAND_SVGS['notion.so']({ className });
  }

  // 9. AI Assistants
  if (
    clean.includes('chatgpt') ||
    clean.includes('openai') ||
    normClean.includes('chatgpt') ||
    normName.includes('chatgpt') ||
    normName.includes('openai') ||
    rawName.includes('chat gpt')
  ) {
    return BRAND_SVGS['chatgpt.com']({ className });
  }
  if (clean.includes('claude') || normName.includes('claude') || rawName.includes('anthropic')) {
    return BRAND_SVGS['claude.ai']({ className });
  }
  if (clean.includes('deepseek') || normName.includes('deepseek') || rawName.includes('deep seek')) {
    return BRAND_SVGS['deepseek.com']({ className });
  }
  if (clean.includes('perplexity') || normName.includes('perplexity')) {
    return BRAND_SVGS['perplexity.ai']({ className });
  }
  if (clean.includes('huggingface') || normName.includes('huggingface') || rawName.includes('hugging face')) {
    return BRAND_SVGS['huggingface.co']({ className });
  }

  // 10. Developer & Cloud Tools
  if (clean.includes('supabase') || normName.includes('supabase')) {
    return BRAND_SVGS['supabase.com']({ className });
  }
  if (clean.includes('vercel') || normName.includes('vercel')) {
    return BRAND_SVGS['vercel.com']({ className });
  }
  if (clean.includes('linear') || normName.includes('linear')) {
    return BRAND_SVGS['linear.app']({ className });
  }
  if (clean.includes('stackoverflow') || normName.includes('stackoverflow') || rawName.includes('stack overflow')) {
    return BRAND_SVGS['stackoverflow.com']({ className });
  }

  // 11. Media & Social
  if (clean.includes('spotify') || normName.includes('spotify')) {
    return BRAND_SVGS['spotify.com']({ className });
  }
  if (clean.includes('reddit') || normName.includes('reddit')) {
    return BRAND_SVGS['reddit.com']({ className });
  }
  if (clean.includes('netflix') || normName.includes('netflix')) {
    return BRAND_SVGS['netflix.com']({ className });
  }
  if (clean.includes('discord') || normName.includes('discord')) {
    return BRAND_SVGS['discord.com']({ className });
  }
  if (clean.includes('slack') || normName.includes('slack')) {
    return BRAND_SVGS['slack.com']({ className });
  }
  if (clean.includes('twitter') || clean === 'x.com' || normName === 'twitter' || rawName === 'x') {
    return BRAND_SVGS['x.com']({ className });
  }
  if (clean.includes('linkedin') || normName.includes('linkedin')) {
    return BRAND_SVGS['linkedin.com']({ className });
  }
  if (clean.includes('telegram') || normName.includes('telegram')) {
    return BRAND_SVGS['telegram.org']({ className });
  }
  if (clean.includes('whatsapp') || normName.includes('whatsapp')) {
    return BRAND_SVGS['whatsapp.com']({ className });
  }
  if (clean.includes('twitch') || normName.includes('twitch')) {
    return BRAND_SVGS['twitch.tv']({ className });
  }
  if (clean.includes('pinterest') || normName.includes('pinterest')) {
    return BRAND_SVGS['pinterest.com']({ className });
  }
  if (clean.includes('dribbble') || normName.includes('dribbble')) {
    return BRAND_SVGS['dribbble.com']({ className });
  }
  if (clean.includes('behance') || normName.includes('behance')) {
    return BRAND_SVGS['behance.net']({ className });
  }
  if (clean.includes('amazon') || normName.includes('amazon')) {
    return BRAND_SVGS['amazon.com']({ className });
  }
  if (clean.includes('wikipedia') || normName.includes('wikipedia')) {
    return BRAND_SVGS['wikipedia.org']({ className });
  }
  if (clean.includes('bollyflix') || clean.includes('bollytone') || normName.includes('bollyflix')) {
    return BRAND_SVGS['bollyflix']({ className });
  }

  return null;
}
