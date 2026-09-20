import React, { useState, useEffect } from 'react';
import {
  X,
  Monitor,
  Download,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Sparkles,
  ArrowRight,
  FileCode,
} from 'lucide-react';
import { isTauriEnvironment } from '../utils/desktopLauncher';

interface WindowsPackagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportBackup: () => void;
  deferredPrompt?: any;
  onTriggerPwaInstall?: () => void;
}

export const WindowsPackagingModal: React.FC<WindowsPackagingModalProps> = ({
  isOpen,
  onClose,
  onExportBackup,
  deferredPrompt,
  onTriggerPwaInstall,
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [downloadedShortcut, setDownloadedShortcut] = useState<boolean>(false);
  const isTauri = isTauriEnvironment();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  /**
   * Generates a 1-click Windows Desktop Launcher (.bat) that opens the app in app-window mode
   */
  const handleDownloadWindowsShortcut = () => {
    const currentUrl = window.location.href;
    const batchContent = `@echo off
:: Bookmark Launcher Desktop Launcher
title Bookmark Launcher
echo Launching Bookmark Launcher in dedicated desktop window...

:: Try Google Chrome App Mode
start "" chrome.exe --app="${currentUrl}" --start-maximized 2>nul
if %errorlevel% equ 0 exit

:: Try Microsoft Edge App Mode
start "" msedge.exe --app="${currentUrl}" --start-maximized 2>nul
if %errorlevel% equ 0 exit

:: Try Default Browser
start "" "${currentUrl}"
exit
`;

    const blob = new Blob([batchContent], { type: 'application/x-bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Launch-Bookmark-App.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadedShortcut(true);
    setTimeout(() => setDownloadedShortcut(false), 4000);
  };

  /**
   * Generates a Windows Internet Shortcut (.url)
   */
  const handleDownloadUrlShortcut = () => {
    const currentUrl = window.location.href;
    const urlContent = `[InternetShortcut]
URL=${currentUrl}
IconIndex=0
HotKey=0
IDList=
[{000214A0-0000-0000-C000-000000000046}]
Prop3=19,11
`;
    const blob = new Blob([urlContent], { type: 'application/internet-shortcut' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Bookmark Launcher.url';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="windows-packaging-title"
    >
      <div
        className="bg-white dark:bg-neutral-900 border-3 sm:border-4 border-black dark:border-white rounded-2xl w-full max-w-xl max-h-[92dvh] flex flex-col shadow-[8px_8px_0px_0px_#000] dark:shadow-[8px_8px_0px_0px_#FFF] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b-2 sm:border-b-3 border-black dark:border-white/40 bg-cyan-300 dark:bg-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-cyan-300 dark:bg-white dark:text-black flex items-center justify-center font-black border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000]">
              <Monitor className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 id="windows-packaging-title" className="text-base sm:text-lg font-black text-black dark:text-white leading-tight">
                Install &amp; Download Desktop App
              </h2>
              <p className="text-xs text-black/80 dark:text-white/80 font-bold">
                Run as a standalone app on your Windows / Mac laptop
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm text-black dark:text-white overscroll-contain">
          {/* 1-CLICK PWA INSTALL (Primary) */}
          <div className="p-4 rounded-xl border-2 border-black dark:border-white/30 bg-amber-100 dark:bg-neutral-800 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFF] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-black dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-[2.5]" />
                <span>Method 1: Install into Windows Taskbar &amp; Desktop</span>
              </span>
              <span className="text-[11px] font-bold bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-md">
                Recommended
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-neutral-300 font-medium leading-relaxed">
              Installs this app directly into your Windows Start Menu and Taskbar with its own standalone window without address bars.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {deferredPrompt && onTriggerPwaInstall ? (
                <button
                  type="button"
                  onClick={onTriggerPwaInstall}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-2 cursor-pointer text-xs"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Click to Install App on Laptop Now</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleDownloadWindowsShortcut}
                className="px-4 py-2.5 bg-cyan-300 hover:bg-cyan-400 text-black font-black rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-2 cursor-pointer text-xs"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>{downloadedShortcut ? '✓ Downloaded .bat Launcher!' : 'Download 1-Click Desktop Launcher (.bat)'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadUrlShortcut}
                className="px-3 py-2 bg-white dark:bg-neutral-700 hover:bg-slate-100 font-bold rounded-xl border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Download .url Shortcut</span>
              </button>
            </div>
          </div>

          {/* CHROME / EDGE 3-DOT INSTRUCTIONS */}
          <div className="p-4 rounded-xl border-2 border-black dark:border-white/30 bg-slate-50 dark:bg-neutral-850 shadow-[2px_2px_0px_0px_#000] space-y-2.5">
            <h4 className="font-black text-xs uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
              <span>How to install via Chrome or Edge Menu:</span>
            </h4>

            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 dark:text-neutral-300 font-medium">
              <li>
                Click the <strong>three dots</strong> (<code className="font-bold font-mono">⋮</code>) in the top-right corner of your browser.
              </li>
              <li>
                Hover over <strong>&ldquo;Save and share&rdquo;</strong> (or <strong>&ldquo;Apps&rdquo;</strong>).
              </li>
              <li>
                Click <strong>&ldquo;Install page as app...&rdquo;</strong> (or <strong>&ldquo;Create shortcut...&rdquo;</strong> $\rightarrow$ check <strong>&ldquo;Open as window&rdquo;</strong>).
              </li>
              <li>
                Click <strong>Install</strong>. Done! It now runs like a desktop app.
              </li>
            </ol>
          </div>

          {/* TAURI BUILD TERMINAL COMMANDS (FOR DEVELOPERS) */}
          <div className="p-4 rounded-xl border-2 border-black dark:border-white/30 bg-white dark:bg-neutral-850 shadow-[2px_2px_0px_0px_#000] space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-xs uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Method 2: Standalone .EXE Build (Tauri)</span>
              </h4>
            </div>

            <p className="text-xs text-slate-600 dark:text-neutral-400">
              To build a native Windows installer (<code className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">.exe / .msi</code>):
            </p>

            <div className="p-3 bg-neutral-900 text-emerald-400 font-mono text-xs rounded-xl border-2 border-black flex items-center justify-between">
              <code>npm run tauri build</code>
              <button
                type="button"
                onClick={() => copyToClipboard('npm run tauri build', 'tauri-build')}
                className="text-white hover:text-cyan-300 p-1 cursor-pointer"
                title="Copy build command"
              >
                {copied === 'tauri-build' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-black dark:border-white/30 bg-slate-50 dark:bg-neutral-800/80 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onExportBackup}
            className="px-3.5 py-2 text-xs font-black bg-white dark:bg-neutral-700 hover:bg-slate-100 text-black dark:text-white rounded-xl border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup Data (JSON)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
