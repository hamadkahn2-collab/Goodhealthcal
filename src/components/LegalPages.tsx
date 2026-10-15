/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldAlert, FileText, HeartPulse } from 'lucide-react';
import { SITE_AUTHOR } from '../lib/calculators';

interface LegalPageProps {
  page: 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | 'cookies';
  navigate: (path: string) => void;
}

export const LegalPages: React.FC<LegalPageProps> = ({ page, navigate }) => {
  const currentDate = 'October 12, 2026';

  // Contact Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) return;

    // Direct client fallback to mailto
    const mailtoUrl = `mailto:${SITE_AUTHOR.email}?subject=${encodeURIComponent(
      formSubject || 'Inquiry from HealthCalcHub'
    )}&body=${encodeURIComponent(
      `From: ${formName} (${formEmail})\n\nMessage:\n${formMessage}`
    )}`;
    window.location.href = mailtoUrl;
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-8" aria-label="Breadcrumb">
        <button onClick={() => navigate('/')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-slate-100 font-medium capitalize">
          {page === 'about' ? 'About HealthCalcHub' : page}
        </span>
      </nav>

      {page === 'about' && (
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <header className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
              About HealthCalcHub
            </h1>
            <p className="text-lg text-teal-600 dark:text-teal-400 font-medium">
              Free. Private. Built in Pakistan.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-3">
              <span>{SITE_AUTHOR.byline}</span>
              <span aria-hidden="true">·</span>
              <span>Last Updated: {currentDate}</span>
            </div>
          </header>

          <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-base">
            <p>
              HealthCalcHub was created by <strong>{SITE_AUTHOR.name}</strong>, a student from <strong>{SITE_AUTHOR.location}</strong>, with one simple goal: to make health calculations easy, transparent, and private for everyone worldwide.
            </p>
            <p>
              The problem was clear. Every time someone searched online for a health calculator — BMR, TDEE, body fat percentage, daily calorie deficit, or macros — they landed on websites cluttered with aggressive popups, forced email capture forms before revealing results, or single confusing numbers with zero scientific explanation. None of them felt simple. None of them felt private.
            </p>
            <p>So HealthCalcHub was built to fix that.</p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 pt-4">Our Mission</h2>
            <p>
              HealthCalcHub exists to give people free, accurate, and instant health calculations — without signup, without email capture, and without tracking. Every calculator on this site:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Shows results from multiple scientific formulas</strong> so you see a realistic range, not a false-precision single number.
              </li>
              <li>
                <strong>Requires no signup, no email, and no personal profile</strong>.
              </li>
              <li>
                <strong>Runs entirely in your browser</strong> — your biometric inputs never leave your device or touch an external server.
              </li>
              <li>
                <strong>Includes a real-world adaptive adjustment guide</strong> so you know how to actually apply and calibrate the number across 2 to 3 weeks.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 pt-4">Why We Built This</h2>
            <p>
              As a student, I saw how confusing health and fitness metrics can be. People in Pakistan and across the world deserve tools that respect their time, intellect, and digital privacy. HealthCalcHub is my contribution to making health a little easier to understand — for everyone, everywhere.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 pt-4">Our Promise</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We will never ask for your email address to see a calculation result.</li>
              <li>We will never sell, store, or share your biometric data.</li>
              <li>We will always show you the exact scientific formula behind every number.</li>
              <li>We will keep all core calculators 100% free, forever.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 pt-4">Who We Are</h2>
            <p>
              HealthCalcHub is independently operated by <strong>{SITE_AUTHOR.name}</strong>, a student based in {SITE_AUTHOR.location}. We are not affiliated with any commercial pharmaceutical company or medical institution. Our calculators are provided for informational and educational purposes only and are not a substitute for professional clinical medical advice.
            </p>

            <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 my-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Contact & Support
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                We would love to hear from you — whether you have a question, found a calculation discrepancy, or want to suggest a new tool.
              </p>
              <div className="space-y-1.5 text-sm">
                <p><strong>Operator:</strong> {SITE_AUTHOR.name}</p>
                <p><strong>Email:</strong> <a href={`mailto:${SITE_AUTHOR.email}`} className="text-teal-600 dark:text-teal-400 underline">{SITE_AUTHOR.email}</a></p>
                <p><strong>Phone:</strong> <a href={`tel:${SITE_AUTHOR.phone}`} className="text-teal-600 dark:text-teal-400 underline">{SITE_AUTHOR.phone}</a></p>
                <p><strong>Location:</strong> {SITE_AUTHOR.location}</p>
                <p><strong>Response Time:</strong> Within 24–48 hours</p>
              </div>
            </div>
          </div>
        </article>
      )}

      {page === 'contact' && (
        <div>
          <header className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
              Contact Us
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400">
              We'd love to hear from you. Whether you have a question, found a bug, or want to suggest a new calculator, reach out directly.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Direct Info */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Direct Contact Information
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Email Address</p>
                      <a href={`mailto:${SITE_AUTHOR.email}`} className="text-teal-600 dark:text-teal-400 hover:underline">
                        {SITE_AUTHOR.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Direct Phone</p>
                      <a href={`tel:${SITE_AUTHOR.phone}`} className="text-teal-600 dark:text-teal-400 hover:underline">
                        {SITE_AUTHOR.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Location</p>
                      <p className="text-slate-600 dark:text-slate-400">{SITE_AUTHOR.location}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                  <p><strong>Response Time:</strong> We aim to respond within 24–48 hours.</p>
                  <p className="mt-2">
                    For business inquiries, partnerships, or advertising, please use the subject line <strong>"Business Inquiry"</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form with mailto fallback */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Send a Direct Message
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Fill out the form below to connect directly with Hamad Khan.
              </p>

              {formSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Message Prepared!</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Your email client was opened. If it did not launch automatically, feel free to write directly to{' '}
                    <a href={`mailto:${SITE_AUTHOR.email}`} className="text-teal-600 dark:text-teal-400 underline font-medium">
                      {SITE_AUTHOR.email}
                    </a>.
                  </p>
                </div>
              ) : (
                <form
                  action="mailto:hamadkahn2@gmail.com"
                  method="post"
                  encType="text/plain"
                  onSubmit={handleContactSubmit}
                  className="space-y-4 text-sm"
                >
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-colors min-h-[44px]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>

                  <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 text-center">
                    Or email directly:{' '}
                    <a
                      href="mailto:hamadkahn2@gmail.com"
                      className="text-teal-600 dark:text-teal-400 underline font-medium hover:opacity-80"
                    >
                      hamadkahn2@gmail.com
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {page === 'privacy' && (
        <article className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-6">
          <header className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last updated: {currentDate}
            </p>
          </header>

          <p>
            HealthCalcHub ("we", "our", "us") operates this website. This Privacy Policy explains how we handle information when you visit our site.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">1. Information We Collect</h2>
          <p>
            We do not collect, store, or transmit any personal health data you enter into our calculators. All calculations run entirely in your browser (client-side JavaScript). Your inputs never leave your device.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">2. Google AdSense & Third-Party Advertising</h2>
          <p>
            This site uses Google AdSense to display advertisements. Google, as a third-party vendor, uses cookies to serve ads based on your prior visits to this website or other websites.
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.
            </li>
            <li>
              You may opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads).
            </li>
            <li>
              Third-party vendors and ad networks may also serve ads on this site. You can opt out of some third-party vendor cookie usage at https://www.aboutads.info.
            </li>
            <li>
              Google uses the DART cookie to serve ads to users based on their visit to this site and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">3. Google Analytics</h2>
          <p>
            We may use Google Analytics to understand how visitors use our site. Google Analytics collects anonymous information such as pages visited, time on site, and general location (country level). This data cannot be used to identify you personally.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">4. Cookies</h2>
          <p>We use cookies for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Remembering your dark mode preference (stored locally in your browser)</li>
            <li>Google AdSense advertising (see section 2)</li>
            <li>Google Analytics (see section 3)</li>
          </ul>
          <p>
            You can control or disable cookies through your browser settings. Disabling cookies may affect some site functionality.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">5. GDPR / EU User Consent</h2>
          <p>
            For visitors in the European Economic Area (EEA) and the UK, we display a cookie consent banner before setting any non-essential cookies. You may accept all, reject non-essential, or customize your preferences at any time.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">6. Children's Privacy</h2>
          <p>
            Our site is not directed at children under 13. We do not knowingly collect personal information from children.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy. Changes will be posted on this page with an updated "Last updated" date.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">8. Contact</h2>
          <p>
            For privacy-related questions, contact:<br />
            <strong>{SITE_AUTHOR.name}</strong><br />
            Email: <a href={`mailto:${SITE_AUTHOR.email}`} className="text-teal-600 dark:text-teal-400 underline">{SITE_AUTHOR.email}</a><br />
            Phone: {SITE_AUTHOR.phone}<br />
            Location: {SITE_AUTHOR.location}
          </p>
        </article>
      )}

      {page === 'terms' && (
        <article className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-6">
          <header className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last updated: {currentDate}
            </p>
          </header>

          <p>By using HealthCalcHub, you agree to these Terms of Service.</p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">1. Acceptance of Terms</h2>
          <p>
            By accessing or using this website, you agree to be bound by these terms. If you do not agree, please do not use the site.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">2. Use of the Site</h2>
          <p>
            HealthCalcHub provides free health-related calculators for informational purposes only. You may use the site for personal, non-commercial purposes.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">3. No Medical Advice</h2>
          <p>
            The calculators and content on this site do not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before making health decisions. See our full Disclaimer.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">4. Intellectual Property</h2>
          <p>
            All content, design, code, and branding on HealthCalcHub are the property of {SITE_AUTHOR.name} unless otherwise noted. You may not reproduce, distribute, or create derivative works without permission.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">5. Limitation of Liability</h2>
          <p>
            HealthCalcHub is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the site or reliance on its results.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">6. Third-Party Links and Ads</h2>
          <p>
            Our site displays ads from Google AdSense and may contain links to third-party sites. We are not responsible for the content or practices of third-party sites.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">7. Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the site after changes constitutes acceptance.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">8. Contact</h2>
          <p>
            {SITE_AUTHOR.name}<br />
            Email: <a href={`mailto:${SITE_AUTHOR.email}`} className="text-teal-600 dark:text-teal-400 underline">{SITE_AUTHOR.email}</a><br />
            Phone: {SITE_AUTHOR.phone}
          </p>
        </article>
      )}

      {page === 'disclaimer' && (
        <article className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-6">
          <header className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Health Disclaimer
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last updated: {currentDate}
            </p>
          </header>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3 my-4">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-200 m-0">
              <strong>Emergency Notice:</strong> If you think you may have a medical emergency, call your doctor, healthcare provider, or emergency services immediately.
            </p>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Not Medical Advice</h2>
          <p>
            The calculators and information provided on HealthCalcHub are for informational and educational purposes only. They are not intended to be a substitute for professional medical advice, diagnosis, or treatment.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Always Consult a Professional</h2>
          <p>
            Always seek the advice of your physician or another qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or calculated on this website.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Accuracy</h2>
          <p>
            While we use well-established scientific formulas, individual results may vary. Health calculators provide estimates, not exact measurements. Always verify results with a healthcare professional.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">No Doctor-Patient Relationship</h2>
          <p>
            Use of this website does not create a doctor-patient relationship.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Contact</h2>
          <p>
            {SITE_AUTHOR.name}<br />
            Email: <a href={`mailto:${SITE_AUTHOR.email}`} className="text-teal-600 dark:text-teal-400 underline">{SITE_AUTHOR.email}</a><br />
            Phone: {SITE_AUTHOR.phone}
          </p>
        </article>
      )}

      {page === 'cookies' && (
        <article className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-6">
          <header className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Cookie Policy
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last updated: {currentDate}
            </p>
          </header>

          <p>
            This Cookie Policy explains how HealthCalcHub uses cookies and similar technologies to recognize you when you visit our website.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">What Are Cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Which Cookies Does HealthCalcHub Use?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Essential Preference Cookies:</strong> Used to remember your dark mode theme selection and your unit preferences (metric vs imperial). These are stored locally in your browser (HTML5 localStorage) and contain zero identifiable information.
            </li>
            <li>
              <strong>Advertising Cookies (Google AdSense):</strong> Google and its advertising partners use cookies (including the DoubleClick / DART cookie) to serve ads based on a user's prior visits to this website or other sites on the Internet.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Optional anonymous metrics to evaluate aggregated page visits and browser compatibility.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">How to Control Cookies</h2>
          <p>
            You have the right to decide whether to accept or reject non-essential cookies. You can exercise your cookie preferences through our on-site Cookie Consent Banner or by adjusting your browser settings (Chrome, Safari, Firefox, Edge) to block cookies.
          </p>
          <p>
            To opt out of Google personalized advertising, visit{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 underline">
              Google Ads Settings
            </a>.
          </p>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Contact Us</h2>
          <p>
            If you have questions about our use of cookies, contact {SITE_AUTHOR.name} at{' '}
            <a href={`mailto:${SITE_AUTHOR.email}`} className="text-teal-600 dark:text-teal-400 underline">{SITE_AUTHOR.email}</a>.
          </p>
        </article>
      )}
    </div>
  );
};
