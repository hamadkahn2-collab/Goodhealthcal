/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  navigate,
  darkMode,
  setDarkMode
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single element, no attached pills or taglines) */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="text-xl font-bold tracking-tight text-teal-700 dark:text-teal-400 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 flex items-center gap-2"
          aria-label="HealthCalcHub Home"
        >
          <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-base shadow-xs">
            H
          </span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">
            HealthCalc<span className="text-teal-600 dark:text-teal-400">Hub</span>
          </span>
        </a>

        {/* Zone 2: Navigation Links (4 clean single-line text links) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className={`transition-colors hover:text-teal-600 dark:hover:text-teal-400 whitespace-nowrap shrink-0 ${
              currentPath === '/' ? 'text-teal-600 dark:text-teal-400 font-semibold' : ''
            }`}
          >
            All Calculators
          </a>
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              navigate('/about');
            }}
            className={`transition-colors hover:text-teal-600 dark:hover:text-teal-400 whitespace-nowrap shrink-0 ${
              currentPath === '/about' ? 'text-teal-600 dark:text-teal-400 font-semibold' : ''
            }`}
          >
            About
          </a>
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              navigate('/contact');
            }}
            className={`transition-colors hover:text-teal-600 dark:hover:text-teal-400 whitespace-nowrap shrink-0 ${
              currentPath === '/contact' ? 'text-teal-600 dark:text-teal-400 font-semibold' : ''
            }`}
          >
            Contact
          </a>
          <a
            href="/disclaimer"
            onClick={(e) => {
              e.preventDefault();
              navigate('/disclaimer');
            }}
            className={`transition-colors hover:text-teal-600 dark:hover:text-teal-400 whitespace-nowrap shrink-0 ${
              currentPath === '/disclaimer' ? 'text-teal-600 dark:text-teal-400 font-semibold' : ''
            }`}
          >
            Medical Disclaimer
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action (Dark Mode Toggle) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
