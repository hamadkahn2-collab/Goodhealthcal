/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CalculatorView } from './components/CalculatorView';
import { LegalPages } from './components/LegalPages';
import { CookieBanner } from './components/CookieBanner';
import { CALCULATORS, SITE_AUTHOR } from './lib/calculators';
import { updateDocumentSeo } from './lib/seo';

export default function App() {
  // Real Path Routing (Zero Hash Fragments)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    // If user arrived with legacy hash, seamlessly migrate to real clean path
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && hash.startsWith('/')) {
        window.history.replaceState({}, '', hash);
        return hash;
      }
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Dark mode state with persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healthcalchub_dark_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Synchronize dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('healthcalchub_dark_mode', String(darkMode));
  }, [darkMode]);

  // Handle browser back and forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Clean real path navigation (HTML5 History API)
  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Dynamic Metadata, Page Titles, OpenGraph, Canonical & Schema.org Graph (10/10 Clean Sync)
  useEffect(() => {
    updateDocumentSeo(currentPath);
  }, [currentPath]);

  // Route Resolver
  let content = null;

  if (currentPath.startsWith('/tools/')) {
    const slug = currentPath.replace('/tools/', '');
    const currentCalc = CALCULATORS.find((c) => c.slug === slug);

    if (currentCalc) {
      content = <CalculatorView calculator={currentCalc} navigate={navigate} />;
    } else {
      content = (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Calculator Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            The requested health calculator does not exist or has been moved.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition-colors min-h-[44px]"
          >
            Return to Calculator Hub
          </button>
        </div>
      );
    }
  } else if (
    ['/about', '/contact', '/privacy', '/terms', '/disclaimer', '/cookies'].includes(
      currentPath
    )
  ) {
    const pageKey = currentPath.replace('/', '') as any;
    content = <LegalPages page={pageKey} navigate={navigate} />;
  } else {
    content = <HomeView navigate={navigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased">
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="flex-1">{content}</main>

      <Footer navigate={navigate} />

      <CookieBanner navigate={navigate} />
    </div>
  );
}
