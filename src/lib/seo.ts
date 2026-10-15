/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CALCULATORS, SITE_AUTHOR } from './calculators';

export const DEFAULT_ORIGIN =
  'https://ais-pre-zfgcylqrdqvncvuxbjph2c-186109878983.asia-southeast1.run.app';

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  ogType: 'website' | 'article';
  twitterCard: 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  schemaGraph: Record<string, any>;
}

export function getCleanOrigin(customOrigin?: string): string {
  if (customOrigin && typeof customOrigin === 'string' && customOrigin.startsWith('http')) {
    return customOrigin.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    const org = window.location.origin;
    if (!org.includes('localhost')) {
      return org.replace(/\/$/, '');
    }
  }
  return DEFAULT_ORIGIN;
}

export function getSeoMetadata(path: string, rawOrigin?: string): SeoMetadata {
  const origin = getCleanOrigin(rawOrigin);
  const cleanPath = path.split('?')[0].split('#')[0] || '/';
  const ogImage = `${origin}/og-image.jpg`;

  // Organization Schema Component
  const organizationEntity = {
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name: 'HealthCalcHub',
    url: origin,
    logo: {
      '@type': 'ImageObject',
      url: `${origin}/og-image.png`,
      width: 1200,
      height: 630
    },
    founder: {
      '@type': 'Person',
      '@id': `${origin}/#author`,
      name: SITE_AUTHOR.name,
      email: SITE_AUTHOR.email,
      telephone: SITE_AUTHOR.phone,
      jobTitle: 'Health Researcher & Developer',
      nationality: {
        '@type': 'Country',
        name: 'Pakistan'
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'Pakistan'
      }
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_AUTHOR.phone,
      contactType: 'Customer Support',
      email: SITE_AUTHOR.email,
      availableLanguage: ['English', 'Urdu']
    }
  };

  // WebSite Schema Component
  const webSiteEntity = {
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    name: 'HealthCalcHub',
    url: origin,
    publisher: {
      '@id': `${origin}/#organization`
    },
    description:
      'Free, accurate, private, and instant health calculators without signup, email, or tracking.',
    inLanguage: 'en-US'
  };

  // 1. Calculator Tool Pages
  if (cleanPath.startsWith('/tools/')) {
    const slug = cleanPath.replace('/tools/', '').replace(/\/$/, '');
    const calc = CALCULATORS.find((c) => c.slug === slug);

    if (calc) {
      const canonicalUrl = `${origin}/tools/${calc.slug}`;
      const pageTitle = calc.metaTitle;
      const pageDescription = calc.metaDescription;

      const breadcrumbEntity = {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${origin}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: calc.category,
            item: `${origin}/#calculators`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: calc.title,
            item: canonicalUrl
          }
        ]
      };

      const medicalCalculatorEntity = {
        '@type': 'MedicalCalculator',
        '@id': `${canonicalUrl}#calculator`,
        name: calc.title,
        headline: calc.h1,
        description: calc.shortDescription,
        medicalSpecialty: calc.medicalSpecialty,
        estimatesRiskOf: {
          '@type': 'MedicalEntity',
          name: calc.estimatesRiskOf
        },
        author: {
          '@id': `${origin}/#author`
        },
        publisher: {
          '@id': `${origin}/#organization`
        },
        dateModified: '2026-10-14',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      };

      const medicalWebPageEntity = {
        '@type': 'MedicalWebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: pageTitle,
        description: pageDescription,
        isPartOf: {
          '@id': `${origin}/#website`
        },
        breadcrumb: {
          '@id': `${canonicalUrl}#breadcrumb`
        },
        mainEntity: {
          '@id': `${canonicalUrl}#calculator`
        },
        dateModified: '2026-10-14',
        lastReviewed: '2026-10-14',
        inLanguage: 'en-US',
        citation: calc.citations.map((c) => ({
          '@type': 'ScholarlyArticle',
          name: c.text,
          url: c.url,
          publication: c.source,
          datePublished: String(c.year)
        }))
      };

      const faqPageEntity = {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        isPartOf: {
          '@id': `${canonicalUrl}#webpage`
        },
        mainEntity: calc.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer
          }
        }))
      };

      return {
        title: pageTitle,
        description: pageDescription,
        canonicalUrl,
        ogTitle: pageTitle,
        ogDescription: pageDescription,
        ogUrl: canonicalUrl,
        ogImage,
        ogType: 'article',
        twitterCard: 'summary_large_image',
        twitterTitle: pageTitle,
        twitterDescription: pageDescription,
        twitterImage: ogImage,
        schemaGraph: {
          '@context': 'https://schema.org',
          '@graph': [
            webSiteEntity,
            organizationEntity,
            breadcrumbEntity,
            medicalCalculatorEntity,
            medicalWebPageEntity,
            faqPageEntity
          ]
        }
      };
    }
  }

  // 2. Informational & Legal Pages
  const staticPages: Record<
    string,
    { title: string; desc: string; name: string }
  > = {
    '/about': {
      title: 'About HealthCalcHub — Free, Private Health Calculators',
      desc: 'HealthCalcHub is an independent health calculator platform founded by Hamad Khan in Pakistan to provide private, accurate, and instant biometric utilities.',
      name: 'About HealthCalcHub'
    },
    '/contact': {
      title: 'Contact HealthCalcHub — Support & Feedback',
      desc: 'Get in touch with Hamad Khan for inquiries, feedback, bug reports, and suggestions regarding HealthCalcHub tools and formulas.',
      name: 'Contact HealthCalcHub'
    },
    '/privacy': {
      title: 'Privacy Policy — HealthCalcHub',
      desc: 'HealthCalcHub does not collect, sell, or store biometric inputs. All computations run 100% locally inside your web browser for complete privacy.',
      name: 'Privacy Policy'
    },
    '/terms': {
      title: 'Terms of Service — HealthCalcHub',
      desc: 'Terms of Service for accessing and using HealthCalcHub calculators, biometric calculators, and educational health utilities.',
      name: 'Terms of Service'
    },
    '/disclaimer': {
      title: 'Health & Medical Disclaimer — HealthCalcHub',
      desc: 'Calculations provided on HealthCalcHub are for educational purposes only and are not a substitute for clinical medical diagnosis or professional consultation.',
      name: 'Medical Disclaimer'
    },
    '/cookies': {
      title: 'Cookie Policy — HealthCalcHub',
      desc: 'Information about cookie preferences, local storage, and Google Consent Mode v2 on HealthCalcHub.',
      name: 'Cookie Policy'
    }
  };

  const matchedStatic = staticPages[cleanPath];
  if (matchedStatic) {
    const canonicalUrl = `${origin}${cleanPath}`;
    return {
      title: matchedStatic.title,
      description: matchedStatic.desc,
      canonicalUrl,
      ogTitle: matchedStatic.title,
      ogDescription: matchedStatic.desc,
      ogUrl: canonicalUrl,
      ogImage,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: matchedStatic.title,
      twitterDescription: matchedStatic.desc,
      twitterImage: ogImage,
      schemaGraph: {
        '@context': 'https://schema.org',
        '@graph': [
          webSiteEntity,
          organizationEntity,
          {
            '@type': 'WebPage',
            '@id': `${canonicalUrl}#webpage`,
            url: canonicalUrl,
            name: matchedStatic.name,
            description: matchedStatic.desc,
            isPartOf: { '@id': `${origin}/#website` },
            inLanguage: 'en-US'
          }
        ]
      }
    };
  }

  // 3. Homepage (Default Hub)
  const homeCanonical = `${origin}/`;
  const homeTitle =
    'HealthCalcHub — Free Health Calculators | Accurate, Private, Instant';
  const homeDesc =
    'Free, accurate, private, and instant health calculators by Hamad Khan. Calculate BMR, TDEE, Body Fat, Macros, BMI, Water Intake, Heart Rate, and more.';

  const itemListEntity = {
    '@type': 'ItemList',
    '@id': `${origin}/#calculator-list`,
    name: 'Featured Health & Fitness Calculators',
    itemListElement: CALCULATORS.map((c, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: c.title,
      url: `${origin}/tools/${c.slug}`
    }))
  };

  return {
    title: homeTitle,
    description: homeDesc,
    canonicalUrl: homeCanonical,
    ogTitle: homeTitle,
    ogDescription: homeDesc,
    ogUrl: homeCanonical,
    ogImage,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: homeTitle,
    twitterDescription: homeDesc,
    twitterImage: ogImage,
    schemaGraph: {
      '@context': 'https://schema.org',
      '@graph': [
        webSiteEntity,
        organizationEntity,
        itemListEntity,
        {
          '@type': 'WebPage',
          '@id': `${origin}/#webpage`,
          url: homeCanonical,
          name: homeTitle,
          description: homeDesc,
          isPartOf: { '@id': `${origin}/#website` },
          mainEntity: { '@id': `${origin}/#calculator-list` },
          inLanguage: 'en-US'
        }
      ]
    }
  };
}

