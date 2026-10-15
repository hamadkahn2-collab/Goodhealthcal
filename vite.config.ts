import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { CALCULATORS } from './src/lib/calculators';
import { getSeoMetadata, getCleanOrigin } from './src/lib/seo';

function seoAndSitemapPlugin(): Plugin {
  return {
    name: 'seo-and-sitemap-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];
        const rawHost = req.headers.host || 'ais-pre-zfgcylqrdqvncvuxbjph2c-186109878983.asia-southeast1.run.app';
        const host = rawHost.includes('localhost')
          ? 'ais-pre-zfgcylqrdqvncvuxbjph2c-186109878983.asia-southeast1.run.app'
          : rawHost;
        const origin = `https://${host}`;

        if (url === '/sitemap.xml') {
          const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${CALCULATORS.map(
  (c) => `  <url>
    <loc>${origin}/tools/${c.slug}</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`
).join('\n')}
  <url>
    <loc>${origin}/about</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${origin}/contact</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${origin}/privacy</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${origin}/terms</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${origin}/disclaimer</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${origin}/cookies</loc>
    <lastmod>2026-10-14</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.statusCode = 200;
          res.end(sitemapXml);
          return;
        }

        if (url === '/robots.txt') {
          const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.statusCode = 200;
          res.end(robotsTxt);
          return;
        }

        next();
      });
    },
    transformIndexHtml(html, ctx) {
      const anyCtx = (ctx || {}) as any;
      const reqUrl = ctx?.originalUrl || anyCtx.path || anyCtx.req?.url || '/';
      const rawHost =
        anyCtx.req?.headers?.host ||
        'ais-pre-zfgcylqrdqvncvuxbjph2c-186109878983.asia-southeast1.run.app';
      const host = rawHost.includes('localhost')
        ? 'ais-pre-zfgcylqrdqvncvuxbjph2c-186109878983.asia-southeast1.run.app'
        : rawHost;
      const origin = `https://${host}`;

      let transformed = html;
      transformed = transformed.replaceAll('https://healthcalchub.com', origin);

      const seo = getSeoMetadata(reqUrl, origin);

      // Replace title
      transformed = transformed.replace(
        /<title>.*?<\/title>/,
        `<title>${seo.title}</title>`
      );

      // Replace description
      transformed = transformed.replace(
        /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
        `<meta name="description" content="${seo.description}" />`
      );

      // Replace canonical
      transformed = transformed.replace(
        /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/,
        `<link rel="canonical" href="${seo.canonicalUrl}" />`
      );

      // Replace og:title & twitter:title
      transformed = transformed.replace(
        /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/,
        `<meta property="og:title" content="${seo.ogTitle}" />`
      );
      transformed = transformed.replace(
        /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/,
        `<meta name="twitter:title" content="${seo.twitterTitle}" />`
      );

      // Replace og:description & twitter:description
      transformed = transformed.replace(
        /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/,
        `<meta property="og:description" content="${seo.ogDescription}" />`
      );
      transformed = transformed.replace(
        /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/,
        `<meta name="twitter:description" content="${seo.twitterDescription}" />`
      );

      // Replace og:url & twitter:url
      transformed = transformed.replace(
        /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/,
        `<meta property="og:url" content="${seo.ogUrl}" />`
      );
      transformed = transformed.replace(
        /<meta\s+name="twitter:url"\s+content=".*?"\s*\/?>/,
        `<meta name="twitter:url" content="${seo.ogUrl}" />`
      );

      // Replace og:type
      transformed = transformed.replace(
        /<meta\s+property="og:type"\s+content=".*?"\s*\/?>/,
        `<meta property="og:type" content="${seo.ogType}" />`
      );

      // Replace or inject site-schema-graph
      const schemaJson = JSON.stringify(seo.schemaGraph, null, 2);
      if (transformed.includes('id="site-schema-graph"')) {
        transformed = transformed.replace(
          /<script\s+type="application\/ld\+json"\s+id="site-schema-graph">[\s\S]*?<\/script>/,
          `<script type="application/ld+json" id="site-schema-graph">\n    ${schemaJson}\n    </script>`
        );
      } else {
        transformed = transformed.replace(
          '</head>',
          `    <script type="application/ld+json" id="site-schema-graph">\n    ${schemaJson}\n    </script>\n  </head>`
        );
      }

      // Remove any obsolete calculator-schema script
      transformed = transformed.replace(
        /<script\s+type="application\/ld\+json"\s+id="calculator-schema">[\s\S]*?<\/script>/g,
        ''
      );

      return transformed;
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), seoAndSitemapPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      cors: true,
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
