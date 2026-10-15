/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Flame,
  Activity,
  Scale,
  PieChart,
  Droplets,
  HeartHandshake,
  Dumbbell,
  HeartPulse,
  Beef,
  Moon,
  TrendingDown,
  Binary,
  Search,
  Lock,
  Zap,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { CALCULATORS, SITE_AUTHOR } from '../lib/calculators';

interface HomeViewProps {
  navigate: (path: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Flame,
  Activity,
  Scale,
  PieChart,
  Droplets,
  HeartHandshake,
  Dumbbell,
  HeartPulse,
  Beef,
  Moon,
  TrendingDown,
  Binary
};

export const HomeView: React.FC<HomeViewProps> = ({ navigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all',
    'Metabolism & Energy',
    'Body Composition',
    'Nutrition',
    'Fitness & Performance',
    'Daily Wellness'
  ];

  const filteredCalculators = useMemo(() => {
    return CALCULATORS.filter((calc) => {
      const matchesSearch =
        calc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calc.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calc.h1.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || calc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-18 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 max-w-4xl mx-auto leading-tight sm:leading-tight">
            Free Health Calculators — Accurate, Private, Instant
          </h1>

          <p className="mt-4 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
            No signup. No email. No tracking. Just answers.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search health calculators (e.g. BMR, TDEE, Body Fat, Macros)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs text-sm min-h-[48px]"
            />
          </div>

          {/* Trust Signals Section */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Lock className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                No signup required
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Immediate access to all tools
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Zap className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                Results instantly
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time calculations
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                Data never leaves your browser
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Client-side execution
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Scale className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                100% free forever
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Independent educational tool
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Calculator Grid Section */}
      <section id="calculators" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Health Calculators
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select a tool to calculate your biometric and nutritional metrics
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[36px] ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'all' ? 'All Tools' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 12 Calculator Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map((calc) => {
            const IconComponent = ICON_MAP[calc.icon] || Activity;
            return (
              <div
                key={calc.id}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/80 dark:hover:border-teal-500/80 shadow-2xs hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200/80 dark:border-teal-800/80 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {calc.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    <a
                      href={`/tools/${calc.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/tools/${calc.slug}`);
                      }}
                      className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    >
                      {calc.title}
                    </a>
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {calc.shortDescription}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Scientific range
                  </span>
                  <a
                    href={`/tools/${calc.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/tools/${calc.slug}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-teal-600 dark:hover:text-white text-xs font-semibold transition-colors min-h-[44px]"
                    aria-label={`Calculate ${calc.title}`}
                  >
                    <span>Calculate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
