import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Ensure window.fetch has a setter in sandboxed iframes to prevent third-party scripts (like AdSense/AdMob)
// from throwing "TypeError: Cannot set property fetch of #<Window> which has only a getter"
try {
  if (typeof window !== 'undefined' && 'fetch' in window) {
    const originalFetch = window.fetch ? window.fetch.bind(window) : undefined;
    let currentFetch = originalFetch;

    // Check if fetch descriptor on window or prototype lacks a setter
    let proto: unknown = window;
    let desc: PropertyDescriptor | undefined;
    while (proto && !desc) {
      desc = Object.getOwnPropertyDescriptor(proto, 'fetch');
      proto = Object.getPrototypeOf(proto);
    }

    if (!desc || (!desc.writable && !desc.set)) {
      Object.defineProperty(window, 'fetch', {
        configurable: true,
        enumerable: true,
        get() {
          return currentFetch;
        },
        set(newFetch) {
          currentFetch = newFetch;
        },
      });
    }
  }
} catch {
  // Ignore property definition errors in restricted environments
}

// Global safety listener to catch benign third-party ad script notices
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event.message &&
      (event.message.includes('adsbygoogle') ||
        event.message.includes('TagError') ||
        event.message.includes('Cannot set property fetch'))
    ) {
      event.preventDefault();
    }
  });
}

// Safely register service worker when supported
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  try {
    registerSW({
      immediate: true,
      onNeedRefresh() {
        window.location.reload();
      },
    });
  } catch {
    // ignore
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

