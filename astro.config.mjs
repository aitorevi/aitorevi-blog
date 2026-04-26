import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import sitemap from '@astrojs/sitemap';
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import keystatic from "@keystatic/astro";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [
    tailwind(),
    icon(),
    react(),
    keystatic(),
    sitemap({
      filter: (page) => !page.includes('/print') && !page.includes('/keystatic'),
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          en: 'en-US',
        },
      },
    }),
  ],
  site: "https://www.aitorevi.dev/",
  build: {
    // Inline every stylesheet into the HTML <head>.
    // Rationale: the shared Tailwind utilities chunk (~12.8 KiB) is the
    // single biggest render-blocker (~650 ms). Linking it externally costs
    // a round-trip that dominates critical path in mobile. Inlining trades
    // ~14 KiB of extra HTML per page for three fewer blocking requests.
    inlineStylesheets: 'always',
  },
  redirects: {
    '/sitemap.xml': '/sitemap-index.xml',
    '/cv/en': '/en/cv',
    '/aviso-legal': '/legal-notice',
    '/aviso-legal/': '/legal-notice',
    '/privacidad': '/privacy',
    '/privacidad/': '/privacy',
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});