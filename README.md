# HealthCalcHub — Production-Ready Health Calculator Hub

HealthCalcHub is a production-ready, SEO-optimized, mobile-first static health calculation hub built for instant, private health calculations with zero signup, client-side execution, multi-formula validation, and comprehensive Google AdSense and GDPR compliance.

- **Author & Operator:** HAMAD KHAN
- **Role:** Student & Independent Software Developer
- **Location:** Pakistan
- **Email:** hamadkahn2@gmail.com
- **Phone:** +923175698828

---

## Key Features

1. **12 Comprehensive Health Calculators**:
   - **BMR Calculator**: Basal Metabolic Rate via Mifflin-St Jeor, Revised Harris-Benedict, and Katch-McArdle formulas side-by-side.
   - **TDEE Calculator**: Total Daily Energy Expenditure across 5 activity tiers with real-world tooltips and cautionary Sedentary guidance.
   - **Body Fat Calculator**: U.S. Navy circumference method with ACE category classifications and lean body mass metrics.
   - **Macro Calculator**: Evidence-based protein, dietary fat, and carbohydrate breakdown with interactive visual nutrient split charts.
   - **Water Intake Calculator**: Hydration volumes in Liters, Ounces, and Glasses tailored for weight, exercise, and climate.
   - **Ideal Weight Calculator**: Devine, Robinson, Miller, and Hamwi medical equations compared with healthy BMI ranges.
   - **One Rep Max (1RM) Calculator**: Brzycki, Epley, and Lombardi strength models with a complete percentage-based working weight table.
   - **Heart Rate Zone Calculator**: Tanaka maximum heart rate and Karvonen heart rate reserve targeting Zones 1 through 5.
   - **Protein Intake Calculator**: Daily and per-meal leucine-trigger targets for endurance, hypertrophy, and fat loss.
   - **Sleep Calculator**: 90-minute ultradian sleep cycle calculator with a 14-minute average sleep latency buffer.
   - **Calorie Deficit Calculator**: Conservative, moderate, and aggressive daily calorie targets with projected fat-loss milestone dates.
   - **BMI Calculator**: Standard WHO Body Mass Index with BMI Prime and muscularity clinical caveats.

2. **Differentiator Features**:
   - **Multi-Formula Results**: Realistic variance ranges from 2–3 peer-reviewed formulas.
   - **Adaptive Adjustment Guide**: Actionable 2–3 week calibration instructions for real-world body composition tracking.
   - **Zero Email Gate**: Instant calculation results in the browser; no popups or email captures.
   - **Activity Multipliers with Real-World Tooltips**: Practical guidance to prevent activity overestimation.
   - **Input Validation**: Guardrails preventing physiologically impossible combinations.

3. **SEO & AdSense Compliance**:
   - 400–600+ word educational articles on every tool page.
   - Interactive FAQ accordions with FAQPage JSON-LD schema markup.
   - BreadcrumbList, WebApplication, and Organization structured data.
   - Complete legal pages: `/about`, `/contact`, `/privacy` (with Google AdSense & DART cookie clauses), `/terms`, `/disclaimer`, `/cookies`.
   - GDPR/UK cookie consent banner with localStorage persistence.
   - Static `public/ads.txt`, `public/robots.txt`, and `public/sitemap.xml`.
   - AdSense pre-application interactive checklist built directly into the UI.

---

## Deployment Instructions

### Deploy to Netlify
1. Run `npm run build` to generate the production static distribution in `/dist`.
2. Connect your Git repository to Netlify.
3. Configure Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add your custom domain in Netlify DNS (e.g., `healthcalchub.com`). Netlify will provision an automated Let's Encrypt SSL/HTTPS certificate.
5. Verify `/ads.txt` and `/robots.txt` load cleanly from your domain root.

### Deploy to Vercel
1. Import the project repository in your Vercel dashboard.
2. Select **Vite** or Other framework preset.
3. Build & Output settings:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Click **Deploy**.
5. Connect your custom domain under Project Settings -> Domains.

---

## Google AdSense Verification Steps

1. Deploy the site to your custom domain with HTTPS active.
2. Ensure the site has been live for at least 2–4 weeks and receives initial organic visitors.
3. Submit `https://yourdomain.com/sitemap.xml` in Google Search Console.
4. Verify all 12 calculator pages, legal pages, and the cookie banner are operating without errors.
5. In `index.html` and `src/components/AdUnit.tsx`, replace `ca-pub-XXXXXXXX` with your approved Google AdSense Publisher ID.
6. In `public/ads.txt`, replace `pub-XXXXXXXX` with your exact publisher ID.
