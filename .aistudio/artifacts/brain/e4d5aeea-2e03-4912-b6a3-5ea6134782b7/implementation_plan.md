# HealthCalcHub — Production-Ready & AdSense-Compliant Health Calculator Hub

An AdSense-ready, mobile-first static health calculation hub built for instant, private health calculations with zero signup, client-side execution, multi-formula validation, and comprehensive legal and SEO compliance.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions have been confirmed through user feedback and prompt requirements:
> - **Suite Scope**: Delivering all **12 health calculators** immediately (BMR, TDEE, Body Fat, Macros, Water Intake, Ideal Weight, One Rep Max, Heart Rate Zones, Protein Intake, Sleep Cycles, Calorie Deficit, BMI) to satisfy Google AdSense's requirement for substantial original utility and multi-page content.
> - **Google AdSense Phase 1 Posture**: Operating in clean pre-approval mode with valid publisher script placeholders (`ca-pub-XXXXXXXX`), clean ad slot styling hooks, and root `/ads.txt` so the site is 100% compliant and ready for Google review without premature ad script errors.
> - **Color Scheme & Ergonomics**: Clinical Health Teal (`#0D9488`), Crisp Slate Slate-50/900 canvas, accessible dark mode toggle persisted in `localStorage`, and touch-friendly $\ge 44\text{px}$ targets.
> - **Author & Trust Transparency**: Fully attributing site ownership and review by HAMAD KHAN (Student, Pakistan, hamadkahn2@gmail.com, +923175698828) across schema markup, legal footers, and dedicated trust pages.

---

## 1. Overview & Core Concept

- **What It Does**: HealthCalcHub provides instant, browser-based biometric and nutritional calculators. Every calculator executes client-side without collecting emails, tracking cookies, or sending telemetry.
- **Target Audience / Persona**: Everyday fitness enthusiasts, gymgoers, students, healthcare-conscious individuals, and mobile users looking for immediate, honest health estimates without signup walls or misleading single-number precision.
- **Key Value Proposition**:
  1. *Multi-Formula Reality Range*: Instead of a single misleading number, calculations contrast standard scientific models (e.g., Mifflin-St Jeor vs. Revised Harris-Benedict vs. Katch-McArdle).
  2. *Adaptive Adjustment Guidance*: Practical 2-3 week calibration instructions accompanying every output.
  3. *Zero-Gate Privacy*: 100% in-browser calculations, zero network transmission of health metrics, instant results, and one-click copy to clipboard.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Homepage Discovery**: Visitors land on the clean hero ("Free Health Calculators — Accurate, Private, Instant"), browse categorized calculator cards with immediate keyword clarity, and can instantly jump to any tool or search/filter by goal (Weight Management, Nutrition, Fitness Performance, Daily Wellness).
2. **Interactive Calculation**:
   - Seamless Metric / Imperial toggle with instant unit conversion (kg/lbs, cm/ft-in).
   - Validation with field-level alerts for out-of-bound physiological inputs.
   - Smooth calculation state with responsive feedback $\le 200\text{ms}$.
   - Results display a visual range bar, multi-formula breakdown table, and copyable summary.
   - Interactive charts (e.g. SVG donut/pie for Macro splits, Navy circumference comparison for Body Fat, heart rate training bands).
3. **SEO Deep-Dive Content**: Every calculator page contains an in-depth 400–600+ word educational article detailing the clinical formula, sample calculations, who it is for, limitations, and an interactive FAQ accordion.
4. **Legal & Compliance**: Dedicated standalone pages for About (with author Hamad Khan), Contact (with direct contact form and mailto fallback), Privacy Policy (explicit AdSense/DART disclosures), Terms of Service, Medical Disclaimer, and Cookie Policy.
5. **Cookie Consent Banner**: GDPR/EEA compliant banner storing acceptance in `localStorage` with granular options (Essential only vs. Analytics/Ads).

### Visual Identity & Theme Tokens

- **Aesthetic Direction**: Clinical clarity, modern health tech, editorial typography, zero-pill metadata discipline, and anti-slop visual restraint.
- **Color Palette**:
  - Neutral Canvas: Light mode `bg-slate-50` / `bg-white`, Dark mode `bg-slate-950` / `bg-slate-900`.
  - Brand Accent: Primary Teal `teal-600` (`#0D9488`), hover `teal-700`, subtle tint `teal-500/10`.
  - Structural Borders: Hairline borders `border-slate-200` (dark: `border-slate-800`).
  - Text: High contrast `text-slate-900` (dark: `text-slate-100`), muted prose `text-slate-600` (dark: `text-slate-400`).
- **Typography & Hierarchy**:
  - Geometric Display Sans for headings (`Plus Jakarta Sans` / modern sans fallback), tabular figures for all numerical readouts (`tabular-nums font-mono`).
  - Single-line controls (`whitespace-nowrap shrink-0`) with 3-zone top bar contract.

