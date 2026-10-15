/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Cookie, X, Check, Shield } from 'lucide-react';

interface CookieBannerProps {
  navigate: (path: string) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [adsAllowed, setAdsAllowed] = useState(true);

  useEffect(() => {
    const savedConsent = localStorage.getItem('healthcalchub_cookie_consent');
    if (!savedConsent) {
      setIsOpen(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      'healthcalchub_cookie_consent',
      JSON.stringify({ essential: true, analytics: true, ads: true, timestamp: Date.now() })
    );
    setIsOpen(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(
      'healthcalchub_cookie_consent',
      JSON.stringify({ essential: true, analytics: false, ads: false, timestamp: Date.now() })
    );
    setIsOpen(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem(
      'healthcalchub_cookie_consent',
      JSON.stringify({
        essential: true,
        analytics: analyticsAllowed,
        ads: adsAllowed,
        timestamp: Date.now()
      })
    );
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-3xl">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              We respect your privacy & data autonomy
            </p>
            <p className="leading-relaxed">
              HealthCalcHub does not collect or transmit your personal biometric calculator inputs — calculations run 100% in your browser. We use necessary cookies for dark mode preferences and standard cookies for Google AdSense and anonymous traffic analytics under GDPR & UK privacy guidelines.
            </p>
            <div className="flex items-center gap-3 pt-0.5 text-[11px]">
              <button
                onClick={() => navigate('/privacy')}
                className="text-teal-600 dark:text-teal-400 underline hover:opacity-80"
              >
                Privacy Policy
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => navigate('/cookies')}
                className="text-teal-600 dark:text-teal-400 underline hover:opacity-80"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0">
          {showCustomize ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Analytics Cookies</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adsAllowed}
                  onChange={(e) => setAdsAllowed(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>AdSense Cookies</span>
              </label>
              <button
                onClick={handleSaveCustom}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                Save Preferences
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowCustomize(true)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Customize
              </button>
              <button
                onClick={handleRejectNonEssential}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                Accept All
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
