/**
 * Desktop Launcher utility
 * Opens URLs in default browser when running in Tauri 2 or standard web environment
 */

import { formatUrlForInput, isValidUrl } from './urlUtils';

export function isTauriEnvironment(): boolean {
  return typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
}

export async function openInDefaultBrowser(rawUrl: string): Promise<{ success: boolean; message?: string }> {
  if (!isValidUrl(rawUrl)) {
    return { success: false, message: 'Invalid URL format' };
  }

  const targetUrl = formatUrlForInput(rawUrl);

  try {
    // If running in Tauri 2, attempt to use the Tauri opener plugin
    if (isTauriEnvironment()) {
      try {
        const opener = (window as unknown as { __TAURI__?: { opener?: { openUrl: (url: string) => Promise<void> } } }).__TAURI__?.opener;
        if (opener && typeof opener.openUrl === 'function') {
          await opener.openUrl(targetUrl);
          return { success: true };
        }
        
        const core = (window as unknown as { __TAURI__?: { core?: { invoke: (cmd: string, args: unknown) => Promise<unknown> } } }).__TAURI__?.core;
        if (core && typeof core.invoke === 'function') {
          await core.invoke('plugin:opener|open_url', { url: targetUrl });
          return { success: true };
        }
      } catch (tauriError) {
        console.warn('Tauri openUrl error, falling back to browser window.open:', tauriError);
      }
    }

    // Standard web browser method using a dynamic anchor element for maximum compatibility
    const link = document.createElement('a');
    link.href = targetUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true };
  } catch (error) {
    console.error('Failed to open URL:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}
