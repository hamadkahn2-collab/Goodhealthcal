// Compatibility safeguard for browser extensions overriding window.fetch
try {
  if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    let activeFetch = originalFetch ? originalFetch.bind(window) : undefined;
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get() {
        return activeFetch;
      },
      set(fn) {
        activeFetch = fn;
      }
    });
  }
} catch (e) {
  // Silent fallback
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