---

## 3. Key Product Decisions & Trade-Offs

- **Client-Side Architecture (Static SPA)**:
  - *Decision*: Fully self-contained client-side calculation engine with hash/pushState navigation.
  - *Rationale*: Guarantees zero latency, complete user privacy (inputs never leave the device), and zero hosting infrastructure cost for deployment on Netlify or Vercel.
- **Unified Typed Calculator Registry (`src/lib/calculators.ts`)**:
  - *Decision*: Static metadata, formula logic, input schemas, FAQs, and SEO articles co-located as strongly typed TypeScript structures.
  - *Rationale*: Allows trivial addition of future calculators (Week 2–4 expansion or new categories) without breaking site layout or schema generation.
- **Pre-Approval AdSense Safety**:
  - *Decision*: Ad slot components maintain compliant DOM layout placeholders with subtle indicators in dev/test, avoiding policy violations during the initial 2–4 week organic traffic incubation period.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Browser Client                                │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Top Bar: Brand ("HealthCalcHub") | Nav Links | Dark Mode Toggle │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                  │                                     │
│         ┌────────────────────────┴────────────────────────┐            │
│         ▼                                                 ▼            │
│   ┌───────────────────────────┐             ┌──────────────────────┐   │
│   │    Homepage & Tool Grid   │             │ Dedicated Tool Pages │   │
│   │  • Hero & Trust Signals   │             │  • 12 Calculator UIs │   │
│   │  • Category Filter Tabs   │             │  • Range Engine      │   │
│   │  • 12 Tool Cards          │             │  • 500w SEO Article  │   │
│   │  • Hamad Khan Byline      │             │  • FAQ Accordion     │   │
│   └───────────────────────────┘             │  • JSON-LD Schemas   │   │
│                                             └──────────────────────┘   │
│                                  │                        │            │
│         ┌────────────────────────┴────────────────────────┘            │
│         ▼                                                              │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Shared Engines & Registry (/src/lib/calculators.ts)            │   │
│   │  • Mifflin, Harris-Benedict, Katch-McArdle, U.S. Navy, etc.    │   │
│   │  • Unit Conversion (Metric <-> Imperial)                       │   │
│   │  • LocalStorage (Theme, Unit preference, Cookie consent)       │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                  │                                     │
│   ┌──────────────────────────────┴─────────────────────────────────┐   │
│   │ Footer & Compliance                                            │   │
│   │  • Legal Pages: /about, /contact, /privacy, /terms, /disclaimer│   │
│   │  • HAMAD KHAN | hamadkahn2@gmail.com | +923175698828 | Pakistan│   │
│   │  • GDPR Cookie Consent Banner                                  │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### 12 Complete Health Calculators Included

1. **BMR Calculator**: Mifflin-St Jeor, Revised Harris-Benedict, Katch-McArdle (with Body Fat % input). Displays full range and variance.
2. **TDEE Calculator**: All 3 BMR formulas multiplied across 5 activity tiers with real-world tooltips and cautionary Sedentary recommendations.
3. **Body Fat Calculator**: U.S. Navy Circumference method (Neck, Waist, Hip for females) with visual category chart and lean mass breakdown.
4. **Macro Calculator**: Protein (1.6–2.2g/kg), Fat (25%), Carbohydrates (remaining calories) with interactive SVG macronutrient distribution chart.
5. **Water Intake Calculator**: Weight, exercise level, and climate intensity with liters, ounces, and 250ml glass counts.
6. **Ideal Weight Calculator**: Robinson, Miller, Devine, and Hamwi clinical formulas contrasted in a clear range.
7. **One Rep Max (1RM) Calculator**: Brzycki, Epley, and Lombardi formulas side-by-side with %RM training percentage table (95% down to 50%).
8. **Heart Rate Zone Calculator**: Karvonen formula (Resting Heart Rate + Max Heart Rate reserve) and Tanaka formula ($208 - 0.7 \times \text{Age}$) mapping Zones 1 through 5.
9. **Protein Intake Calculator**: Targeted protein goals based on activity goal (Sedentary, Endurance, Hypertrophy, Aggressive Fat Loss).
10. **Sleep Calculator**: 90-minute ultradian sleep cycle calculator computing optimal bedtimes and wake times.
11. **Calorie Deficit Calculator**: Safe target deficit (15% to 25%), projected weekly rate of weight loss, and date milestones.
12. **BMI Calculator**: Body Mass Index with WHO categorization, BMI Prime, and healthy weight range for height.

### AdSense & SEO Assets

- `public/ads.txt`: Standard Google AdSense authorization format.
- `public/robots.txt`: Open crawler access for Googlebot, Bingbot, and modern indexers.
- Dynamic JSON-LD structured data injecting `WebApplication`, `BreadcrumbList`, `FAQPage`, and `Organization` schemas.