/**
 * Synchronizes the browser head with pristine 10/10 SEO metadata
 */
export function updateDocumentSeo(path: string): void {
  if (typeof document === 'undefined') return;

  const seo = getSeoMetadata(path);

  // 1. Document Title
  document.title = seo.title;

  // 2. Helper to set or create meta/link elements
  const setMetaTag = (attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const setLinkTag = (rel: string, href: string) => {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  };

  // 3. Core Meta Tags
  setMetaTag('name', 'description', seo.description);
  setLinkTag('canonical', seo.canonicalUrl);

  // 4. OpenGraph Tags
  setMetaTag('property', 'og:title', seo.ogTitle);
  setMetaTag('property', 'og:description', seo.ogDescription);
  setMetaTag('property', 'og:url', seo.ogUrl);
  setMetaTag('property', 'og:type', seo.ogType);
  setMetaTag('property', 'og:image', seo.ogImage);
  setMetaTag('property', 'og:site_name', 'HealthCalcHub');

  // 5. Twitter Card Tags
  setMetaTag('name', 'twitter:card', seo.twitterCard);
  setMetaTag('name', 'twitter:title', seo.twitterTitle);
  setMetaTag('name', 'twitter:description', seo.twitterDescription);
  setMetaTag('name', 'twitter:url', seo.ogUrl);
  setMetaTag('name', 'twitter:image', seo.twitterImage);

  // 6. Robots directive for maximum search snippet display
  setMetaTag(
    'name',
    'robots',
    'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  );

  // 7. Unified Clean JSON-LD Schema
  let schemaScript = document.getElementById(
    'site-schema-graph'
  ) as HTMLScriptElement | null;
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'site-schema-graph';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify(seo.schemaGraph, null, 2);

  // 8. Remove any obsolete or duplicate inline scripts
  const oldCalculatorSchema = document.getElementById('calculator-schema');
  if (oldCalculatorSchema && oldCalculatorSchema !== schemaScript) {
    oldCalculatorSchema.remove();
  }
}
