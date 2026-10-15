/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { SITE_AUTHOR } from '../lib/calculators';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Prominent Author Information */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-teal-600 dark:text-teal-400">
                Author & Site Operator
              </p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {SITE_AUTHOR.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {SITE_AUTHOR.byline} · Based in {SITE_AUTHOR.location}. Free educational health calculators for users worldwide.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 dark:text-slate-300">
              <a
                href={`mailto:${SITE_AUTHOR.email}`}
                className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{SITE_AUTHOR.email}</span>
              </a>
              <a
                href={`tel:${SITE_AUTHOR.phone}`}
                className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{SITE_AUTHOR.phone}</span>
              </a>
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{SITE_AUTHOR.location}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 4-Column Grid: Brand, Core Tools, Secondary Tools, Legal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-200 dark:border-slate-800 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                H
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                HealthCalc<span className="text-teal-600 dark:text-teal-400">Hub</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Free, accurate, private, and instant health calculations running client-side in your browser. No signup, no email, no tracking.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm">
              Metabolism & Body
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="/tools/bmr-calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tools/bmr-calculator');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  BMR Calculator
                </a>
              </li>
              <li>
                <a
                  href="/tools/tdee-calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tools/tdee-calculator');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  TDEE Calculator
                </a>
              </li>
              <li>
                <a
                  href="/tools/body-fat-calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tools/body-fat-calculator');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Body Fat Calculator
                </a>
              </li>
              <li>
                <a
                  href="/tools/ideal-weight-calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tools/ideal-weight-calculator');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Ideal Weight Calculator
                </a>
              </li>
              <li>
                <a
                  href="/tools/bmi-calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tools/bmi-calculator');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  BMI Calculator
                </a>
              </li>
              <li>
                <a
                  href="/tools/calorie-deficit-calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tools/calorie-deficit-calculator');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Calorie Deficit Calculator
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm">
              Nutrition & Performance
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="/tools/macro-calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tools/macro-calculator');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Macro Split Calculator
                </a>
              </li>
              <li>
                <a
                  href="/tools/protein-intake-calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tools/protein-intake-calculator');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Protein Intake Calculator
                </a>
              </li>
              <li>
                <a
                  href="/tools/water-intake-calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tools/water-intake-calculator');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Water Intake Calculator
                </a>
              </li>
              <li>
                <a
                  href="/tools/one-rep-max-calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tools/one-rep-max-calculator');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  One Rep Max (1RM)
                </a>
              </li>
              <li>
                <a
                  href="/tools/heart-rate-zone-calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tools/heart-rate-zone-calculator');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Heart Rate Zone Calculator
                </a>
              </li>
              <li>
                <a
                  href="/tools/sleep-calculator"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tools/sleep-calculator');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Sleep Calculator
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/about');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  About HealthCalcHub
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/privacy');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/terms');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/disclaimer');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Health Disclaimer
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/contact');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/cookies');
                  }}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Medical Notice */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} HealthCalcHub. HAMAD KHAN | hamadkahn2@gmail.com | +923175698828 | Pakistan.
          </p>
          <p className="text-center md:text-right max-w-xl text-[11px] leading-relaxed">
            Not Medical Advice: The calculators on HealthCalcHub are for educational and informational purposes only. Always consult a qualified physician or healthcare provider for medical diagnosis and treatment.
          </p>
        </div>
      </div>
    </footer>
  );
};
