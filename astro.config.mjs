// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import { SITE_URL } from './src/data/site.mjs';

// Brede tabellen mogen op mobiel binnen hun eigen kader scrollen, maar de
// pagina zelf nooit. Dat wordt in CSS opgelost (zie prose-vp in global.css),
// niet met een rehype-plugin: Astro 7 gebruikt Sätteri als markdown-processor
// en daarvoor zou @astrojs/markdown-remark apart geïnstalleerd moeten worden.

// Volledig statisch, en bewust géén Astro-adapter.
//
// Het formulier heeft één server-kant nodig, en die staat als losse Cloudflare
// Worker in worker/. De site zelf is een gewone statische build in dist/, die
// Cloudflare rechtstreeks van de edge bedient. De Worker komt alleen aan de
// beurt voor /api/contact. Zo hoeft er geen adapter in en blijft deze build 100
// procent statisch, wat een hoop KB en een hele runtime scheelt.
//
// Live zetten gebeurt met `npx wrangler deploy`. De koppeling tussen dist/ en de
// Worker staat in wrangler.jsonc. Zie de README.
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',

  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/bedankt') &&
        !page.includes('/api/'),
      i18n: undefined,
      serialize(item) {
        // Home en prijzen zijn de geldpagina's.
        if (item.url === `${SITE_URL}/`) item.priority = 1.0;
        else if (item.url.includes('/prijzen')) item.priority = 0.9;
        else if (item.url.includes('/kennis')) item.priority = 0.7;
        else item.priority = 0.6;

        // Wel lastmod, geen changefreq: Google heeft bevestigd changefreq
        // te negeren, maar gebruikt lastmod wel om te beslissen of het
        // de moeite is om opnieuw te crawlen.
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],

  // Geen markdown-config. `markdown.smartypants` is in Astro 7 deprecated en
  // de opvolger (een satteri-processor meegeven) is nog niet exporteerbaar.
  // Dus geldt de regel gewoon in de content zelf: schrijf nooit `--` in
  // markdown, want smart punctuation maakt daar een liggend streepje van.
  // Zie CLAUDE.md deel 2. `npm run check:streepjes` bewaakt dit.

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Geen aparte CSS-chunks. Alles inline waar het kan, scheelt requests.
      cssCodeSplit: false,
    },
  },

  build: {
    // Kritieke CSS inline, de rest als bestand. Geen render-blocking stylesheet.
    inlineStylesheets: 'auto',
  },

  image: {
    // sharp doet AVIF en WebP tijdens de build.
    responsiveStyles: true,
    layout: 'constrained',
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  devToolbar: {
    enabled: false,
  },
});
